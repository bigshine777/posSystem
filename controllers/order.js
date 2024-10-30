const Order = require("../models/order");
const Product = require('../models/product');
const wss = require('../app.js');

// ブロードキャスト関数の定義（すべてのクライアントに通知）
wss.broadcast = function broadcast(data) {
    if (wss.clients) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    }
};

// 注文のホームページを表示する（GET）
exports.index = async (req, res) => {
    try {
        console.log(wss);
        const currentOrders = await Order.find({ isServed: false }).populate('products.product');
        const previousOrders = await Order.find({ isServed: true }).populate('products.product');

        res.render('order/index', { currentOrders, previousOrders });
    } catch (error) {
        req.flash('error', '注文の取得中にエラーが発生しました。');
        res.redirect('/'); // エラーページまたはインデックスにリダイレクト
    }
};

// 新規注文ページを表示する（GET）
exports.create = async (req, res) => {
    try {
        const foodProducts = await Product.find({ category: 'food' });
        const drinkProducts = await Product.find({ category: 'drink' });
        const otherProducts = await Product.find({ category: 'others' });

        res.render('order/new', { foodProducts, drinkProducts, otherProducts });
    } catch (error) {
        req.flash('error', '商品の取得中にエラーが発生しました。');
        res.redirect('/order');
    }
};

// 新規注文を保存する（POST）
exports.createPost = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save(); // ここでawaitを追加

        req.flash('success', '新しい注文が作成されました！');
        wss.broadcast('reload');
        res.redirect('/order');
    } catch (error) {
        req.flash('error', '注文の作成中にエラーが発生しました。');
        res.redirect('/order/create'); // 新規注文ページにリダイレクト
    }
};

// 注文の編集ページを表示する（GET）
exports.edit = async (req, res) => {
    try {
        const foodProducts = await Product.find({ category: 'food' });
        const drinkProducts = await Product.find({ category: 'drink' });
        const otherProducts = await Product.find({ category: 'others' });

        const { id } = req.params;
        const order = await Order.findById(id);

        if (!order) {
            req.flash('error', '指定された注文が見つかりません。');
            return res.redirect('/order');
        }

        res.render('order/edit', { order, foodProducts, drinkProducts, otherProducts });
    } catch (error) {
        req.flash('error', '注文の取得中にエラーが発生しました。');
        res.redirect('/order');
    }
};

// 注文を更新する（PUT）
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOrder = await Order.findByIdAndUpdate(id, req.body);

        if (!updatedOrder) {
            req.flash('error', '指定された注文が見つかりません。');
            return res.redirect('/order');
        }

        req.flash('success', '注文が更新されました！');
        wss.broadcast('reload');
        res.redirect('/order');
    } catch (error) {
        req.flash('error', '注文の更新中にエラーが発生しました。');
        res.redirect(`/order/${id}`); // 編集ページに戻る
    }
};

// 注文を削除する
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await Order.findByIdAndDelete(id);

        req.flash('success', '注文が削除されました！');
        wss.broadcast('reload');
        res.redirect('/order');
    } catch (error) {
        req.flash('error', '注文の削除中にエラーが発生しました。');
        res.redirect(`/order/${id}`); // 編集ページに戻る
    }
};

// お届け済みかを変更
exports.toggleIsServed = async (req, res) => {
    try {
        const { id } = req.params;

        // 注文の `isServed` 状態をトグル
        const order = await Order.findById(id);
        if (!order) {
            req.flash('error', '注文が見つかりませんでした。');
            return res.redirect('/order');
        }

        order.isServed = !order.isServed; // 状態を反転
        await order.save(); // モデルを保存

        req.flash('success', `注文が${order.isServed ? 'お届け済み' : '未完了'}に変更されました！`);
        wss.broadcast('reload');
        res.redirect('/order');
    } catch (error) {
        console.error('Error toggling order status:', error);
        req.flash('error', 'エラーが発生しました。');
        res.redirect(`/order`);
    }
};



