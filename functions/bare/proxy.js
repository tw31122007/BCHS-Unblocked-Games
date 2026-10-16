// Bare Server v1, the protocol this site's Ultraviolet service worker already speaks.
// Deployed as a Cloudflare Pages Function at /bare/ so the search bar can
// load Google (and other http/https pages) inside iframe.html.

const VALID_PROTOCOLS = new Set(["http:", "https:", "ws:", "wss:"]);
const EMPTY_STATUSES = new Set([204, 205, 304]);
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
  "origin",
  "referer",
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
]);

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

function bareError(status, message) {
  return new Response(message, {
    status,
    headers: corsHeaders(null),
  });
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

  const origin = request.headers.get("Origin");
  if (origin) {
    try {
      if (new URL(origin).host === host) return true;
    } catch {
      return false;
    }
  }

  const referer = request.headers.get("Referer");
  if (referer) {
    try {
      if (new URL(referer).host === host) return true;
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
  if (parts.length !== 4 || parts.some((part) => !/^\d{1,3}$/.test(part))) {
    return false;
  }
  const [a, b] = parts.map(Number);
  if ([a, b, ...parts.slice(2).map(Number)].some((n) => n > 255)) return true;
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

function remoteURL(protocol, host, port, path) {
  if (!VALID_PROTOCOLS.has(protocol)) {
    throw new Error("Unsupported protocol.");
  }
  if (!host || blockedHost(host)) {
    throw new Error("That address cannot be proxied.");
  }
  if (!path.startsWith("/")) path = `/${path}`;
  const secure = protocol === "https:" || protocol === "wss:";
  const normalPort = !port || port === (secure ? "443" : "80");
  return `${protocol}//${host}${normalPort ? "" : `:${port}`}${path}`;
}

function outboundHeaders(headerJson) {
  let parsed;
  try {
    parsed = JSON.parse(headerJson);
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

function readRemote(request) {
  const protocol = request.headers.get("x-bare-protocol");
  const host = request.headers.get("x-bare-host");
  const port = request.headers.get("x-bare-port");
  const path = request.headers.get("x-bare-path");
  const headerJson = request.headers.get("x-bare-headers");
  if (!protocol || !host || !port || path === null || !headerJson) {
    throw new Error("Missing Bare headers.");
  }
  return {
    url: remoteURL(protocol, host, port, path),
    headers: outboundHeaders(headerJson),
  };
}

function responseHeaders(upstream) {
  const headers = {};
  upstream.headers.forEach((value, key) => {
    if (DROP_RESPONSE.has(key) || key === "set-cookie") return;
    headers[key] = value;
  });

  const cookies =
    typeof upstream.headers.getSetCookie === "function"
      ? upstream.headers.getSetCookie()
      : [];
  if (cookies.length === 1) headers["set-cookie"] = cookies[0];
  else if (cookies.length > 1) headers["set-cookie"] = cookies;
  return headers;
}

async function proxyHttp(request) {
  const { url, headers } = readRemote(request);
  const method = request.method.toUpperCase();
  const upstream = await fetch(url, {
    method,
    headers,
    body: method === "GET" || method === "HEAD" ? undefined : request.body,
    redirect: "manual",
  });

  const wrapped = corsHeaders(request);
  wrapped.set("x-bare-status", String(upstream.status));
  wrapped.set(
    "x-bare-status-text",
    upstream.statusText || STATUS_TEXT[upstream.status] || "",
  );
  wrapped.set("x-bare-headers", JSON.stringify(responseHeaders(upstream)));

  return new Response(EMPTY_STATUSES.has(upstream.status) ? null : upstream.body, {
    status: 200,
    headers: wrapped,
  });
}

function decodeProtocol(protocol) {
  let result = "";
  for (let i = 0; i < protocol.length; i++) {
    const char = protocol[i];
    if (char === "%") {
      result += String.fromCharCode(parseInt(protocol.slice(i + 1, i + 3), 16));
      i += 2;
    } else {
      result += char;
    }
  }
  return result;
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
      if (to.readyState === 0 || to.readyState === 1) {
        to.close(event.code || 1000, event.reason || "");
      }
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
  const offered = request.headers.get("Sec-WebSocket-Protocol") || "";
  const [selected, encoded] = offered.split(/,\s*/);
  if (selected !== "bare" || !encoded) {
    return bareError(400, "Expected a Bare WebSocket.");
  }

  const meta = JSON.parse(decodeProtocol(encoded));
  const remote = meta.remote || {};
  const url = remoteURL(remote.protocol, remote.host, String(remote.port || ""), remote.path || "/");
  const headers = outboundHeaders(JSON.stringify(meta.headers || {}));
  headers.set("Upgrade", "websocket");

  const upstream = await fetch(url, { headers });
  const remoteSocket = upstream.webSocket;
  if (!remoteSocket) {
    return bareError(502, "Upstream refused the WebSocket.");
  }

  const pair = new WebSocketPair();
  const client = pair[0];
  const server = pair[1];
  server.accept();
  remoteSocket.binaryType = "arraybuffer";
  remoteSocket.accept();
  pipeSocket(server, remoteSocket);
  pipeSocket(remoteSocket, server);

  const responseHeaders = corsHeaders(request);
  responseHeaders.set("Sec-WebSocket-Protocol", "bare");
  return new Response(null, {
    status: 101,
    webSocket: client,
    headers: responseHeaders,
  });
}

export async function handleBareRequest(request) {
  const { pathname } = new URL(request.url);
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
  }

  if (pathname === "/bare" || pathname === "/bare/") {
    return new Response(JSON.stringify({ versions: ["v1"] }), {
      headers: { "content-type": "application/json", ...Object.fromEntries(corsHeaders(request)) },
    });
  }

  const isV1 =
    pathname === "/bare/v1" ||
    pathname === "/bare/v1/" ||
    pathname.startsWith("/bare/v1/");
  if (!isV1) return bareError(404, "Not found.");
  if (!fromThisSite(request)) return bareError(403, "This proxy only serves this site.");

  try {
    if (request.headers.get("Upgrade")?.toLowerCase() === "websocket") {
      return await proxyWebSocket(request);
    }
    return await proxyHttp(request);
  } catch (error) {
    return bareError(500, error instanceof Error ? error.message : "Proxy request failed.");
  }
}

export async function onRequest(context) {
  return handleBareRequest(context.request);
}
