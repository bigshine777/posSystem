require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const engineMate = require('ejs-mate');
const expressError = require('./utils/expressError');
const methodOverride = require('method-override');

const orderRoutes = require('./routes/order.js');
const productRoutes = require('./routes/product.js');

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

app.engine('ejs', engineMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dbURI = process.env.DB_URI;

mongoose.connect(dbURI)
    .then(() => {
        console.log('コネクションOK');
    })
    .catch((err) => {
        console.log('コネクションERROR', err);
    });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// セッション設定
const session = require('express-session');
app.use(session({
    secret: process.env.SESSION_SECRET, // 任意の秘密キー
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 } // クッキーの有効期限(1分)
}));

// flashの設定
const flash = require('connect-flash');
app.use(flash());

// グローバルな変数の設定
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUrl = req.path;
    next();
});

app.use('/order', orderRoutes);
app.use('/product', productRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

// 404 エラーハンドリング
app.all('*', (req, res, next) => {
    next(new expressError('ページが見つかりませんでした。', 400));
});

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
    const { message = '問題が発生しました', statusCode = 500 } = err;
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('ポート3000で待機中...');
});
