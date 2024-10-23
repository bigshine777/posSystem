const Product = require("../models/product");

// 注文のホームページを表示する（GET）
exports.index = async (req, res) => {
    try {
        const foodProducts = await Product.find({ category: 'food' });
        const drinkProducts = await Product.find({ category: 'drink' });
        const otherProducts = await Product.find({ category: 'others' });

        res.render('product/index', { foodProducts, drinkProducts, otherProducts });
    } catch (err) {
        req.flash('error', '商品一覧の取得に失敗しました');
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
        const { name, price, category } = req.body;
        const newProduct = new Product({ name, price, category });
        await newProduct.save();

        req.flash('success', '新規商品が追加されました');
        res.redirect('/product');
    } catch (err) {
        req.flash('error', '商品追加に失敗しました');
        res.redirect('/product/new');
    }
};

// 商品編集ページを表示する（GET）
exports.edit = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            req.flash('error', '該当する商品が見つかりません');
            return res.redirect('/product');
        }

        res.render('product/edit', { product });
    } catch (err) {
        req.flash('error', '商品の取得に失敗しました');
        res.redirect('/product');
    }
};

// 商品を更新する（POST）
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category } = req.body;
        await Product.findByIdAndUpdate(id, { name, price, category });

        req.flash('success', '商品が更新されました');
        res.redirect('/product');
    } catch (err) {
        req.flash('error', '商品の更新に失敗しました');
        res.redirect(`/product/${id}`);
    }
};

// 商品を削除する（POST）
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        req.flash('success', '商品の削除が完了しました');
    } catch (err) {
        req.flash('error', '商品の削除に失敗しました');
    }
    res.redirect('/product');
};
