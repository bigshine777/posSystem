const CHECK_INTERVAL = 3000; // 30秒

function checkConnection() {
    fetch('/server', { method: 'HEAD' })
        .then((response) => {
            if (!response.ok) {
                console.warn("Connection lost. Reloading page...");
                window.location.reload();
            }
        })
        .catch((error) => {
            console.warn("Connection lost. Reloading page...");
            window.location.reload();
        });
}

// 定期的に接続状態を確認
setInterval(checkConnection, CHECK_INTERVAL);

// ユーザーが画面を表示したときに接続をチェック
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        checkConnection();
    }
});
