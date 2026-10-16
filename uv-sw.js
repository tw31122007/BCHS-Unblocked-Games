importScripts("/uv/uv.sw.js");
// Bare responses must use a status from 200 to 599. See functions/bare/proxy.js.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

const sw = new UVServiceWorker();

self.addEventListener("fetch", (event) => event.respondWith(sw.fetch(event)));
