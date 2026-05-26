/**
 * Server-only storage backend for site-wide content overrides.
 *
 * In production (Vercel) we use Vercel KV / Upstash Redis via its REST API.
 * The env vars `KV_REST_API_URL` and `KV_REST_API_TOKEN` are populated
 * automatically when you enable a KV store in the Vercel dashboard.
 *
 * In local dev (no KV env vars), we fall back to an in-process memory store
 * so the rest of the app still works — those edits do NOT persist across
 * server restarts.
 */

export type Overrides = Record<string, unknown>;

const KEY = "newlandsda:edits:v1";

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

/** In-memory fallback for `npm run dev` without KV configured. */
let memoryStore: Overrides | null = null;

async function kvGet(): Promise<Overrides | null> {
  if (!KV_URL || !KV_TOKEN) {
    return memoryStore;
  }
  const res = await fetch(`${KV_URL}/get/${encodeURIComponent(KEY)}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`KV get failed: ${res.status} ${res.statusText}`);
  }
  const body = (await res.json()) as { result: string | null };
  if (!body.result) return null;
  try {
    return JSON.parse(body.result) as Overrides;
  } catch {
    return null;
  }
}

async function kvSet(overrides: Overrides): Promise<void> {
  if (!KV_URL || !KV_TOKEN) {
    memoryStore = overrides;
    return;
  }
  const res = await fetch(`${KV_URL}/set/${encodeURIComponent(KEY)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(JSON.stringify(overrides)),
  });
  if (!res.ok) {
    throw new Error(`KV set failed: ${res.status} ${res.statusText}`);
  }
}

export async function loadOverrides(): Promise<Overrides> {
  const value = await kvGet();
  return value ?? {};
}

export async function saveOverrides(overrides: Overrides): Promise<void> {
  await kvSet(overrides);
}

export function isStorageRemote(): boolean {
  return Boolean(KV_URL && KV_TOKEN);
}
