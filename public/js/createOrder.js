// DOM要素の取得
const orderModal = document.getElementById("orderModal");
const confirmOrderBtn = document.getElementById("confirmOrderBtn");
const closeBtn = document.querySelector(".close-btn");
const cancelBtn = document.getElementById("cancelBtn");

document.addEventListener('DOMContentLoaded', () => {
    // すべての数量コントローラを取得
    const quantityControllers = document.querySelectorAll('.quantity-controller');

    quantityControllers.forEach(controller => {
        const minusBtn = controller.querySelector('.minus-btn');
        const plusBtn = controller.querySelector('.plus-btn');
        const quantityDisplay = controller.querySelector('.quantity');

        let quantity = 0; // 初期数量

        // マイナスボタンのクリックイベント
        minusBtn.addEventListener('click', () => {
            if (quantity > 0) {
                quantity--;
                quantityDisplay.textContent = quantity;
            }
        });

        // プラスボタンのクリックイベント
        plusBtn.addEventListener('click', () => {
            quantity++;
            quantityDisplay.textContent = quantity;
        });
    });
});

// モーダルを表示する関数
confirmOrderBtn.onclick = () => {
    orderModal.style.display = "block";
};

// モーダルを閉じる関数
closeBtn.onclick = cancelBtn.onclick = () => {
    orderModal.style.display = "none";
};

// モーダル外をクリックした場合の処理
window.onclick = (event) => {
    if (event.target === orderModal) {
        orderModal.style.display = "none";
    }
};


