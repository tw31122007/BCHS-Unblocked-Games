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