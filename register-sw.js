"use strict";

const stockSW = "/uv-sw.js";
const swAllowedHostnames = ["localhost", "127.0.0.1"];

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load " + src));
    document.head.appendChild(script);
  });
}

async function registerSW() {
  if (
    location.protocol !== "https:" &&
    !swAllowedHostnames.includes(location.hostname)
  ) {
    throw new Error("Service workers cannot be registered without https.");
  }
  if (!navigator.serviceWorker) {
    throw new Error("Your browser doesn't support service workers.");
  }
  if (typeof SharedWorker === "undefined") {
    throw new Error("This browser cannot run the proxy transport.");
  }

  if (!window.BareMux) await loadScript("/baremux/index.js");
  if (!window.Ultraviolet) await loadScript("/uv/uv.bundle.js");
  if (!self.__uv$config) await loadScript("/uv/uv.config.js");

  const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
  globalThis.__bchsBare = connection;
  await connection.setTransport("/baremod/index.mjs", [location.origin + "/bare/"]);

  await navigator.serviceWorker.register(stockSW, { scope: "/" });
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    registrations.map((registration) => {
      if (new URL(registration.scope).pathname === "/") return Promise.resolve();
      return registration.unregister();
    }),
  );
  await navigator.serviceWorker.ready;
}
