const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    orderedBy: { 
        type: String 
    },
    isServed: { 
        type: Boolean 
    }
});

// 'model' は小文字にする必要があります
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;