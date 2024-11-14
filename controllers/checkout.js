const Checkout = require('../models/checkout');
const Product = require('../models/product');
const Order = require('../models/order');

const { exportCheckoutToExcel, sendEmailWithAttachment } = require('../utils/writeExcel.js');

exports.index = async (req, res) => {
    try {
        // リクエストから日付を取得し、フォーマットを調整
        const date = req.query.date ? new Date(req.query.date) : undefined;
        let paidCheckouts, unpaidCheckouts;

        if (date) {
            // 日付を始まりと終わりの範囲に設定
            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));

            // 支払い済みと未払いのチェックアウトを日付範囲で取得
            paidCheckouts = await Checkout.find({
                isPaid: true,
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            }).populate('products.product');

            unpaidCheckouts = await Checkout.find({
                isPaid: false,
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            }).populate('products.product');
        } else {
            paidCheckouts = await Checkout.find({
                isPaid: true,
            }).populate('products.product');

            unpaidCheckouts = await Checkout.find({
                isPaid: false,
            }).populate('products.product');
        }

        res.render('checkout/index', { paidCheckouts, unpaidCheckouts, date });
    } catch (error) {
        console.error('Error fetching checkouts:', error);
        req.flash('error', '会計情報の取得に失敗しました。');
        res.redirect('/'); // 適切なリダイレクト先に変更
    }
};

exports.create = async (req, res) => {
    res.render('checkout/new');
};

exports.createPost = async (req, res) => {
    try {
        // 会計情報を保存
        const newCheckout = new Checkout(req.body);
        await newCheckout.save();

        for (let orderId of req.body.orders) {
            const order = await Order.findById(orderId);
            order.isPaid = true;
            await order.save();
        }

        // 成功時のフラッシュメッセージとリダイレクト
        req.flash('success', '会計の確定が完了しました');
        res.redirect(`/checkout/${newCheckout._id}`);
    } catch (error) {
        console.error('Error saving checkout:', error);

        // エラーメッセージの表示とリダイレクト
        req.flash('error', '会計の確定に失敗しました。再度お試しください。');
        res.redirect('/checkout/create');
    }
};

exports.show = async (req, res) => {
    const id = req.params.id;
    try {
        const checkout = await Checkout.findById(id).populate('products.product');

        res.render('checkout/show', { checkout });
    } catch (error) {
        console.error('Error fetching checkout:', error);
        req.flash('error', '会計情報の取得に失敗しました。');
        res.redirect('/checkout'); // 適切なリダイレクト先に変更
    }
};

exports.edit = async (req, res) => {
    const id = req.params.id;
    try {
        const checkout = await Checkout.findById(id).populate('products.product');

        const foodProducts = await Product.find({ category: 'food' });
        const drinkProducts = await Product.find({ category: 'drink' });
        const otherProducts = await Product.find({ category: 'others' });

        res.render('checkout/edit', { checkout, foodProducts, drinkProducts, otherProducts });
    } catch (error) {
        console.error('Error fetching edit checkout:', error);
        req.flash('error', '会計情報の編集に失敗しました。');
        res.redirect('/checkout');
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;
    try {
        await Checkout.findByIdAndUpdate(id, req.body);

        const checkout = await Checkout.findById(id);
        checkout.coupon = '';
        await checkout.save();

        req.flash('success', '会計情報が更新されました。');
        res.redirect(`/checkout/${id}`);
    } catch (error) {
        console.error('Error updating checkout:', error);
        req.flash('error', '会計情報の更新に失敗しました。');
        res.redirect(`/checkout/${id}/edit`); // 編集ページにリダイレクト
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        await Checkout.findByIdAndDelete(id);

        req.flash('success', '会計が削除されました。');
        res.redirect('/checkout');
    } catch (error) {
        console.error('Error deleting checkout:', error);
        req.flash('error', '会計の削除に失敗しました。');
        res.redirect(`/checkout/${id}`);
    }
};

exports.paid = async (req, res) => {
    const id = req.params.id;
    try {
        const checkout = await Checkout.findById(id).populate('products.product');
        checkout.isPaid = true;
        await checkout.save();

        req.flash('success', '会計が完了しました。');
        res.redirect('/checkout');
    } catch (error) {
        console.error('Error marking checkout as paid:', error);
        req.flash('error', '支払い処理に失敗しました。');
        res.redirect(`/checkout/${id}`);
    }
};

exports.sendEmail = async (req, res) => {
    const { date } = req.params;
    const { email } = req.body;
    let checkouts;

    if (date === 'all') {
        // 全ての支払済みデータを取得
        checkouts = await Checkout.find({ isPaid: true }).populate('products.product');
    } else {
        // 特定の日付の支払済みデータを取得
        const targetDate = new Date(date);
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

        checkouts = await Checkout.find({
            isPaid: true,
            createdAt: { $gte: startOfDay, $lt: endOfDay }
        }).populate('products.product');
    }

    if (checkouts.length) {
        const path = await exportCheckoutToExcel(checkouts, date);
        await sendEmailWithAttachment(path, email);
        req.flash('success', '会計情報のExcelファイルを送信しました');
    } else {
        req.flash('error', '会計情報がまだ存在しません');
    }

    res.redirect('/checkout');
};

exports.coupon = async (req, res) => {
    const { coupon, id } = req.params;
    const checkout = await Checkout.findById(id);

    let couponText;
    if (checkout.coupon === 'tenpercent') {
        couponText = '10%引き';
    } else if (checkout.coupon === '100yen') {
        couponText = '100円引き';
    }

    if (checkout.coupon === coupon) {
        // 同じクーポンコードが再適用された場合、クーポンを無効化して元の価格に戻す
        if (coupon === 'tenpercent') {
            checkout.totalPrice = checkout.totalPrice / 0.9;
        } else if (coupon === '100yen') {
            checkout.totalPrice = checkout.totalPrice + 100;
        }
        checkout.coupon = ''; // クーポンを無効化
        await checkout.save();
        req.flash('success', `${couponText}クーポンが取り消されました`);
    } else {
        if (checkout.coupon === 'tenpercent') {
            checkout.totalPrice = checkout.totalPrice / 0.9;
        } else if (checkout.coupon === '100yen') {
            checkout.totalPrice = checkout.totalPrice + 100;
        }

        if (coupon === 'tenpercent') {
            checkout.totalPrice = Math.max(checkout.totalPrice * 0.9, 0); // 最低価格を0に制限
            couponText = '10%引き';
        } else if (coupon === '100yen') {
            checkout.totalPrice = Math.max(checkout.totalPrice - 100, 0); // 最低価格を0に制限
            couponText = '100円引き';
        }

        checkout.coupon = coupon;
        await checkout.save();

        req.flash('success', `${couponText}クーポンが適用されました`);
    }

    res.redirect(`/checkout/${id}`);
};
