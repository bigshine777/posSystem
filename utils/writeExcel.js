const ExcelJS = require('exceljs');
const fs = require('fs');
const nodemailer = require('nodemailer');

// 会計情報をエクスポートする関数
async function exportCheckoutToExcel(checkouts, date) {
    const workbook = new ExcelJS.Workbook();

    const dateTime = date === 'all' ? 'all' : new Date(date).toISOString().slice(0, 10);

    // 新しいシートを作成してヘッダーを追加
    const sheet = workbook.addWorksheet('Checkouts');
    sheet.columns = [
        { header: 'チェックアウトID', key: 'checkoutId', width: 20 },
        { header: '商品', key: 'product', width: 30 },
        { header: '合計金額', key: 'totalPrice', width: 15 },
        { header: 'チェックアウト卓', key: 'checkoutTable', width: 20 },
        { header: '作成日時', key: 'createdAt', width: 25 },
    ];

    for (let checkout of checkouts) {
        const productsWithQuantities = checkout.products
            .map(p => `${p.product.name}×${p.quantity}`)
            .join('\n');

        const createdAtFormatted = new Date(checkout.createdAt).toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

        const newRow = sheet.addRow([
            String(checkout._id),
            productsWithQuantities,
            checkout.totalPrice,
            checkout.checkoutedBy,
            createdAtFormatted
        ]);

        newRow.getCell(1).alignment = { vertical: 'middle' };
        newRow.getCell(2).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        newRow.getCell(3).alignment = { vertical: 'middle' };
        newRow.getCell(4).alignment = { vertical: 'middle' };
        newRow.getCell(5).alignment = { vertical: 'middle' };
    }

    await workbook.xlsx.writeFile(`${dateTime}Accounting.xlsx`);
    console.log('CheckoutsデータがExcelファイルにエクスポートされました');
    return dateTime;
}

// Excelファイルをメールで送信する関数
async function sendEmailWithAttachment(datetime, email) {
    const filePath = `${datetime}Accounting.xlsx`;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'daichi.bigshine777@gmail.com',
            pass: process.env.GOOGLE_PASSWORD,
        },
    });

    const mailOptions = {
        from: 'daichi.bigshine777@gmail.com',
        to: email,
        subject: `${datetime === 'all' ? 'すべて' : datetime}の会計情報`,
        text: `添付ファイルに${datetime === 'all' ? 'すべて' : datetime}の会計情報があります。`,
        attachments: [
            {
                filename: filePath,
                path: filePath,
            },
        ],
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('メールが送信されました');

        // ファイルを削除
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('ファイルの削除中にエラーが発生しました:', err);
            } else {
                console.log('ファイルが削除されました:', filePath);
            }
        });
    } catch (error) {
        console.error('メールの送信中にエラーが発生しました:', error);
    }
}

// モジュールとしてエクスポート
module.exports = { exportCheckoutToExcel, sendEmailWithAttachment };
