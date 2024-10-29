const mongoose = require('mongoose');

const CheckoutSchema = mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        }, quantity: {
            type: Number,
            required: true,
            min: 1 // 数量は1以上に制限
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    checkoutedBy: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    }]
});

const Checkout = mongoose.model('Checkout', CheckoutSchema);

module.exports = Checkout;