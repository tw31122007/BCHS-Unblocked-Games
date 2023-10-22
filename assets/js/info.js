const tabs = document.querySelectorAll('.tab');

const contentDiv = document.querySelector('.tab-content');
const urlBar = document.querySelector('.url-bar');
// Function to set the default URL when the page loads
function setDefaultURL() {
    urlBar.value = `https://${window.location.hostname}/tab1`;
}

// Function to update the URL bar based on the clicked tab
function updateURLBar(tabId) {
    urlBar.value = `https://${window.location.hostname}/${tabId}`;
}

// Call setDefaultURL to set the default URL when the page loads
setDefaultURL();

tabs.forEach(tab => {
    tab.addEventListener('click', function() {

        // Update URL bar with the domain and clicked tab info
        const tabId = this.id;
        updateURLBar(tabId);
    });
});

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
        let contentId = 'content-' + this.id;
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';  // Hide all tab contents
        });
        document.getElementById(contentId).style.display = 'block';  // Show the clicked tab's content
    });
});
