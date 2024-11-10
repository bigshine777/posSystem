const Maid = require("../models/maid");
const multer = require('multer');

// multer の設定：メモリストレージを使用して画像をバッファに保存
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// メイド一覧ページを表示する（GET）
exports.index = async (req, res) => {
    try {
        const maidDatas = await Maid.find({});
        const maids = maidDatas.map(maidData => {
            let imageData = null;

            if (maidData.image) {
                imageData = `data:image/jpeg;base64,${maidData.image.toString('base64')}`;
            }
            maidData.image = imageData; // 画像データを新しい値に更新
            return maidData;
        });

        res.render('maid/index', { maids });
    } catch (err) {
        req.flash('error', 'メニューの取得に失敗しました');
        res.redirect('/');
    }
};

// 新規メイド登録ページを表示する（GET）
exports.create = (req, res) => {
    res.render('maid/new');
};

// 新規メイドを保存する（POST）
exports.createPost = [
    upload.single('image'),  // 'image' はフォームのファイルフィールド名
    async (req, res) => {
        try {
            const { name, classNumber, attribute, from, skill, hobby, bloodType, favorite, favoriteFood } = req.body;

            // 画像データをバッファとして受け取り、Maid スキーマに保存
            const newMaid = new Maid({
                name,
                classNumber,
                attribute,
                from,
                skill,
                hobby,
                bloodType,
                favorite,
                favoriteFood,
                image: req.file ? req.file.buffer : null  // 画像がある場合のみ保存
            });

            await newMaid.save();

            req.flash('success', 'メイドが追加されました');
            res.redirect('/maid');
        } catch (err) {
            req.flash('error', 'メイド追加に失敗しました');
            res.redirect('/maid/new');
        }
    }
];

// メイド編集ページを表示する（GET）
exports.edit = async (req, res) => {
    try {
        const { id } = req.params;
        const maid = await Maid.findById(id);

        let imageData = null;

        if (maid.image) {
            imageData = `data:image/jpeg;base64,${maid.image.toString('base64')}`;
        }

        if (!maid) {
            req.flash('error', '該当するメイドが見つかりません');
            return res.redirect('/maid');
        }

        res.render('maid/edit', { maid, imageData });
    } catch (err) {
        req.flash('error', 'メイドの取得に失敗しました');
        res.redirect('/maid');
    }
};

// メイド情報を更新する（POST）
exports.update = [
    upload.single('image'),  // 'image' はフォームのファイルフィールド名
    async (req, res) => {
        try {
            const { id } = req.params;
            const { name, classNumber, attribute, from, skill, hobby, bloodType, favorite, favoriteFood } = req.body;

            // 画像がアップロードされている場合、新しい画像データを保存
            const updatedMaid = {
                name,
                classNumber,
                attribute,
                from,
                skill,
                hobby,
                bloodType,
                favorite,
                favoriteFood,
                // 画像がアップロードされた場合は新しい画像に更新
                image: req.file ? req.file.buffer : undefined
            };

            // 画像が更新されていない場合、image プロパティを上書きしない
            await Maid.findByIdAndUpdate(id, updatedMaid);

            req.flash('success', 'メイドが更新されました');
            res.redirect('/maid');
        } catch (err) {
            req.flash('error', 'メイドの更新に失敗しました');
            res.redirect(`/maid/${id}`);
        }
    }
];

// メイドを削除する（POST）
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await Maid.findByIdAndDelete(id);
        req.flash('success', 'メイドの削除が完了しました');
    } catch (err) {
        req.flash('error', 'メイドの削除に失敗しました');
    }
    res.redirect('/maid');
};

// 画像を削除する（POST）
exports.deleteImage = async (req, res) => {
    try {
        const { id } = req.params;
        const maid = await Maid.findById(id);

        maid.image = null;
        await maid.save();

        req.flash('success', '画像の削除が完了しました');
    } catch (err) {
        req.flash('error', '画像の削除に失敗しました');
    }
    res.redirect(`/maid/${id}`);
};
