// Vercel Edge Function that wraps the TanStack Start SSR fetch handler
// produced by `vite build` at `dist/server/server.js`.
//
// The build outputs a Cloudflare-Workers-style default export
// `{ fetch(request, env, ctx) }`. Vercel's Edge runtime gives us a standard
// Web `Request`, so we just forward it.
import handler from "../dist/server/server.js";

export const config = {
  runtime: "edge",
};

export default async function (request) {
  // Pass `process.env` as the `env` argument so server functions that read
  // env vars (e.g. ADMIN_PASSWORD, KV_REST_API_URL) keep working.
  return handler.fetch(request, process.env, {});
}
