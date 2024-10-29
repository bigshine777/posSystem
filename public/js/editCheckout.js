// DOM要素の取得
const checkoutModal = document.getElementById("checkoutModal");
const confirmcheckoutBtn = document.getElementById("confirmcheckoutBtn");
const cancelBtn = document.getElementById("cancelBtn");
const confirmBtn = document.getElementById("confirmBtn");

let totalPrice = 0;

// モーダル内のリスト要素を取得
const checkoutList = document.getElementById('checkoutList');

let allQuantity = 0;
let checkoutProducts = [];

// 数量の変更後にボタンの有効/無効を切り替える関数
const updateConfirmButtonState = () => {
    confirmcheckoutBtn.disabled = allQuantity === 0;
};

// 数量が1以上でオーダーに追加
const updatecheckoutList = (quantity, productId, productName, productPrice) => {
    // 既存の製品を検索
    const existingProduct = checkoutProducts.find(product => product._id === productId);

    if (quantity > 0) {
        if (existingProduct) {
            // 既にリストにある場合は数量を更新
            existingProduct.quantity = quantity;
        } else {
            // 新規製品を追加
            checkoutProducts.push({ _id: productId, name: productName, quantity: quantity, price: productPrice });
        }
    } else if (quantity === 0) {
        if (existingProduct) {
            checkoutProducts = checkoutProducts.filter(product => product !== existingProduct);
        }
    }
};

// 注文内容をリストに表示する関数
function displaycheckout(items) {
    // リストを一度クリア
    checkoutList.innerHTML = '';

    // 各商品を<li>として追加
    items.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name}  × ${item.quantity}`;
        checkoutList.appendChild(listItem);
    });

    const modalTotalPrice = document.getElementById('totalPrice');

    totalPrice = 0;

    for (let checkoutProduct of checkoutProducts) {
        totalPrice += parseInt(checkoutProduct.price) * parseInt(checkoutProduct.quantity);
    }
    modalTotalPrice.textContent = "¥" + totalPrice;
};

document.addEventListener('DOMContentLoaded', () => {
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

        updatecheckoutList(quantity, productId, productName, productPrice);

        // マイナスボタンのクリックイベント
        minusBtn.addEventListener('click', () => {
            if (quantity > 0) {
                allQuantity--;
                quantity--;
                quantityDisplay.textContent = quantity;
                updatecheckoutList(quantity, productId, productName, productPrice);
                updateConfirmButtonState(); // ボタンの状態更新
            }
        });

        // プラスボタンのクリックイベント
        plusBtn.addEventListener('click', () => {
            quantity++;
            allQuantity++;
            quantityDisplay.textContent = quantity;
            updatecheckoutList(quantity, productId, productName, productPrice);
            updateConfirmButtonState(); // ボタンの状態更新
        });
    });

    if (allQuantity > 0) {
        confirmcheckoutBtn.disabled = false;
    }
});

function selectTable(selectedCard) {
    // 他のカードの選択を解除
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => card.classList.remove('selected'));

    // クリックされたカードに 'selected' クラスを追加
    selectedCard.classList.add('selected');
};

// モーダルを表示する関数
confirmcheckoutBtn.onclick = () => {
    if (allQuantity > 0) {
        checkoutModal.style.display = "block";
        displaycheckout(checkoutProducts);
    }
};

// モーダルを閉じる関数
cancelBtn.onclick = () => {
    checkoutModal.style.display = "none";
};

// checkoutをpostする関数
confirmBtn.onclick = async () => {
    try {
        const id = document.getElementById('id').dataset.checkoutId;
        const response = await fetch(`/checkout/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                products: checkoutProducts.map((checkout) => ({
                    product: checkout._id,
                    quantity: checkout.quantity,
                })),
                totalPrice,
            }),
        });

    } catch (err) {
        console.error("Error posting checkout:", err);
    }
};

// モーダル外をクリックした場合の処理
window.onclick = (event) => {
    if (event.target === checkoutModal) {
        checkoutModal.style.display = "none";
    }
};

// DOM要素の取得
const deleteModal = document.getElementById("deleteModal");
const deletecheckoutBtn = document.getElementById("deletecheckoutBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

// モーダルを表示する関数
deletecheckoutBtn.onclick = () => {
    deleteModal.style.display = "block";
};

// モーダルを閉じる関数
cancelDeleteBtn.onclick = () => {
    deleteModal.style.display = "none";
};

// checkoutをdeleteする関数
confirmDeleteBtn.onclick = async () => {
    try {
        const id = document.getElementById('id').dataset.checkoutId;
        const response = await fetch(`/checkout/${id}`, {
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
        console.error("Error posting checkout:", err);
    }
};

// モーダル外をクリックした場合の処理
window.onclick = (event) => {
    if (event.target === deleteModal) {
        deleteModal.style.display = "none";
    }
};