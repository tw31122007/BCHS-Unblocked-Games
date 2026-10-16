importScripts("/uv/uv.sw.js");
// Page scripts are not prefixed, and reCAPTCHA is left unrewritten.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

const sw = new UVServiceWorker();

self.addEventListener("fetch", (event) => event.respondWith(sw.fetch(event)));
