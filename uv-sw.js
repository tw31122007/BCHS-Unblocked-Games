importScripts("/uv/uv.sw.js");
// Bare fetches include same-origin cookies so Cloudflare Access can see the preview login.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

const sw = new UVServiceWorker();

self.addEventListener("fetch", (event) => event.respondWith(sw.fetch(event)));
