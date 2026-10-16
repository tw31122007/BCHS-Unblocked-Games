importScripts("/uv/uv.sw.js");
// Same-origin paths like /results stay on the proxied site when search submits.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

const sw = new UVServiceWorker();

function originFromProxy(referrer) {
  try {
    const prefix = location.origin + __uv$config.prefix;
    if (!referrer.startsWith(prefix)) return null;
    const encoded = referrer.slice(prefix.length).split("#")[0].split("?")[0];
    return new URL(__uv$config.decodeUrl(encoded)).origin;
  } catch (error) {
    return null;
  }
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin === location.origin && url.pathname.startsWith(__uv$config.prefix)) {
    event.respondWith(sw.fetch(event));
    return;
  }

  if (event.request.mode === "navigate" && url.origin === location.origin) {
    const origin = originFromProxy(event.request.referrer || "");
    if (origin) {
      const target = new URL(url.pathname + url.search + url.hash, origin + "/").href;
      const next = __uv$config.prefix + __uv$config.encodeUrl(target);
      event.respondWith(Response.redirect(next, 302));
      return;
    }
  }

  event.respondWith(fetch(event.request));
});
