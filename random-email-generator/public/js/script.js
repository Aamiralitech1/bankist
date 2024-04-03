document.getElementById('generate').addEventListener('click', function () {
    fetch('/generate-email')
        .then(response => response.text())
        .then(data => {
            document.getElementById('emailDisplay').textContent = data;
        })
        .catch(error => console.error('Error:', error));
});
