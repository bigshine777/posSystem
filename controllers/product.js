const Product = require("../models/product");
const multer = require('multer');

// multer の設定：メモリストレージを使用して画像をバッファに保存
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 注文のホームページを表示する（GET）
exports.index = async (req, res) => {
    try {
        const setProducts = await Product.find({ category: 'set' });
        const foodProducts = await Product.find({ category: 'food' });
        const drinkProducts = await Product.find({ category: 'drink' });
        const otherProducts = await Product.find({ category: 'others' });

        res.render('product/index', { setProducts, foodProducts, drinkProducts, otherProducts });
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
exports.createPost = [
    upload.single('image'),  // 'image' はフォームのファイルフィールド名
    async (req, res) => {
        try {
            const { name, price, category, description } = req.body;

            // 画像データをバッファとして受け取り、Product スキーマに保存
            const newProduct = new Product({
                name,
                price,
                category,
                description,
                image: req.file ? req.file.buffer : null  // 画像がある場合のみ保存
            });

            await newProduct.save();

            req.flash('success', 'メニューが追加されました');
            res.redirect('/product');
        } catch (err) {
            req.flash('error', 'メニュー追加に失敗しました');
            res.redirect('/product/new');
        }
    }
];

// メニュー編集ページを表示する（GET）
exports.edit = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        let imageData = null;

        if (product.image) {
            imageData = `data:image/jpeg;base64,${product.image.toString('base64')}`;
        }

        if (!product) {
            req.flash('error', '該当するメニューが見つかりません');
            return res.redirect('/product');
        }

        res.render('product/edit', { product, imageData });
    } catch (err) {
        req.flash('error', 'メニューの取得に失敗しました');
        res.redirect('/product');
    }
};

// メニューを更新する（POST）
exports.update = [
    upload.single('image'),  // 'image' はフォームのファイルフィールド名
    async (req, res) => {
        try {
            const { id } = req.params;
            const { name, price, category, description } = req.body;

            // 画像がアップロードされている場合、新しい画像データを保存
            const updatedProduct = {
                name,
                price,
                category,
                description,
                // 画像がアップロードされた場合は新しい画像に更新
                image: req.file ? req.file.buffer : undefined
            };

            // 画像が更新されていない場合、image プロパティを上書きしない
            // つまり、画像がアップロードされていない場合は、既存の画像を保持
            await Product.findByIdAndUpdate(id, updatedProduct);

            req.flash('success', 'メニューが更新されました');
            res.redirect('/product');
        } catch (err) {
            req.flash('error', 'メニューの更新に失敗しました');
            res.redirect(`/product/${id}`);
        }
    }
];

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

// 画像を削除する（POST）
exports.deleteImage = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        product.image = null;
        await product.save();

        req.flash('success', '画像の削除が完了しました');
    } catch (err) {
        req.flash('error', '画像の削除に失敗しました');
    }
    res.redirect(`/product/${id}`);
};