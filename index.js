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
  localStorage.setItem('storedURL', encodedUrl);
  setIframeType('home')
  location.href="iframe.html"
  localStorage.setItem('shownameandimg', 'false');
  localStorage.setItem('app-name', 'Google');
  localStorage.setItem('app-image', 'assets/img/websites/google.png');
});

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
  // location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
  window.location.href="iframe.html"
}
// Makes the back button on the iframe page go back to the previous page correctly
function setIframeType(type) {
  localStorage.setItem('iframe-type', type);
}

document.getElementById('uv-address').addEventListener('mouseover', function() {
  this.focus();
});

document.getElementById('addBox').addEventListener('click', function() {
  alert('Coming soon...');
});
