const orderModal = document.getElementById("orderModal");
const noResultModal = document.getElementById("noResultModal");
const cancelOrderBtn = document.getElementById("cancelOrderBtn"); // orderModalのキャンセルボタン
const cancelNoResultBtn = document.getElementById("cancelNoResultBtn"); // noResultModalのキャンセルボタン
const confirmBtn = document.getElementById("confirmBtn");
const modalTableName = document.getElementById('tableName');
const orderList = document.getElementById('orderList');
const showPrice = document.getElementById('totalPrice');

let allOrders;
let totalPrice;
let products = [];
let tableNameText;
let tableOrders;

// サーバーからデータを取得する関数
async function fetchOrders() {
    try {
        const response = await fetch('/server/order');
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        allOrders = await response.json();
        return allOrders;
    } catch (error) {
        console.error('Error fetching orders:', error);
        req.flash('error', '注文データの取得に失敗しました。');
    }
}

// ページ読み込み時にデータを取得
document.addEventListener('DOMContentLoaded', fetchOrders);

// テーブル選択とモーダル表示のロジック
function selectTable(selectedCard) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.classList.remove('selected'));
    selectedCard.classList.add('selected');

    tableNameText = selectedCard.querySelector("h5").textContent;
    modalTableName.textContent = tableNameText;

    tableOrders = allOrders.filter(order =>
        order.orderedBy === tableNameText && order.isServed && !order.isPaid
    );

    orderList.innerHTML = '';
    products = [];
    totalPrice = 0;

    tableOrders.forEach(tableOrder => {
        tableOrder.products.forEach(product => {
            // 既存のリスト項目を探して、数量を更新
            const existingLi = Array.from(orderList.children).find(li =>
                li.textContent.startsWith(`${product.product.name} `)
            );

            if (existingLi) {
                const currentQuantity = parseInt(existingLi.textContent.split('× ')[1]);
                existingLi.textContent = `${product.product.name} × ${currentQuantity + product.quantity}`;
            } else {
                const li = document.createElement('li');
                li.textContent = `${product.product.name} × ${product.quantity}`;
                orderList.appendChild(li);
            }

            // `products` 配列に商品情報を追加または更新
            const existingProduct = products.find(p => p.product === product.product._id);
            if (existingProduct) {
                existingProduct.quantity += product.quantity;
            } else {
                products.push({ product: product.product._id, quantity: product.quantity });
            }
        });

        // 合計金額を加算
        totalPrice += tableOrder.totalPrice;
    });

    // 合計金額を表示
    showPrice.textContent = totalPrice;

    if (totalPrice === 0) {
        noResultModal.style.display = 'block';
    } else {
        orderModal.style.display = 'block';
    }
}

// orderModalのキャンセルボタンでモーダルを閉じる
cancelOrderBtn.addEventListener("click", () => {
    orderModal.style.display = "none";
});

// noResultModalのキャンセルボタンでモーダルを閉じる
cancelNoResultBtn.addEventListener("click", () => {
    noResultModal.style.display = 'none';
});

// 確定ボタンの機能
confirmBtn.addEventListener("click", async () => {
    try {
        const response = await fetch("/checkout/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                products,
                checkoutedBy: tableNameText,
                totalPrice,
                orders: tableOrders,
            }),
        });

        if (response.redirected) {
            // リダイレクト先に遷移する
            window.location.href = response.url;
            return;
        }

    } catch (err) {
        console.error("Error posting order:", err);
    }
});

// モーダル外をクリックした場合に閉じる処理
window.onclick = (event) => {
    if (event.target === orderModal) {
        orderModal.style.display = "none";
    } else if (event.target === noResultModal) {
        noResultModal.style.display = 'none';
    }
};
