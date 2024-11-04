const showModalBtn =document.getElementById('sendExcel');
const sendExcelModal = document.getElementById('sendExcelModal');
const cancelBtn = document.getElementById("cancelBtn");

showModalBtn.onclick = ()=>{
    sendExcelModal.style.display = 'block';
}

cancelBtn.onclick = ()=>{
    sendExcelModal.style.display = 'none';
}

// モーダル外をクリックした場合の処理
window.onclick = (event) => {
    if (event.target === sendExcelModal) {
        sendExcelModal.style.display = "none";
    }
};