import { createServerFn } from "@tanstack/react-start";

/**
 * Server functions that read/write site-wide content overrides.
 *
 * Storage backend lives in `edits-store.server.ts` (Vercel KV / Upstash
 * Redis REST API in production, in-memory fallback in local dev).
 *
 * Auth model:
 *  - Reads (`loadOverridesServerFn`) are public — overrides are published
 *    content shown to all visitors.
 *  - Writes (`saveOverridesServerFn`) and password verification
 *    (`verifyAdminServerFn`) check the submitted password against the
 *    `ADMIN_PASSWORD` env var using a constant-time comparison.
 *  - If `ADMIN_PASSWORD` is unset:
 *      - In dev (NODE_ENV !== "production"): both succeed for any non-empty
 *        password so you can test the flow without configuring env vars.
 *      - In production: both REJECT — the admin feature is effectively
 *        disabled until the env var is set. Writes are never silently
 *        allowed in production.
 *
 * The password is never compared on the client and never returned to the
 * client. The client only learns "ok / not ok".
 */

type Overrides = Record<string, unknown>;

const IS_PROD = process.env.NODE_ENV === "production";

/** Constant-time string comparison to avoid timing side channels. */
function timingSafeStringEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let mismatch = a.length === b.length ? 0 : 1;
  for (let i = 0; i < len; i++) {
    const ca = i < a.length ? a.charCodeAt(i) : 0;
    const cb = i < b.length ? b.charCodeAt(i) : 0;
    mismatch |= ca ^ cb;
  }
  return mismatch === 0;
}

function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    if (IS_PROD) return false;
    return password.length > 0;
  }
  return timingSafeStringEqual(password, expected);
}

export const loadOverridesServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const { loadOverrides, isStorageRemote } = await import(
      "./edits-store.server"
    );
    const overrides = await loadOverrides();
    return { overrides, remote: isStorageRemote() };
  },
);

/**
 * Verify the admin password. Returns `{ ok: true }` on success, throws a
 * generic "Unauthorized" on failure (no info about why).
 */
export const verifyAdminServerFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (!data || typeof data !== "object") throw new Error("Invalid payload");
    const d = data as { password?: unknown };
    if (typeof d.password !== "string") throw new Error("Invalid payload");
    return { password: d.password };
  })
  .handler(async ({ data }) => {
    if (!checkPassword(data.password)) {
      throw new Error("Unauthorized");
    }
    return { ok: true as const };
  });

export const saveOverridesServerFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (!data || typeof data !== "object") {
      throw new Error("Invalid payload");
    }
    const d = data as { password?: unknown; overrides?: unknown };
    if (typeof d.password !== "string") throw new Error("Invalid payload");
    if (
      !d.overrides ||
      typeof d.overrides !== "object" ||
      Array.isArray(d.overrides)
    ) {
      throw new Error("Invalid payload");
    }
    return {
      password: d.password,
      overrides: d.overrides as Overrides,
    };
  })
  .handler(async ({ data }) => {
    if (!checkPassword(data.password)) {
      throw new Error("Unauthorized");
    }
    const { saveOverrides } = await import("./edits-store.server");
    await saveOverrides(data.overrides);
    return { ok: true as const };
  });
