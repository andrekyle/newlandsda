import * as React from "react";
import {
  loadOverridesServerFn,
  saveOverridesServerFn,
  verifyAdminServerFn,
} from "./edits-sync";

/**
 * Browser-only admin / edit mode.
 *
 * SECURITY MODEL:
 *  - The admin password is NEVER stored on the client. It lives only in
 *    the `ADMIN_PASSWORD` server env var.
 *  - `enable(password)` posts the password to a server function that
 *    compares it (constant-time) against the env var. On success the
 *    password is held only in this tab's in-memory ref to authorize
 *    subsequent writes; it is never written to localStorage / sessionStorage
 *    / cookies and is never echoed back from the server.
 *  - Edits saved to localStorage are content only, never credentials.
 */

const STORAGE_EDITS = "newlandsda:edits";

type Overrides = Record<string, unknown>;

type AdminContextValue = {
  /** True when the admin has unlocked edit mode in this tab. */
  editMode: boolean;
  /** True once we have read persisted overrides from localStorage (client-only). */
  ready: boolean;
  /** Verifies the password against the server. Resolves true on success. */
  enable: (password: string) => Promise<boolean>;
  disable: () => void;
  overrides: Overrides;
  setOverride: (id: string, value: unknown) => void;
  clearOverride: (id: string) => void;
  clearAll: () => void;
  exportJson: () => string;
  importJson: (json: string) => boolean;
  /** Undo / redo for edits made in the current session. */
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

const AdminContext = React.createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [editMode, setEditMode] = React.useState(false);
  const [overrides, setOverrides] = React.useState<Overrides>({});
  const [ready, setReady] = React.useState(false);
  // Plaintext password kept only in this tab's memory (never persisted).
  // We need it to authorize writes to the shared backend.
  const sessionPassword = React.useRef<string>("");
  const [remoteEnabled, setRemoteEnabled] = React.useState(false);

  // History stacks live in refs (we don't need them to drive renders directly;
  // we bump `historyVersion` whenever the stacks change so canUndo/canRedo
  // re-evaluate).
  const undoStack = React.useRef<Overrides[]>([]);
  const redoStack = React.useRef<Overrides[]>([]);
  const lastChange = React.useRef<{ id: string | null; time: number }>({
    id: null,
    time: 0,
  });
  const [historyVersion, setHistoryVersion] = React.useState(0);
  const MAX_HISTORY = 50;
  const COALESCE_MS = 800;

  React.useEffect(() => {
    // 1. Hydrate immediately from localStorage so the page doesn't flicker.
    let localOverrides: Overrides = {};
    try {
      const raw = localStorage.getItem(STORAGE_EDITS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          localOverrides = parsed as Overrides;
          setOverrides(parsed);
        }
      }
    } catch {
      /* ignore */
    }
    setReady(true);

    // 2. Then fetch the shared (server) overrides. Server wins for any
    //    overlapping keys so visitors see the latest published content.
    let cancelled = false;
    loadOverridesServerFn()
      .then((res) => {
        if (cancelled) return;
        setRemoteEnabled(res.remote);
        const merged = { ...localOverrides, ...res.overrides };
        setOverrides(merged);
        try {
          localStorage.setItem(STORAGE_EDITS, JSON.stringify(merged));
        } catch {
          /* ignore */
        }
      })
      .catch((err) => {
        // Non-fatal: site still works using localStorage edits only.
        console.warn("Could not load shared edits:", err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = React.useCallback((next: Overrides) => {
    try {
      localStorage.setItem(STORAGE_EDITS, JSON.stringify(next));
      return true;
    } catch (err) {
      // Most likely QuotaExceededError. Tell the user instead of silently
      // dropping the change — otherwise edits look saved but vanish on reload.
      const isQuota =
        err instanceof DOMException &&
        (err.name === "QuotaExceededError" ||
          err.name === "NS_ERROR_DOM_QUOTA_REACHED");
      if (typeof window !== "undefined") {
        if (isQuota) {
          alert(
            "Couldn't save: your browser's local storage is full.\n\n" +
              "Large images take up a lot of space. Try replacing big photos " +
              "with smaller versions, or use Reset to clear unused edits.",
          );
        } else {
          console.error("Failed to persist edits:", err);
        }
      }
      return false;
    }
  }, []);

  /** Push a snapshot onto the undo stack, with rapid-edit coalescing per id. */
  const recordHistory = React.useCallback(
    (prev: Overrides, changeId: string | null) => {
      const now = Date.now();
      const same =
        changeId !== null &&
        lastChange.current.id === changeId &&
        now - lastChange.current.time < COALESCE_MS;
      if (!same) {
        undoStack.current.push(prev);
        if (undoStack.current.length > MAX_HISTORY) undoStack.current.shift();
        redoStack.current = [];
      }
      lastChange.current = { id: changeId, time: now };
      setHistoryVersion((v) => v + 1);
    },
    [],
  );

  // ---- Remote sync (debounced) ----------------------------------------
  // Whenever overrides change while the admin is in edit mode, send the
  // full set to the server so other browsers see it on next load. We
  // debounce ~1s to coalesce rapid typing.
  const pushTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPushedRef = React.useRef<string>("");
  const warnedImageSkipRef = React.useRef(false);

  /**
   * Build the payload we actually send to the server. Image overrides are
   * stored as base64 data URLs and can easily blow past Vercel's request
   * body limit (causing "Request Entity Too Large" / HTTP 413), which
   * would also block every text edit from publishing. We drop large data
   * URLs from the shared payload — they stay in the editor's localStorage
   * so the admin still sees them, but they don't get published to all
   * visitors via the shared KV store.
   */
  const buildPublishablePayload = React.useCallback(
    (next: Overrides): { payload: Overrides; skippedImages: number } => {
      const MAX_VALUE_BYTES = 200 * 1024; // ~200 KB per entry
      const MAX_TOTAL_BYTES = 1_500 * 1024; // ~1.5 MB total payload
      const payload: Overrides = {};
      let skippedImages = 0;
      let total = 0;
      // First pass: drop oversized data-URL values outright.
      for (const [id, value] of Object.entries(next)) {
        if (
          typeof value === "string" &&
          value.startsWith("data:") &&
          value.length > MAX_VALUE_BYTES
        ) {
          skippedImages += 1;
          continue;
        }
        payload[id] = value;
      }
      // Second pass: if still over the total budget, drop remaining
      // data-URL values (largest first) until we fit.
      const serialized = () => JSON.stringify(payload).length;
      total = serialized();
      if (total > MAX_TOTAL_BYTES) {
        const dataEntries = Object.entries(payload)
          .filter(([, v]) => typeof v === "string" && (v as string).startsWith("data:"))
          .sort((a, b) => (b[1] as string).length - (a[1] as string).length);
        for (const [id] of dataEntries) {
          delete payload[id];
          skippedImages += 1;
          if (serialized() <= MAX_TOTAL_BYTES) break;
        }
      }
      return { payload, skippedImages };
    },
    [],
  );

  const schedulePush = React.useCallback(
    (next: Overrides) => {
      if (!sessionPassword.current) return;
      if (pushTimer.current) clearTimeout(pushTimer.current);
      pushTimer.current = setTimeout(() => {
        const { payload, skippedImages } = buildPublishablePayload(next);
        const serialized = JSON.stringify(payload);
        if (serialized === lastPushedRef.current) return;
        saveOverridesServerFn({
          data: { password: sessionPassword.current, overrides: payload },
        })
          .then(() => {
            lastPushedRef.current = serialized;
            if (skippedImages > 0 && !warnedImageSkipRef.current) {
              warnedImageSkipRef.current = true;
              if (typeof window !== "undefined") {
                alert(
                  `Your text edits were published to all visitors, but ${skippedImages} image edit${skippedImages === 1 ? " was" : "s were"} too large to publish.\n\n` +
                    "Large images stay visible only in this browser. To publish them to everyone, replace them with smaller versions (the uploader already resizes, but very large originals can still exceed the limit).",
                );
              }
            }
          })
          .catch((err) => {
            console.warn("Could not save shared edits:", err);
            if (typeof window !== "undefined") {
              // Surface once per failure burst so the editor knows.
              alert(
                "Couldn't save changes to the shared site. They're kept in this browser for now \u2014 try again in a moment.\n\n" +
                  String(err?.message ?? err),
              );
            }
          });
      }, 1000);
    },
    [buildPublishablePayload],
  );

  const persistAll = React.useCallback(
    (next: Overrides) => {
      persist(next);
      schedulePush(next);
    },
    [persist, schedulePush],
  );

  const setOverride = React.useCallback(
    (id: string, value: unknown) => {
      setOverrides((prev) => {
        recordHistory(prev, id);
        const next = { ...prev, [id]: value };
        persistAll(next);
        return next;
      });
    },
    [persistAll, recordHistory],
  );

  const clearOverride = React.useCallback(
    (id: string) => {
      setOverrides((prev) => {
        if (!(id in prev)) return prev;
        recordHistory(prev, `clear:${id}`);
        const next = { ...prev };
        delete next[id];
        persistAll(next);
        return next;
      });
    },
    [persistAll, recordHistory],
  );

  const clearAll = React.useCallback(() => {
    setOverrides((prev) => {
      if (Object.keys(prev).length === 0) return prev;
      recordHistory(prev, null);
      try {
        localStorage.removeItem(STORAGE_EDITS);
      } catch {
        /* ignore */
      }
      schedulePush({});
      return {};
    });
  }, [recordHistory, schedulePush]);

  const enable = React.useCallback(async (password: string) => {
    if (!password) return false;
    try {
      const res = await verifyAdminServerFn({ data: { password } });
      if (!res?.ok) return false;
      sessionPassword.current = password;
      setEditMode(true);
      return true;
    } catch {
      // Server returns a generic "Unauthorized" on bad password. Don't
      // leak details to the UI; treat any failure as auth failure.
      return false;
    }
  }, []);

  const disable = React.useCallback(() => {
    sessionPassword.current = "";
    setEditMode(false);
  }, []);

  const exportJson = React.useCallback(
    () => JSON.stringify(overrides, null, 2),
    [overrides],
  );

  const importJson = React.useCallback(
    (json: string) => {
      try {
        const parsed = JSON.parse(json);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          return false;
        }
        setOverrides((prev) => {
          recordHistory(prev, null);
          persistAll(parsed as Overrides);
          return parsed as Overrides;
        });
        return true;
      } catch {
        return false;
      }
    },
    [persistAll, recordHistory],
  );

  const undo = React.useCallback(() => {
    const prev = undoStack.current.pop();
    if (prev === undefined) return;
    setOverrides((current) => {
      redoStack.current.push(current);
      if (redoStack.current.length > MAX_HISTORY) redoStack.current.shift();
      persistAll(prev);
      return prev;
    });
    lastChange.current = { id: null, time: 0 };
    setHistoryVersion((v) => v + 1);
  }, [persistAll]);

  const redo = React.useCallback(() => {
    const next = redoStack.current.pop();
    if (next === undefined) return;
    setOverrides((current) => {
      undoStack.current.push(current);
      if (undoStack.current.length > MAX_HISTORY) undoStack.current.shift();
      persistAll(next);
      return next;
    });
    lastChange.current = { id: null, time: 0 };
    setHistoryVersion((v) => v + 1);
  }, [persistAll]);

  // Reset history when the user logs out — feels less surprising and keeps
  // memory free.
  React.useEffect(() => {
    if (!editMode) {
      undoStack.current = [];
      redoStack.current = [];
      lastChange.current = { id: null, time: 0 };
      setHistoryVersion((v) => v + 1);
    }
  }, [editMode]);

  // historyVersion is intentionally read so canUndo/canRedo re-evaluate when
  // the stacks mutate.
  void historyVersion;
  const canUndo = undoStack.current.length > 0;
  const canRedo = redoStack.current.length > 0;

  const value: AdminContextValue = {
    editMode,
    ready,
    enable,
    disable,
    overrides,
    setOverride,
    clearOverride,
    clearAll,
    exportJson,
    importJson,
    undo,
    redo,
    canUndo,
    canRedo,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminContextValue {
  const ctx = React.useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminProvider>");
  return ctx;
}

/**
 * Returns [value, setValue] for a given content id.
 * Falls back to `defaultValue` when no override exists (and during SSR /
 * first hydration so server and client markup stay identical).
 */
export function useOverride<T>(id: string, defaultValue: T): [T, (value: T) => void] {
  const { overrides, setOverride, ready } = useAdmin();
  const has = ready && Object.prototype.hasOwnProperty.call(overrides, id);
  const value = has ? (overrides[id] as T) : defaultValue;
  const set = React.useCallback(
    (v: T) => setOverride(id, v),
    [id, setOverride],
  );
  return [value, set];
}
