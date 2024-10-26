// DOM要素の取得
const orderModal = document.getElementById("orderModal");
const confirmOrderBtn = document.getElementById("confirmOrderBtn");
const cancelBtn = document.getElementById("cancelBtn");
const confirmBtn = document.getElementById("confirmBtn");
const modalTableName = document.getElementById('tableName');

let tableName;
let totalPrice = 0;

// モーダル内のリスト要素を取得
const orderList = document.getElementById('orderList');

let allQuantity = 0;
let orderProducts = [];

// 数量の変更後にボタンの有効/無効を切り替える関数
const updateConfirmButtonState = () => {
    confirmOrderBtn.disabled = allQuantity === 0;
};

// 数量が1以上でオーダーに追加
const updateOrderList = (quantity, productId, productName, productPrice) => {
    if (quantity > 0) {
        // 既存の製品を検索
        const existingProduct = orderProducts.find(product => product._id === productId);

        if (existingProduct) {
            // 既にリストにある場合は数量を更新
            existingProduct.quantity = quantity;
        } else {
            // 新規製品を追加
            orderProducts.push({ _id: productId, name: productName, quantity: quantity, price: productPrice });
        }
    }
};

// 注文内容をリストに表示する関数
function displayOrder(items) {
    // リストを一度クリア
    orderList.innerHTML = '';

    // 各商品を<li>として追加
    items.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name}  × ${item.quantity}`;
        orderList.appendChild(listItem);
    });

    const modalTotalPrice = document.getElementById('totalPrice');

    totalPrice = 0;
    
    for (let orderProduct of orderProducts) {
        totalPrice += parseInt(orderProduct.price)*parseInt(orderProduct.quantity);
    }
    modalTotalPrice.textContent = totalPrice;
};

document.addEventListener('DOMContentLoaded', () => {
    // 選択しているtableの名前を取得
    tableName = document.querySelector('.table-card.selected h5').textContent.replace('✓', '');
    modalTableName.textContent = tableName;

    // すべての数量コントローラを取得
    const quantityControllers = document.querySelectorAll('.quantity-controller');

    // 初期状態で注文ボタンを無効化
    confirmOrderBtn.disabled = true;

    quantityControllers.forEach(controller => {
        const minusBtn = controller.querySelector('.minus-btn');
        const plusBtn = controller.querySelector('.plus-btn');
        const quantityDisplay = controller.querySelector('.quantity');

        const productName = controller.dataset.productName;
        const productId = controller.dataset.productId;
        const productPrice = controller.dataset.productPrice;

        let quantity = 0; // 初期数量

        // マイナスボタンのクリックイベント
        minusBtn.addEventListener('click', () => {
            if (quantity > 0) {
                allQuantity--;
                quantity--;
                quantityDisplay.textContent = quantity;
                updateOrderList(quantity, productId, productName, productPrice);
                updateConfirmButtonState(); // ボタンの状態更新
            }
        });

        // プラスボタンのクリックイベント
        plusBtn.addEventListener('click', () => {
            quantity++;
            allQuantity++;
            quantityDisplay.textContent = quantity;
            updateOrderList(quantity, productId, productName, productPrice);
            updateConfirmButtonState(); // ボタンの状態更新
        });
    });
});

function selectTable(selectedCard) {
    // 他のカードの選択を解除
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => card.classList.remove('selected'));

    // クリックされたカードに 'selected' クラスを追加
    selectedCard.classList.add('selected');

    // 選択しているtableの名前を取得
    tableName = document.querySelector('.table-card.selected h5').textContent.replace('✓', '');
    modalTableName.textContent = tableName;
};

// モーダルを表示する関数
confirmOrderBtn.onclick = () => {
    if (allQuantity > 0) {
        orderModal.style.display = "block";
        displayOrder(orderProducts);
    }
};

// モーダルを閉じる関数
cancelBtn.onclick = () => {
    orderModal.style.display = "none";
};

// orderをpostする関数
confirmBtn.onclick = async () => {
    try {
        const response = await fetch("/order/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                products: orderProducts.map((order) => ({
                    product: order._id,
                    quantity: order.quantity,
                })),
                orderedBy: tableName,
                totalPrice,
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
};

// モーダル外をクリックした場合の処理
window.onclick = (event) => {
    if (event.target === orderModal) {
        orderModal.style.display = "none";
    }
};


