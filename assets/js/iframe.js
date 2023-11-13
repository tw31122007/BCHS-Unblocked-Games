function goBack() {
    history.back();
  }
function toggleFullscreen() {
  const iframe = document.getElementById('iframe');
  if (iframe.requestFullscreen) {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
       iframe.requestFullscreen();
    }
  } else if (iframe.mozRequestFullScreen) { // Firefox
    if (document.mozFullScreenElement) {
      document.mozCancelFullScreen();
    } else {
      iframe.mozRequestFullScreen();
    }
  } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari and Opera
    if (document.webkitFullscreenElement) {
      document.webkitExitFullscreen();
    } else {
      iframe.webkitRequestFullscreen();
    }
  } else if (iframe.msRequestFullscreen) { // IE/Edge
    if (document.msFullscreenElement) {
      document.msExitFullscreen();
    } else {
      iframe.msRequestFullscreen();
    }
  }
}
// Retrieve the app name and image from local storage
const appName = localStorage.getItem('app-name');
const appImage = localStorage.getItem('app-image');
const showNameAndImg = localStorage.getItem('shownameandimg');

// Set the content and src attribute
document.getElementById('app-name').textContent = appName;
document.getElementById('app-image').src = appImage;

function backtopage() {
  const type = localStorage.getItem('iframe-type');
  console.log("iframe-type value:", type);
  if (type === 'apps') {
      window.location.href = '/apps.html';
  } else if (type === 'games') {
      window.location.href = '/games.html';
  } else if (type === 'credits') {
    window.location.href = '/credits.html';
  } else if (type === 'links') {
    window.location.href = '/links.html';
  } else if (type === 'info') {
    window.location.href = '/index.html';
  } else if (type === 'home') {
    window.location.href = '/home.html';
  } else if (type === 'settings') {
    window.location.href = '/settings.html';
  } else if (type === 'websites') {
    window.location.href = '/websites.html';
  } else if (type === 'vpns') {
    window.location.href = '/vpns.html';
  } else if (type === 'games-no-nav') {
    window.location.href = '/games-no-nav.html';
  } else {
      // Default or error handling, if needed.
      console.error('Unexpected iframe type:', type);
  }
}

var iframeUrl = localStorage.getItem('storedURL');
var iframeElement = document.getElementById('iframe');
if (iframeUrl) {
    iframeElement.src = iframeUrl;
} else {
    console.error("No URL found in localStorage for the iframe");
}

function reload() {
  localStorage.setItem('current-url', iframe.src);
  iframe.src = localStorage.getItem('current-url');
}

if (showNameAndImg === 'true') {
  // Set the content and src attribute
  document.getElementById('app-name').textContent = appName;
  document.getElementById('app-image').src = appImage;
  document.getElementById('app-name').style.display = 'inline';
  document.getElementById('app-image').style.display = 'inline';
} else {
  document.getElementById('app-name').style.display = 'none';
  document.getElementById('app-image').style.display = 'none';
}