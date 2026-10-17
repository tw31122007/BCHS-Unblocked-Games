// Bare Server v3. Ultraviolet 3.2 talks to /bare/v3/ with x-bare-url.

const EMPTY_STATUSES = new Set([204, 205, 304]);
const MAX_HEADER_VALUE = 3072;
const DROP_OUTBOUND = new Set([
  "connection",
  "content-length",
  "transfer-encoding",
  "keep-alive",
  "upgrade",
  "proxy-connection",
  "te",
  "trailer",
  "host",
  "sec-websocket-key",
  "sec-websocket-version",
  "sec-websocket-extensions",
  "sec-fetch-site",
  "sec-fetch-mode",
  "sec-fetch-dest",
  "sec-fetch-user",
]);
const DROP_RESPONSE = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "keep-alive",
  "transfer-encoding",
  "content-security-policy",
  "content-security-policy-report-only",
  "x-frame-options",
  "cross-origin-embedder-policy",
  "cross-origin-opener-policy",
  "cross-origin-resource-policy",
  "report-to",
  "nel",
  "permissions-policy",
  "feature-policy",
  "alt-svc",
]);
const BROWSER_HEADERS = [
  "user-agent",
  "accept-language",
  "sec-ch-ua",
  "sec-ch-ua-mobile",
  "sec-ch-ua-platform",
  "sec-ch-ua-full-version-list",
];
const STATUS_TEXT = {
  200: "OK",
  201: "Created",
  204: "No Content",
  301: "Moved Permanently",
  302: "Found",
  303: "See Other",
  304: "Not Modified",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable",
};

function bareError(status, code, message) {
  const headers = corsHeaders(null);
  headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify({ code, message }), { status, headers });
}

function corsHeaders(request) {
  const headers = new Headers();
  const origin = request?.headers.get("Origin");
  headers.set("Access-Control-Allow-Origin", origin || "*");
  headers.set("Access-Control-Allow-Headers", "*");
  headers.set("Access-Control-Allow-Methods", "*");
  headers.set(
    "Access-Control-Expose-Headers",
    "x-bare-status, x-bare-status-text, x-bare-headers",
  );
  if (origin) headers.set("Vary", "Origin");
  return headers;
}

function fromThisSite(request) {
  const host = new URL(request.url).host;
  if (request.headers.get("Sec-Fetch-Site") === "same-origin") return true;
  for (const name of ["Origin", "Referer"]) {
    const value = request.headers.get(name);
    if (!value) continue;
    try {
      if (new URL(value).host === host) return true;
    } catch {
      return false;
    }
  }
  return false;
}

function blockedHost(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host === "0.0.0.0" ||
    host === "::1" ||
    host === "metadata.google.internal"
  ) {
    return true;
  }
  const parts = host.split(".");
  if (parts.length !== 4 || parts.some((part) => !/^\d{1,3}$/.test(part))) return false;
  const nums = parts.map(Number);
  if (nums.some((n) => n > 255)) return true;
  const [a, b] = nums;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

function joinedBareHeaders(request) {
  const split = [];
  for (const [name, value] of request.headers) {
    if (!name.startsWith("x-bare-headers-")) continue;
    const id = Number(name.slice("x-bare-headers-".length));
    if (!Number.isInteger(id) || !value.startsWith(";")) {
      throw new Error("x-bare-headers was split incorrectly.");
    }
    split[id] = value.slice(1);
  }
  if (split.length) return split.join("");
  return request.headers.get("x-bare-headers");
}

function outboundHeaders(headerJson) {
  let parsed;
  try {
    parsed = JSON.parse(headerJson || "{}");
  } catch {
    throw new Error("x-bare-headers was not valid JSON.");
  }
  const headers = new Headers();
  for (const [name, value] of Object.entries(parsed)) {
    if (DROP_OUTBOUND.has(name.toLowerCase())) continue;
    if (typeof value === "string") headers.set(name, value);
    else if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string") headers.append(name, item);
      }
    }
  }
  return headers;
}

function applyBrowserHeaders(headers, request) {
  for (const name of BROWSER_HEADERS) {
    if (headers.has(name)) continue;
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  if (!headers.has("user-agent")) {
    headers.set(
      "user-agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    );
  }
}

async function readRemote(request) {
  let raw = request.headers.get("x-bare-url");
  let method = request.method.toUpperCase();
  let urlInBody = false;
  if (request.headers.get("x-bare-url-in-body") === "1") {
    raw = await request.text();
    method = (request.headers.get("x-bare-original-method") || "GET").toUpperCase();
    urlInBody = true;
  }
  if (!raw) throw new Error("Missing x-bare-url.");
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("x-bare-url was not a URL.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Unsupported protocol.");
  }
  if (blockedHost(url.hostname)) throw new Error("That address cannot be proxied.");
  return { url: url.href, headers: outboundHeaders(joinedBareHeaders(request)), method, urlInBody };
}

function isDisplayableStatus(status) {
  return Number.isInteger(status) && status >= 200 && status <= 599;
}

function safeStatusText(status, text) {
  const fallback = STATUS_TEXT[status] || "OK";
  if (typeof text !== "string" || !/^[\t\x20-\x7E]+$/.test(text)) return fallback;
  return text;
}

function responseHeaders(upstream) {
  const headers = {};
  upstream.headers.forEach((value, key) => {
    if (DROP_RESPONSE.has(key) || key === "set-cookie") return;
    if (typeof value !== "string" || /[\r\n]/.test(value)) return;
    headers[key] = value;
  });
  const cookies =
    typeof upstream.headers.getSetCookie === "function" ? upstream.headers.getSetCookie() : [];
  if (cookies.length === 1) headers["set-cookie"] = cookies[0];
  else if (cookies.length > 1) headers["set-cookie"] = cookies;
  return headers;
}

function writeBareHeaderJson(target, json) {
  if (json.length <= MAX_HEADER_VALUE) {
    target.set("x-bare-headers", json);
    return;
  }
  let id = 0;
  for (let i = 0; i < json.length; i += MAX_HEADER_VALUE) {
    target.set(`x-bare-headers-${id}`, `;${json.slice(i, i + MAX_HEADER_VALUE)}`);
    id += 1;
  }
}

async function fetchUpstream(url, method, headers, body) {
  // YouTube's player streams the request and the video at the same time.
  // Waiting for the whole request body first makes that player give up.
  const init = { method, headers, redirect: "manual" };
  if (body !== undefined && body !== null) {
    init.body = body;
    init.duplex = "half";
  }
  let upstream = await fetch(url, init);
  const replayable = body === undefined || body === null || body instanceof ArrayBuffer;
  if (!isDisplayableStatus(upstream.status) && replayable) {
    await upstream.body?.cancel?.();
    upstream = await fetch(url, {
      method,
      headers,
      body: body instanceof ArrayBuffer ? body : undefined,
      redirect: "follow",
    });
  }
  if (!isDisplayableStatus(upstream.status)) {
    await upstream.body?.cancel?.();
    upstream = new Response("This site did not return a page the proxy can show.", {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
  return upstream;
}

async function proxyHttp(request) {
  const remote = await readRemote(request);
  const { url, headers } = remote;
  applyBrowserHeaders(headers, request);
  const method = remote.method;
  const body = remote.urlInBody || method === "GET" || method === "HEAD" ? undefined : request.body;
  const upstream = await fetchUpstream(url, method, headers, body);
  const status = upstream.status;
  const echoed = responseHeaders(upstream);
  if (status >= 300 && status < 400 && echoed["content-type"] === "application/binary") {
    delete echoed["content-type"];
  }

  const wrapped = corsHeaders(request);
  wrapped.set("x-bare-status", String(status));
  wrapped.set("x-bare-status-text", safeStatusText(status, upstream.statusText));
  writeBareHeaderJson(wrapped, JSON.stringify(echoed));
  return new Response(EMPTY_STATUSES.has(status) ? null : upstream.body, {
    status: 200,
    headers: wrapped,
  });
}

function pipeSocket(from, to) {
  from.binaryType = "arraybuffer";
  from.addEventListener("message", (event) => {
    try {
      if (to.readyState === 1) to.send(event.data);
    } catch {
      // The other side already closed.
    }
  });
  from.addEventListener("close", (event) => {
    try {
      if (to.readyState === 0 || to.readyState === 1) to.close(event.code || 1000, event.reason || "");
    } catch {
      // Already closed.
    }
  });
  from.addEventListener("error", () => {
    try {
      to.close(1011, "socket error");
    } catch {
      // Already closed.
    }
  });
}

async function proxyWebSocket(request) {
  const pair = new WebSocketPair();
  const client = pair[0];
  const server = pair[1];
  server.accept();

  const fail = (code, reason) => {
    try {
      server.close(code, reason);
    } catch {
      // Already closed.
    }
  };

  const timer = setTimeout(() => fail(1008, "connect timeout"), 10000);
  server.addEventListener(
    "message",
    async (event) => {
      clearTimeout(timer);
      if (typeof event.data !== "string") {
        fail(1003, "expected text");
        return;
      }
      let message;
      try {
        message = JSON.parse(event.data);
      } catch {
        fail(1003, "invalid json");
        return;
      }
      if (message?.type !== "connect" || typeof message.remote !== "string") {
        fail(1003, "expected connect");
        return;
      }
      let remote;
      try {
        remote = new URL(message.remote);
      } catch {
        fail(1003, "bad url");
        return;
      }
      if ((remote.protocol !== "ws:" && remote.protocol !== "wss:") || blockedHost(remote.hostname)) {
        fail(1003, "that address cannot be proxied");
        return;
      }
      const headers = outboundHeaders(JSON.stringify(message.headers || {}));
      headers.set("Upgrade", "websocket");
      if (Array.isArray(message.protocols) && message.protocols.length) {
        headers.set("Sec-WebSocket-Protocol", message.protocols.filter((item) => typeof item === "string").join(", "));
      }
      try {
        const upstream = await fetch(remote.href, { headers });
        const remoteSocket = upstream.webSocket;
        if (!remoteSocket) {
          fail(1011, "upstream refused");
          return;
        }
        remoteSocket.accept();
        const cookies =
          typeof upstream.headers.getSetCookie === "function" ? upstream.headers.getSetCookie() : [];
        server.send(
          JSON.stringify({
            type: "open",
            protocol: upstream.headers.get("sec-websocket-protocol") || "",
            setCookies: cookies,
          }),
        );
        pipeSocket(server, remoteSocket);
        pipeSocket(remoteSocket, server);
      } catch {
        fail(1011, "connect failed");
      }
    },
    { once: true },
  );

  return new Response(null, { status: 101, webSocket: client });
}

function versions(request) {
  const headers = corsHeaders(request);
  headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify({ versions: ["v3"] }), { status: 200, headers });
}

export async function handleBareRequest(request) {
  const pathname = new URL(request.url).pathname.replace(/\/+$/, "") || "/";
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  }
  if (pathname === "/bare") return versions(request);
  if (pathname !== "/bare/v3") return bareError(404, "UNKNOWN", "Not found.");
  if (!request.headers.get("x-bare-url")) return versions(request);
  if (!fromThisSite(request)) return bareError(403, "FORBIDDEN", "This proxy only serves this site.");

  try {
    if (request.headers.get("Upgrade")?.toLowerCase() === "websocket") {
      return await proxyWebSocket(request);
    }
    return await proxyHttp(request);
  } catch (error) {
    return bareError(500, "UNKNOWN", error instanceof Error ? error.message : "Proxy request failed.");
  }
}

export async function onRequest(context) {
  return handleBareRequest(context.request);
}
