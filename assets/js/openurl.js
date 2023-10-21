const form = document.querySelector('form');
const input = document.querySelector('input');
dd
function isUrl(val = '') {
    if (/^http(s?):\/\//.test(val) || val.includes('.') && val.substr(0, 1) !== ' ') return true;
    return false;
};

document.getElementById('searchInput').addEventListener('mouseover', function() {
    this.focus();
  });
const searchInput = document.getElementById('searchInput');
let hasMousedown = false;

searchInput.addEventListener('mouseenter', function() {
    if (!hasMousedown) {
        this.focus();
    }
});

function openURL(url) {
    window.navigator.serviceWorker
    .register("./sw.js", {
      scope: __uv$config.prefix,
    })
    .then(() => {
      if (!isUrl(url)) url = 'https://www.google.com/search?q=' + url;
      else if (!(url.startsWith("https://") || url.startsWith("http://")))
          url = "http://" + url;
          localStorage.setItem('iframeurl', __uv$config.prefix + __uv$config.encodeUrl(url))
          window.location.href = "./iframe.html";
  
    });
};
function searchFunction() {
    let input = document.getElementById('searchInput');
    let filter = input.value.toUpperCase();
    let cards = document.getElementsByClassName('card');

    for (i = 0; i < cards.length; i++) {
        let title = cards[i].getElementsByTagName('h2')[0];
        let txtValue = title.textContent || title.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            cards[i].style.display = "";
        } else {
            cards[i].style.display = "none";
        }
    }
}
function setIframeType(type) {
    localStorage.setItem('iframe-type', type);
}
function setSWFUrl(swfPath) {
    // Set the provided SWF file path in the localStorage
    localStorage.setItem('swfurl', swfPath);
}
function setWaflashURL(url) {
    localStorage.setItem('waflashurl', url);
    window.location.href = 'waflash.html'; // Redirect to the flash emulator page after setting the SWF URL
}