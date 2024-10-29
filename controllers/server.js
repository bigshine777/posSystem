const Order = require("../models/order");

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('products.product');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};
