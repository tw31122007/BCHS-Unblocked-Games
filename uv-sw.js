importScripts("/uv/uv.sw.js");
// YouTube search submits to /results on this site. Send that back to the proxied site.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

const sw = new UVServiceWorker();
const originDb = "uv-origin-db";
let rememberedOrigin = null;

function originFromCookie(request) {
  const match = (request.headers.get("cookie") || "").match(/(?:^|;\s*)uv-origin=([^;]*)/);
  if (!match) return null;
  try {
    const parsed = new URL(decodeURIComponent(match[1]));
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.origin;
  } catch (error) {
    return null;
  }
}

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

function decodeProxyUrl(pathname) {
  const encoded = pathname.slice(__uv$config.prefix.length);
  return new URL(__uv$config.decodeUrl(encoded));
}

function isSitePage(pathname) {
  if (pathname === "/" || pathname.endsWith(".html")) return true;
  return (
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/games/") ||
    pathname.startsWith("/uv/") ||
    pathname.startsWith("/bare/") ||
    pathname.startsWith("/cdn-cgi/")
  );
}

function rememberOrigin(origin) {
  if (!origin) return;
  rememberedOrigin = origin;
  try {
    const request = indexedDB.open(originDb, 1);
    request.onupgradeneeded = () => request.result.createObjectStore("origin");
    request.onsuccess = () => {
      const db = request.result;
      db.transaction("origin", "readwrite").objectStore("origin").put(origin, "current");
      db.close();
    };
  } catch (error) {
    // The in-memory value still covers this tab.
  }
}

function loadOrigin() {
  if (rememberedOrigin) return Promise.resolve(rememberedOrigin);
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(originDb, 1);
      request.onupgradeneeded = () => request.result.createObjectStore("origin");
      request.onerror = () => resolve(null);
      request.onsuccess = () => {
        const db = request.result;
        const get = db.transaction("origin").objectStore("origin").get("current");
        get.onsuccess = () => {
          rememberedOrigin = get.result || null;
          db.close();
          resolve(rememberedOrigin);
        };
        get.onerror = () => {
          db.close();
          resolve(null);
        };
      };
    } catch (error) {
      resolve(null);
    }
  });
}

function googleCo(origin) {
  const parsed = new URL(origin);
  const port = parsed.port || (parsed.protocol === "https:" ? "443" : "80");
  return btoa(parsed.protocol + "//" + parsed.hostname + ":" + port).replace(/=+$/g, ".");
}

function fixedRecaptcha(url, request) {
  let decoded;
  try {
    decoded = decodeProxyUrl(url.pathname);
  } catch (error) {
    return null;
  }
  if (!decoded.pathname.includes("/recaptcha/") || !decoded.searchParams.has("co")) return null;
  const parent = originFromProxy(request.referrer || "") || "https://www.google.com";
  const token = googleCo(parent);
  if (decoded.searchParams.get("co") === token) return null;
  decoded.searchParams.set("co", token);
  return __uv$config.prefix + __uv$config.encodeUrl(decoded.href);
}

async function proxyPage(event, url) {
  if (event.request.method === "GET") {
    const fixed = fixedRecaptcha(url, event.request);
    if (fixed) return Response.redirect(fixed, 302);
  }

  const response = await sw.fetch(event);
  if (event.request.destination === "document") {
    try {
      const decoded = decodeProxyUrl(url.pathname);
      if (!decoded.pathname.includes("/recaptcha/")) rememberOrigin(decoded.origin);
    } catch (error) {
      // A page that cannot be decoded has no origin to remember.
    }
  }
  return response;
}

async function followOffsite(event, url) {
  const origin =
    originFromProxy(event.request.referrer || "") ||
    originFromCookie(event.request) ||
    (await loadOrigin());
  if (!origin) return fetch(event.request);
  const target = new URL(url.pathname + url.search + url.hash, origin + "/").href;
  return Response.redirect(__uv$config.prefix + __uv$config.encodeUrl(target), 302);
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin === location.origin && url.pathname.startsWith(__uv$config.prefix)) {
    event.respondWith(proxyPage(event, url));
    return;
  }

  if (
    event.request.mode === "navigate" &&
    url.origin === location.origin &&
    !isSitePage(url.pathname)
  ) {
    event.respondWith(followOffsite(event, url));
    return;
  }

  event.respondWith(fetch(event.request));
});
