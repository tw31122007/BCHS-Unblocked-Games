// Get all tabs
const tabs = document.querySelectorAll('.tab');

// Get the content div and URL bar input
const contentDiv = document.querySelector('.tab-content');
const urlBar = document.querySelector('.url-bar');

// Add click event listeners to tabs
tabs.forEach(tab => {
    tab.addEventListener('click', function() {
        // Remove 'active' class from all tabs
        tabs.forEach(innerTab => innerTab.classList.remove('active'));

        // Add 'active' class to clicked tab
        this.classList.add('active');

        // Change content based on clicked tab
        contentDiv.innerHTML = `<p>${this.getAttribute('data-content')}</p>`;

        // Update URL bar based on clicked tab
        const tabId = this.id;
        urlBar.value = `https://example.com/${tabId}`;
    });
});