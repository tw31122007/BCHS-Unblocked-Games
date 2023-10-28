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
  } else if (type === 'index') {
    window.location.href = '/index.html';
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

const storedURL = localStorage.getItem('storedURL');
const iframe = document.getElementById('iframe');
iframe.src = storedURL;

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
document.addEventListener("DOMContentLoaded", async function() {
  var alertModal = document.getElementById("alertModal");
  var okButton = document.getElementById("alertOkButton");

  function showAlertModal() {
    alertModal.style.display = "block";
  }
  okButton.onclick = function() {
    alertModal.style.display = "none";
    localStorage.setItem('modalpopup', 'false');
  }

  if(localStorage.getItem('modalpopup') === 'true') {
    let modalType = localStorage.getItem('modal-type');

    try {
      let modalData = await fetchData(modalType);
      console.log("Setting Text:", modalData.text);
      
      // Set title
      if (modalData.title) {
          document.getElementById('alertModalTitle').textContent = modalData.title;
      } else {
          document.getElementById('alertModalTitle').textContent = "";  // clear if no title is present for this modal type
      }
      
      // Set text
      if (modalData.text !== "false") {
          document.getElementById('alertModalText').textContent = modalData.text;
      }
      
      // Show or hide OK button
      if (modalData.showOkButton) {
          document.getElementById('alertOkButton').style.display = 'block';
      } else {
          document.getElementById('alertOkButton').style.display = 'none';
      }
      
      showAlertModal();

    } catch(error) {
      console.error("There was an issue:", error);
    }
  }
});
function fetchData(type) {
  return fetch('/assets/json/modal.json')
  .then(response => {
      if (!response.ok) {
          throw new Error("Network response was not ok");
      }
      return response.json();
  })
  .then(data => {
      console.log("Fetched modal data:", data);  // Debug log
      return data[type];
  })
  .catch(error => {
      console.error("There was a problem fetching the modal data:", error);
      throw error;
  });
}
