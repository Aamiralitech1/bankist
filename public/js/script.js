document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const formData = new FormData(form);

        // Show loading animation
        const loading = document.createElement('div');
        loading.className = 'loader';
        document.body.appendChild(loading);

        // Simulate a delay (e.g., 2 seconds)
        setTimeout(() => {
            fetch("/check-dns?" + new URLSearchParams(formData).toString())
                .then(response => response.text())
                // Previous code for context...
                .then(data => {
                    // Remove loading animation
                    document.body.removeChild(loading);

                    // Show results in a modal
                    const modal = document.createElement('div');
                    modal.className = 'modal';
                    const modalContent = document.createElement('div');
                    modalContent.className = 'modal-content';

                    // Create a close button
                    const closeButton = document.createElement('span');
                    closeButton.className = 'close-button';
                    closeButton.innerHTML = '&times;';
                    closeButton.onclick = function () {
                        document.body.removeChild(modal);
                    };
                    modalContent.appendChild(closeButton); // Append close button first

                    // Create a <pre> element for formatted text
                    const preElement = document.createElement('pre');
                    preElement.innerHTML = data;
                    modalContent.appendChild(preElement); // Append data after close button

                    modal.appendChild(modalContent);
                    document.body.appendChild(modal);
                });

        }, 1000); // Adjust delay here
    });
});

