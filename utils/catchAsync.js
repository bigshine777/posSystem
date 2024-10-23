module.exports = (func) => {
    return async (req, res, next) => {
        try {
            // 非同期関数を実行
            await func(req, res, next);
        } catch (err) {
            // エラーが発生した場合のみ next(err) を呼ぶ
            if (!res.headersSent) {
                next(err);
            }
        }
    };
};
