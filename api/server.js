// Vercel Node.js Serverless Function that wraps the TanStack Start SSR
// fetch handler produced by `vite build` at `dist/server/server.js`.
//
// The build outputs a Cloudflare-Workers-style default export
// `{ fetch(request, env, ctx) }`. We adapt Node's IncomingMessage/
// ServerResponse to a Web `Request`/`Response` here.
//
// We use the Node runtime (not Edge) because Vite's SSR build leaves
// many dependencies (e.g. `@tanstack/router-core/ssr/server`,
// `tailwind-merge`) as external bare specifiers — Edge can't resolve
// those, but Node can via real `node_modules` resolution.
import handler from "../dist/server/server.js";

export const config = {
  runtime: "nodejs20.x",
};

export default async function (req, res) {
  try {
    const protocol =
      req.headers["x-forwarded-proto"] ?? (req.socket?.encrypted ? "https" : "http");
    const host = req.headers["x-forwarded-host"] ?? req.headers.host ?? "localhost";
    const url = `${protocol}://${host}${req.url}`;

    const init = {
      method: req.method,
      headers: toWebHeaders(req.headers),
    };
    if (req.method !== "GET" && req.method !== "HEAD") {
      // Buffer the body — fine for SSR HTML + small server-fn payloads.
      init.body = await readBody(req);
    }

    const webResponse = await handler.fetch(
      new Request(url, init),
      process.env,
      {},
    );

    res.statusCode = webResponse.status;
    webResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    if (webResponse.body) {
      const reader = webResponse.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("content-type", "text/plain; charset=utf-8");
    }
    res.end("Internal Server Error");
  }
}

function toWebHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(nodeHeaders)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) headers.append(key, v);
    } else {
      headers.set(key, String(value));
    }
  }
  return headers;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}
