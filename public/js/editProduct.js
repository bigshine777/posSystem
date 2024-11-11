document.getElementById('deleteImage').addEventListener('click', async () => {
    try {
        const id = document.getElementById('id').dataset.productId;
        const response = await fetch(`/product/${id}/delete-image`, {
            method: "DELETE",
        });

        window.location.reload();

    } catch (err) {
        console.error("Error deleting Image:", err);
    }
});