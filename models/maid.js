const mongoose = require('mongoose');

const MaidSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    classNumber: {
        type: Number,
        required: true,
    },
    attribute: {
        type: String,
    },
    from: {
        type: String
    },
    skill: {
        type: String,
    },
    hobby: {
        type: String,
        required: true,
    },
    bloodType: {
        type: String,
    },
    favorite: {
        type: String
    },
    favoriteFood: {
        type: String
    },
    image: {
        type: Buffer, // 画像はバイナリデータとして保存
    },
});

const Maid = mongoose.model('Maid', MaidSchema);

module.exports = Maid;
