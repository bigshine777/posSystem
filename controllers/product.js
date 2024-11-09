const Product = require("../models/product");

// 注文のホームページを表示する（GET）
exports.index = async (req, res) => {
    try {
        const foodProducts = await Product.find({ category: 'food' });
        const drinkProducts = await Product.find({ category: 'drink' });
        const otherProducts = await Product.find({ category: 'others' });

        res.render('product/index', { foodProducts, drinkProducts, otherProducts });
    } catch (err) {
        req.flash('error', 'メニューの取得に失敗しました');
        res.redirect('/');
    }
};

// 新規注文ページを表示する（GET）
exports.create = (req, res) => {
    res.render('product/new');
};

// 新規注文を保存する（POST）
exports.createPost = async (req, res) => {
    try {
        const { name, price, category, description } = req.body;
        const newProduct = new Product({ name, price, category, description });
        await newProduct.save();

        req.flash('success', 'メニューが追加されました');
        res.redirect('/product');
    } catch (err) {
        req.flash('error', 'メニュー追加に失敗しました');
        res.redirect('/product/new');
    }
};

// メニュー編集ページを表示する（GET）
exports.edit = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            req.flash('error', '該当するメニューが見つかりません');
            return res.redirect('/product');
        }

        res.render('product/edit', { product });
    } catch (err) {
        req.flash('error', 'メニューの取得に失敗しました');
        res.redirect('/product');
    }
};

// メニューを更新する（POST）
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category, description } = req.body;
        await Product.findByIdAndUpdate(id, { name, price, category, description });

        req.flash('success', 'メニューが更新されました');
        res.redirect('/product');
    } catch (err) {
        req.flash('error', 'メニューの更新に失敗しました');
        res.redirect(`/product/${id}`);
    }
};

// メニューを削除する（POST）
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        req.flash('success', 'メニューの削除が完了しました');
    } catch (err) {
        req.flash('error', 'メニューの削除に失敗しました');
    }
    res.redirect('/product');
};
