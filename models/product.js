const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true, // 必須フィールドに設定
        trim: true // 前後の空白を自動で削除
    },
    price: {
        type: Number,
        required: true, // 必須フィールドに設定
        min: [0, '価格は0以上である必要があります'] // 最小値を0に制限
    },
    category: String,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
