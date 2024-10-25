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
  