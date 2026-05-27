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

/**
 * Upload an image to the GitHub repo via the Contents API. The file is
 * committed to `public/uploads/<slug>-<hash>.<ext>` which Vercel serves at
 * `/uploads/<slug>-<hash>.<ext>` after the auto-redeploy completes.
 *
 * Required env vars (set on the deployment):
 *   - ADMIN_PASSWORD            (already used elsewhere)
 *   - GITHUB_TOKEN              PAT with `contents:write` on the repo
 *   - GITHUB_REPO               e.g. "andrekyle/newlandsda"
 *   - GITHUB_BRANCH (optional)  default "main"
 *
 * If GITHUB_TOKEN or GITHUB_REPO is missing the function throws — the
 * client can then fall back to embedding the data URL into the overrides
 * payload (the existing behaviour).
 */
export const uploadImageServerFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (!data || typeof data !== "object") throw new Error("Invalid payload");
    const d = data as { password?: unknown; id?: unknown; dataUrl?: unknown };
    if (typeof d.password !== "string") throw new Error("Invalid payload");
    if (typeof d.id !== "string" || !d.id) throw new Error("Invalid payload");
    if (typeof d.dataUrl !== "string" || !d.dataUrl.startsWith("data:image/")) {
      throw new Error("Invalid payload");
    }
    return { password: d.password, id: d.id, dataUrl: d.dataUrl };
  })
  .handler(async ({ data }) => {
    if (!checkPassword(data.password)) {
      throw new Error("Unauthorized");
    }
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || "main";
    if (!token || !repo) {
      throw new Error("Server upload not configured (missing GITHUB_TOKEN or GITHUB_REPO)");
    }

    // Parse data URL.
    const match = /^data:image\/([a-z0-9.+-]+);base64,(.+)$/i.exec(data.dataUrl);
    if (!match) throw new Error("Unsupported image format");
    const mimeSub = match[1].toLowerCase();
    const base64 = match[2];
    const extMap: Record<string, string> = {
      jpeg: "jpg",
      jpg: "jpg",
      png: "png",
      webp: "webp",
      gif: "gif",
      "svg+xml": "svg",
    };
    const ext = extMap[mimeSub] ?? "bin";
    if (ext === "bin") throw new Error("Unsupported image format");

    // Hash for cache-busting + filename uniqueness.
    const { createHash } = await import("node:crypto");
    const hash = createHash("sha256").update(base64, "base64").digest("hex").slice(0, 12);

    // Slugify the override id for the filename.
    const slug = data.id
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "image";

    const path = `public/uploads/${slug}-${hash}.${ext}`;
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${encodeURI(path)}`;

    // Check if the file already exists (same content already uploaded).
    // If so, skip the PUT and reuse the URL — saves a no-op commit.
    let exists = false;
    try {
      const head = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "User-Agent": "newlandsda-uploader",
        },
      });
      if (head.ok) exists = true;
    } catch {
      /* ignore — treat as not existing */
    }

    if (!exists) {
      const putRes = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
          "User-Agent": "newlandsda-uploader",
        },
        body: JSON.stringify({
          message: `Upload image for ${data.id}`,
          content: base64,
          branch,
        }),
      });
      if (!putRes.ok) {
        const text = await putRes.text().catch(() => "");
        throw new Error(`GitHub upload failed (${putRes.status}): ${text.slice(0, 200)}`);
      }
    }

    return { url: `/uploads/${slug}-${hash}.${ext}` };
  });

