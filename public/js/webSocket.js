const socket = new WebSocket('ws://localhost:3000'); // WebSocket サーバーの URL に置き換えてください

// サーバーから「reload」メッセージを受け取ったらページをリロード
socket.addEventListener('message', function (event) {
    if (event.data === 'reload') {
        location.reload();
    }
});