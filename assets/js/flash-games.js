function setIframeType(type) {
    localStorage.setItem('iframe-type', type);
}

// Get modal and buttons
const modal = document.getElementById('flashPlayerModal');
const okButton = document.getElementById('okButton');
const downloadButton = document.getElementById('downloadButton');

// Show modal on page load
window.onload = function() {
    modal.style.display = 'block';
}

// Hide modal when "Ok" is clicked
okButton.onclick = function() {
    modal.style.display = 'none';
}

// Open Flash Player download page in a new tab when "Download Flash Player" is clicked
downloadButton.onclick = function() {
    window.open("flash-player.html", "_blank"); 
}