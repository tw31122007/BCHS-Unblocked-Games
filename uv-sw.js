importScripts("/uv/uv.bundle.js");
importScripts("/uv/uv.config.js");
importScripts("/uv/uv.sw.js");

const uv = new UVServiceWorker();
let lastOrigin = null;

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

function isLocal(pathname) {
  if (pathname === "/" || pathname.endsWith(".html")) return true;
  return (
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/games/") ||
    pathname.startsWith("/uv/") ||
    pathname.startsWith("/bare/") ||
    pathname.startsWith("/baremux/") ||
    pathname.startsWith("/baremod/") ||
    pathname.startsWith("/cdn-cgi/")
  );
}

function originFromProxyUrl(value) {
  try {
    const prefix = location.origin + __uv$config.prefix;
    if (!value || !value.startsWith(prefix)) return null;
    const encoded = value.slice(prefix.length).split("#")[0].split("?")[0];
    return new URL(__uv$config.decodeUrl(encoded)).origin;
  } catch (error) {
    return null;
  }
}

async function originFromClient(event) {
  const id = event.clientId || event.resultingClientId;
  if (!id) return null;
  const client = await self.clients.get(id);
  if (!client) return null;
  return originFromProxyUrl(client.url);
}

function proxiedRequest(event, target) {
  const next = location.origin + __uv$config.prefix + __uv$config.encodeUrl(target);
  if (event.request.mode === "navigate" || event.request.method === "GET" || event.request.method === "HEAD") {
    return new Request(next, { method: event.request.method, headers: event.request.headers });
  }
  return new Request(next, {
    method: event.request.method,
    headers: event.request.headers,
    body: event.request.body,
    duplex: "half",
  });
}

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const url = new URL(event.request.url);
      if (uv.route(event)) {
        if (event.request.destination === "document") {
          const origin = originFromProxyUrl(event.request.url);
          if (origin) lastOrigin = origin;
        }
        return await uv.fetch(event);
      }

      if (url.origin === location.origin && !isLocal(url.pathname)) {
        const origin =
          (await originFromClient(event)) ||
          originFromProxyUrl(event.request.referrer) ||
          (event.request.mode === "navigate" ? lastOrigin : null);
        if (origin) {
          const target = new URL(url.pathname + url.search + url.hash, origin + "/").href;
          if (event.request.mode === "navigate") {
            return Response.redirect(
              location.origin + __uv$config.prefix + __uv$config.encodeUrl(target),
              302,
            );
          }
          return await uv.fetch({ request: proxiedRequest(event, target) });
        }
      }

      return await fetch(event.request);
    })(),
  );
});
