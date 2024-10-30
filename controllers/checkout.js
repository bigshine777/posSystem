const Checkout = require('../models/checkout');
const Product = require('../models/product');
const Order = require('../models/order');

exports.index = async (req, res) => {
    try {
        const paidCheckouts = await Checkout.find({ isPaid: true }).populate('products.product');
        const unpaidCheckouts = await Checkout.find({ isPaid: false }).populate('products.product');

        res.render('checkout/index', { paidCheckouts, unpaidCheckouts });
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
        await Checkout.findByIdAndUpdate(id,req.body);

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

        for (let orderId of checkout.orders) {
            const order = await Order.findById(orderId);
            order.isPaid = true;
            await order.save();
        }

        req.flash('success', '会計が完了しました。');
        res.redirect('/checkout');
    } catch (error) {
        console.error('Error marking checkout as paid:', error);
        req.flash('error', '支払い処理に失敗しました。');
        res.redirect(`/checkout/${id}`);
    }
};
