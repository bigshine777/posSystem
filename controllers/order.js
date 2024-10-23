// 注文のホームページを表示する（GET）
exports.index = (req, res) => {
    res.render('order/index');
};

// 新規注文ページを表示する（GET）
exports.create = (req, res) => {
    res.render('order/new');
};

// 新規注文を保存する（POST）
exports.createPost = (req, res) => {
    res.send('POST完了');
};
