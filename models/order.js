const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required : true,
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
    orderedBy: {
        type: String,
        required : true,
    },
    isServed: {
        type: Boolean,
        default : false,
    },
    totalPrice : {
        type : Number,
        required : true,
    }
});

// 'model' は小文字にする必要があります
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;