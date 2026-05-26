import * as React from "react";
import {
  Lock,
  Unlock,
  LogOut,
  Settings,
  X,
  Download,
  Upload,
  Trash2,
  Undo2,
  Redo2,
} from "lucide-react";
import { useAdmin } from "@/lib/admin";

type Props = { className?: string };

/**
 * Header button that opens a password gate. Once unlocked, the same button
 * opens an admin menu (exit, export/import edits, reset).
 *
 * The password is verified on the server (`ADMIN_PASSWORD` env var). It is
 * never stored or compared on the client.
 */
export function AdminToggle({ className }: Props) {
  const {
    editMode,
    enable,
    disable,
    clearAll,
    overrides,
    exportJson,
    importJson,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useAdmin();

  const [open, setOpen] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [importMsg, setImportMsg] = React.useState("");

  const importInputRef = React.useRef<HTMLInputElement>(null);

  function onButtonClick() {
    if (editMode) {
      setOpen(true);
      return;
    }
    setPassword("");
    setError("");
    setOpen(true);
  }

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const ok = await enable(password);
      if (ok) {
        setOpen(false);
        setPassword("");
        setError("");
      } else {
        setError("Incorrect password.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function doExit() {
    disable();
    setOpen(false);
  }

  function downloadEdits() {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newlandsda-edits-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function onImportFile(file?: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      if (importJson(reader.result)) {
        setImportMsg("Edits imported.");
      } else {
        setImportMsg("Could not import that file.");
      }
    };
    reader.readAsText(file);
  }

  // Keyboard shortcuts: Ctrl/Cmd+Z = undo, Ctrl/Cmd+Shift+Z (or Ctrl+Y) = redo.
  // Only active while edit mode is on.
  React.useEffect(() => {
    if (!editMode) return;
    function onKey(e: KeyboardEvent) {
      const meta = e.ctrlKey || e.metaKey;
      if (!meta) return;
      const key = e.key.toLowerCase();
      if (key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((key === "z" && e.shiftKey) || key === "y") {
        e.preventDefault();
        redo();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editMode, undo, redo]);

  const editCount = Object.keys(overrides).length;

  return (
    <>
      <button
        type="button"
        onClick={onButtonClick}
        aria-label={editMode ? "Admin menu" : "Enter edit mode"}
        title={editMode ? "Edit mode is ON" : "Enter edit mode"}
        className={className}
      >
        {editMode ? (
          <Unlock className="h-4 w-4 text-amber-400" />
        ) : (
          <Lock className="h-4 w-4" />
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-card text-card-foreground border border-border w-full max-w-md p-6 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground p-1"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {!editMode ? (
              <>
                <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" /> Enter edit mode
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Provide the admin password to edit text and images on the
                  site. Edits are saved in this browser only.
                </p>
                <form onSubmit={submitPassword} className="space-y-3">
                  <input
                    type="password"
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-background border border-input px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  {error && (
                    <p className="text-sm text-red-500" role="alert">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting || password.length === 0}
                    className="w-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    {submitting ? "Checking\u2026" : "Unlock"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-amber-500" /> Admin menu
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {editCount} edit{editCount === 1 ? "" : "s"} saved in this
                  browser. Hover any text/image on the site to change it.
                </p>

                <div className="space-y-2 mb-4">
                  <button
                    onClick={doExit}
                    className="w-full flex items-center gap-2 border border-border px-3 py-2 text-sm hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4" /> Exit edit mode
                  </button>
                  <button
                    onClick={downloadEdits}
                    disabled={editCount === 0}
                    className="w-full flex items-center gap-2 border border-border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
                  >
                    <Download className="h-4 w-4" /> Export edits (JSON)
                  </button>
                  <button
                    onClick={() => importInputRef.current?.click()}
                    className="w-full flex items-center gap-2 border border-border px-3 py-2 text-sm hover:bg-muted"
                  >
                    <Upload className="h-4 w-4" /> Import edits
                  </button>
                  <input
                    ref={importInputRef}
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={(e) => {
                      onImportFile(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "Reset all edits and restore original content?",
                        )
                      )
                        clearAll();
                    }}
                    disabled={editCount === 0}
                    className="w-full flex items-center gap-2 border border-border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50 text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" /> Reset all edits
                  </button>
                </div>

                {importMsg && (
                  <p className="text-xs text-muted-foreground mb-2">{importMsg}</p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {editMode && (
        <div className="fixed bottom-4 right-4 z-90 flex items-center gap-1 bg-amber-500 text-black shadow-lg pl-3 pr-1 py-1">
          <span className="flex items-center gap-2 text-xs font-semibold pr-2 border-r border-black/20">
            <Unlock className="h-3.5 w-3.5" /> Edit mode
          </span>
          <button
            type="button"
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
            className="p-1.5 hover:bg-black/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
            aria-label="Redo"
            className="p-1.5 hover:bg-black/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
}
