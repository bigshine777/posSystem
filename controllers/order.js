const Order = require("../models/order");
const Product = require('../models/product')

// 注文のホームページを表示する（GET）
exports.index = async (req, res) => {
    const currentOrders = await Order.find({ isServed: false }).populate('products.product');
    const previousOrders = await Order.find({ isServed: true }).populate('products.product');

    console.log(currentOrders)

    res.render('order/index', { currentOrders, previousOrders });
};

// 新規注文ページを表示する（GET）
exports.create = async (req, res) => {
    const foodProducts = await Product.find({ category: 'food' });
    const drinkProducts = await Product.find({ category: 'drink' });
    const otherProducts = await Product.find({ category: 'others' });

    res.render('order/new', { foodProducts, drinkProducts, otherProducts });
};

// 新規注文を保存する（POST）
exports.createPost = (req, res) => {
    console.log(req.body);
    const newOrder = new Order(req.body);
    newOrder.save();

    res.redirect('/order');
};
