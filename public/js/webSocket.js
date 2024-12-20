// WebSocketクライアントの設定
let ws;
if (window.location.host == 'localhost:3000') {
    ws = new WebSocket(`ws://${window.location.host}`); // 適切なURLを使用
} else {
    ws = new WebSocket(`wss://${window.location.host}`); // 適切なURLを使用
}

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
