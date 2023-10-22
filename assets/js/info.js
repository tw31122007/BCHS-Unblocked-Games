const tabs = document.querySelectorAll('.tab');

const contentDiv = document.querySelector('.tab-content');
const urlBar = document.querySelector('.url-bar');
function updateURLBar(tabId) {
    urlBar.value = `https://${window.location.hostname}/${tabId}`;
}
updateURLBar('tab1');

tabs.forEach(tab => {
    tab.addEventListener('click', function() {
        // ... existing tab click logic ...

        // Update URL bar with the domain and clicked tab info
        const tabId = this.id;
        updateURLBar(tabId);
    });
});

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

