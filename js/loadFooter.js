// Function to load external footer
document.addEventListener("DOMContentLoaded", function() {
    fetchFooter();

    function fetchFooter() {
        fetch('footer.html')
            .then(response => response.text())
            .then(data => {
                const footerElement = document.querySelector('footer');
                if (!footerElement) {
                    throw new Error('Footer element not found in the DOM.');
                }
                footerElement.innerHTML = data;
            })
            .catch(error => console.error('Error loading header:', error));
    }
});