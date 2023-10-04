"use strict";
/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("uv-form");
/**
 * @type {HTMLInputElement}
 */
const address = document.getElementById("uv-address");
/**
 * @type {HTMLInputElement}
 */
const searchEngine = document.getElementById("uv-search-engine");
/**
 * @type {HTMLParagraphElement}
 */
const error = document.getElementById("uv-error");
/**
 * @type {HTMLPreElement}
 */
const errorCode = document.getElementById("uv-error-code");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await registerSW();
  } catch (err) {
    error.textContent = "Failed to register service worker.";
    errorCode.textContent = err.toString();
    throw err;
  }

  const url = search(address.value, searchEngine.value);
  const encodedUrl = __uv$config.prefix + __uv$config.encodeUrl(url);
  loadURLInActiveTab(encodedUrl)
});
function loadURLInActiveTab(url) {
  const activeTabButton = document.querySelector('.tab.active-tab');
  const tabId = activeTabButton.getAttribute('data-tab-id');
  if(!tabId) {
      console.error("No tab ID found for active tab!");
      return;
  }

  const iframe = document.querySelector(`#${tabId} iframe`);
  iframe.parentElement.style.display = 'block';
  iframe.style.display = 'block';
  iframe.src = url; // This is the key change, moving src change here.
  iframe.focus();
  updateTabInfoFromIframe(tabId, iframe);
}
async function launchURL(openURL) {
  try {
    await registerSW();
  } catch (err) {
    error.textContent = "Failed to register service worker.";
    errorCode.textContent = err.toString();
    throw err;
  }

  const url = search(openURL, searchEngine.value);
  const encodedUrl = __uv$config.prefix + __uv$config.encodeUrl(url);
  localStorage.setItem('storedURL', encodedUrl);
  location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
}
// Makes the back button on the iframe page go back to the previous page correctly
function setIframeType(type) {
  localStorage.setItem('iframe-type', type);
}

// Makes the blinking cursor appear when the searchbar is hovered over
document.getElementById('uv-address').addEventListener('mouseover', function() {
  this.focus();
});

document.getElementById('addBox').addEventListener('click', function() {
  alert('Coming soon...');
});