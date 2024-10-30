// WebSocketクライアントの設定
const ws = new WebSocket('ws://localhost:3000'); // 適切なURLを使用

// WebSocket接続が開かれたとき
ws.onopen = () => {
    console.log('WebSocket connection established');
};

// メッセージを受信したときの処理
ws.onmessage = function (event) {
    const data = JSON.parse(event.data);

    if (data.action === 'reload') {
        const currentPath = window.location.pathname; // 現在のURLパスを取得

        switch (data.source) {
            case 'order':
                if (currentPath === '/order') {
                    console.log('Orderデータが変更されました。リロードします。');
                    location.reload(); // ページをリロード
                }
                break;
            case 'product':
                if (currentPath === '/product') {
                    console.log('Productデータが変更されました。リロードします。');
                    location.reload(); // ページをリロード
                }
                break;
            case 'checkout':
                if (currentPath === '/checkout' || 'order') {
                    console.log('Checkoutデータが変更されました。リロードします。');
                    location.reload(); // ページをリロード
                }
                break;
            default:
                console.log('不明なソース:', data.source);
        }
    }
};

// エラーが発生したときの処理
ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};

// 接続が閉じられたときの処理
ws.onclose = () => {
    console.log('WebSocket connection closed');
};
