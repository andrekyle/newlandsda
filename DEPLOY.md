# Deploying to Vercel with shared edits

The site supports in-browser content editing (logo, text, photos, bulletin
weeks, etc.). Edits are saved in two places:

1. **`localStorage`** in the editor's browser — instant, offline-safe.
2. **A shared server store** (Vercel KV / Upstash Redis) — so other visitors
   see the changes too.

The shared store is optional in local dev (it falls back to an in-memory
store) but required in production for the edits to be visible across
browsers.

## One-time Vercel setup

1. Push this repo to GitHub.
2. In the Vercel dashboard, **Import Project** → pick the repo.
3. Framework preset: leave as "Other" or "Vite" (TanStack Start is detected
   automatically). The included `vercel.json` already sets the build env
   variable `DEPLOY_TARGET=vercel` which disables the Cloudflare plugin.
4. Go to **Storage** in the project → **Create Database** → **KV** (Upstash
   Redis). Connect it to this project. Vercel will inject these env vars
   automatically into the project's runtime:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
5. Go to **Settings → Environment Variables** and add:
   - `ADMIN_PASSWORD` = the password your editors will type to enter edit
     mode. **Must match** the password used in the in-browser admin login
     (default `newlands2026` — change it from the admin menu after first
     login).
6. Redeploy.

That's it. Visit the site → click the admin button → enter the password →
make changes. Within ~1 second after each change, the new content is
written to KV; refresh in another browser to confirm it persisted.

## Local development

```bash
npm install
npm run dev
```

Without `KV_REST_API_URL` set, the server uses an in-process memory store —
edits persist for the life of the dev server only. That's enough to test
the UI.

To test against a real KV in dev, copy `.env.example` to `.env.local` and
fill in the KV credentials from the Vercel dashboard.

## Switching back to Cloudflare

The Cloudflare Workers config (`wrangler.jsonc`, `@cloudflare/vite-plugin`)
is left intact. It is automatically disabled when `VERCEL=1` or
`DEPLOY_TARGET=vercel` is set. To deploy to Cloudflare Workers instead, run
`npm run build` without those env vars and `wrangler deploy`. Note: the KV
sync layer currently targets Vercel KV / Upstash REST; for Cloudflare KV
you'd need to swap out `src/lib/edits-store.server.ts`.
