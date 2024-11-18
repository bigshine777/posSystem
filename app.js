require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const engineMate = require('ejs-mate');
const expressError = require('./utils/expressError');
const methodOverride = require('method-override');

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

app.engine('ejs', engineMate);
app.use(express.json({ limit: '10mb' }));  // 例えば 10MB に設定
app.use(express.urlencoded({ limit: '10mb', extended: true }));
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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 } // クッキーの有効期限(1分)
}));

const WebSocket = require('ws');
const http = require('http');
const server = http.createServer(app); // HTTPサーバーを作成
const wss = new WebSocket.Server({ server }); // WebSocketサーバーをHTTPサーバーにバインド

// WebSocket接続が確立された時のイベント
wss.on('connection', (ws) => {
    console.log('WebSocketクライアントが接続しました');

    // メッセージ受信の確認（オプション）
    ws.on('message', (message) => {
        console.log('Received message:', message);
    });

    // 接続中のクライアントの数を確認
    console.log('現在の接続数:', wss.clients.size);
});

// WebSocketでクライアントに通知する関数
function notifyClients(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// Change Streamの監視
const db = mongoose.connection;
const Order = require('./models/order.js');
const Product = require('./models/product.js'); // Productモデル
const Checkout = require('./models/checkout.js'); // Checkoutモデル

// Change Streamの監視
db.once('open', () => {
    // OrderモデルのChange Stream
    const orderChangeStream = Order.watch();
    orderChangeStream.on('change', (change) => {
        console.log('Orderデータが変更されました:');
        notifyClients({ action: 'reload', source: 'order' }); // どのモデルかを指定
    });
});

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

const orderRoutes = require('./routes/order.js');
const productRoutes = require('./routes/product.js');
const chcekoutRoutes = require('./routes/checkout.js');
const serverRoutes = require('./routes/server.js');
const maidRoutes = require('./routes/maid.js');

app.use('/order', orderRoutes);
app.use('/product', productRoutes);
app.use('/checkout', chcekoutRoutes);
app.use('/server', serverRoutes);
app.use('/maid', maidRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/test', (req, res) => {
    res.send('ok');
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
