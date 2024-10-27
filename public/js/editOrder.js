// DOM要素の取得
const orderModal = document.getElementById("orderModal");
const confirmOrderBtn = document.getElementById("confirmOrderBtn");
const cancelBtn = document.getElementById("cancelBtn");
const confirmBtn = document.getElementById("confirmBtn");
const modalTableNames = document.querySelectorAll('#tableName');

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
    // 既存の製品を検索
    const existingProduct = orderProducts.find(product => product._id === productId);

    if (quantity > 0) {
        if (existingProduct) {
            // 既にリストにある場合は数量を更新
            existingProduct.quantity = quantity;
        } else {
            // 新規製品を追加
            orderProducts.push({ _id: productId, name: productName, quantity: quantity, price: productPrice });
        }
    } else if (quantity === 0) {
        if (existingProduct) {
            orderProducts = orderProducts.filter(product => product !== existingProduct);
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
        totalPrice += parseInt(orderProduct.price) * parseInt(orderProduct.quantity);
    }
    modalTotalPrice.textContent = "¥" + totalPrice;
};

document.addEventListener('DOMContentLoaded', () => {
    // 選択しているtableの名前を取得
    tableName = document.querySelector('.table-card.selected h5').textContent.replace('✓', '');

    modalTableNames.forEach(modalTableName => {
        modalTableName.textContent = tableName;
    });

    // すべての数量コントローラを取得
    const quantityControllers = document.querySelectorAll('.quantity-controller');

    quantityControllers.forEach(controller => {
        const minusBtn = controller.querySelector('.minus-btn');
        const plusBtn = controller.querySelector('.plus-btn');
        const quantityDisplay = controller.querySelector('.quantity');

        const productName = controller.dataset.productName;
        const productId = controller.dataset.productId;
        const productPrice = controller.dataset.productPrice;

        let quantity = parseInt(quantityDisplay.textContent); // 初期数量
        allQuantity += quantity;

        updateOrderList(quantity, productId, productName, productPrice);

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

    if (allQuantity > 0) {
        confirmOrderBtn.disabled = false;
    }
});

function selectTable(selectedCard) {
    // 他のカードの選択を解除
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => card.classList.remove('selected'));

    // クリックされたカードに 'selected' クラスを追加
    selectedCard.classList.add('selected');

    // 選択しているtableの名前を取得
    tableName = document.querySelector('.table-card.selected h5').textContent.replace('✓', '');
    
    modalTableNames.forEach(modalTableName => {
        modalTableName.textContent = tableName;
    });
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
        const id = document.getElementById('id').dataset.orderId;
        const response = await fetch(`/order/${id}`, {
            method: "PUT",
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

// DOM要素の取得
const deleteModal = document.getElementById("deleteModal");
const deleteOrderBtn = document.getElementById("deleteOrderBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

// モーダルを表示する関数
deleteOrderBtn.onclick = () => {
    deleteModal.style.display = "block";
};

// モーダルを閉じる関数
cancelDeleteBtn.onclick = () => {
    deleteModal.style.display = "none";
};

// orderをdeleteする関数
confirmDeleteBtn.onclick = async () => {
    try {
        const id = document.getElementById('id').dataset.orderId;
        const response = await fetch(`/order/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
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
    if (event.target === deleteModal) {
        deleteModal.style.display = "none";
    }
};