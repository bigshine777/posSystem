const showModalBtn =document.getElementById('showModal');
const checkoutModal = document.getElementById('checkoutModal');
const cancelBtn = document.getElementById("cancelBtn");
const confirmBtn = document.getElementById("confirmBtn");

showModalBtn.onclick = ()=>{
    checkoutModal.style.display = 'block';
}

cancelBtn.onclick = ()=>{
    checkoutModal.style.display = 'none';
}

confirmBtn.onclick = async ()=>{
    try {
        const id = document.getElementById('id').dataset.checkoutId;
        const response = await fetch(`/checkout/${id}`, {
            method: "PATCH",
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
}

// モーダル外をクリックした場合の処理
window.onclick = (event) => {
    if (event.target === checkoutModal) {
        checkoutModal.style.display = "none";
    }
};
