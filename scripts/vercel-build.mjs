#!/usr/bin/env node
/**
 * Post-build script that converts `dist/` into Vercel's Build Output API v3
 * layout under `.vercel/output/`. Bypasses Vercel framework auto-detection
 * entirely.
 *
 * Layout produced:
 *   .vercel/output/config.json              — routes
 *   .vercel/output/static/                  — public static assets (= dist/client)
 *   .vercel/output/functions/index.func/    — Node serverless function
 *     ├── .vc-config.json                   — runtime + handler config
 *     ├── index.mjs                         — function entrypoint
 *     └── server.js + assets/               — SSR bundle (copied from dist/server)
 */
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const distClient = resolve(root, "dist/client");
const distServer = resolve(root, "dist/server");
const outRoot = resolve(root, ".vercel/output");
const outStatic = resolve(outRoot, "static");
const outFunc = resolve(outRoot, "functions/index.func");

if (!existsSync(distClient) || !existsSync(distServer)) {
  console.error(
    "[vercel-build] dist/client or dist/server missing — run `vite build` first.",
  );
  process.exit(1);
}

console.log("[vercel-build] writing .vercel/output/ ...");
rmSync(outRoot, { recursive: true, force: true });
mkdirSync(outRoot, { recursive: true });

// 1. Static assets
cpSync(distClient, outStatic, { recursive: true });

// 2. Serverless function (Node)
mkdirSync(outFunc, { recursive: true });
// Copy entire SSR bundle next to the entrypoint so relative imports resolve.
cpSync(distServer, outFunc, { recursive: true });

// 2a. Function entrypoint — adapts Node req/res to Web fetch handler.
writeFileSync(
  resolve(outFunc, "index.mjs"),
  `import handler from "./server.js";

export default async function (req, res) {
  try {
    const protocol =
      req.headers["x-forwarded-proto"] ?? (req.socket?.encrypted ? "https" : "http");
    const host = req.headers["x-forwarded-host"] ?? req.headers.host ?? "localhost";
    const url = \`\${protocol}://\${host}\${req.url}\`;

    const init = {
      method: req.method,
      headers: toWebHeaders(req.headers),
    };
    if (req.method !== "GET" && req.method !== "HEAD") {
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
`,
);

// 2b. Function config
writeFileSync(
  resolve(outFunc, ".vc-config.json"),
  JSON.stringify(
    {
      runtime: "nodejs20.x",
      handler: "index.mjs",
      launcherType: "Nodejs",
      shouldAddHelpers: false,
      supportsResponseStreaming: true,
    },
    null,
    2,
  ),
);

// 2c. Function-local package.json so Node treats .mjs/.js as ESM.
writeFileSync(
  resolve(outFunc, "package.json"),
  JSON.stringify({ type: "module" }, null, 2),
);

// 3. Top-level config: route everything not matching a static file to the function.
writeFileSync(
  resolve(outRoot, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [
        { handle: "filesystem" },
        { src: "/.*", dest: "/index" },
      ],
    },
    null,
    2,
  ),
);

console.log("[vercel-build] done.");
