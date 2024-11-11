document.getElementById('deleteImage').addEventListener('click', async () => {
    try {
        const id = document.getElementById('id').dataset.maidId;
        const response = await fetch(`/maid/${id}/delete-image`, {
            method: "DELETE",
        });

        window.location.reload();

    } catch (err) {
        console.error("Error deleting Image:", err);
    }
});