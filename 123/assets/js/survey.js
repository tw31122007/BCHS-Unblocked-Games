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
function reload() {
  localStorage.setItem('current-url', iframe.src);
  iframe.src = localStorage.getItem('current-url');
}
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
  } else if (type === 'index') {
    window.location.href = '/index.html';
  } else if (type === 'settings') {
    window.location.href = '/settings.html';
  } else if (type === 'flash-player') {
    window.location.href = '/flash-player.html';
  } else if (type === 'flash-games') {
    window.location.href = '/flash-games.html';
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
  