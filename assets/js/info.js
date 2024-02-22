const tabs = document.querySelectorAll('.tab');
const contentDiv = document.querySelector('.tab-content');
const urlBar = document.querySelector('.url-bar');
const videoElement = contentDiv.querySelector('video');
const videoSourceElement = videoElement.querySelector('source');

// Function to set the default URL and video when the page loads
function setDefaults() {
    urlBar.value = `https://${window.location.hostname}/`;
    videoSourceElement.setAttribute('src', 'assets/img/tutorial/info-tab-1.mp4');
    videoElement.load();
    videoElement.play();
}

// Function to update the URL bar and video based on the clicked tab
function updateTabContent(suffix, videoSrc) {
    urlBar.value = `https://${window.location.hostname}/${suffix}`;
    videoSourceElement.setAttribute('src', videoSrc);
    videoElement.load();
    videoElement.play();
}

// Call setDefaults to set the default URL and video when the page loads
setDefaults();

tabs.forEach(tab => {
    tab.addEventListener('click', function() {
        // Update active class for tabs
        tabs.forEach(innerTab => innerTab.classList.remove('active'));
        this.classList.add('active');

        // Update URL bar and video based on the clicked tab
        const urlSuffix = this.getAttribute('data-url-suffix');
        const videoSrc = this.getAttribute('data-video-src');
        updateTabContent(urlSuffix, videoSrc);
    });
});
