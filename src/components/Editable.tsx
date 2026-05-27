import * as React from "react";
import { Upload, RotateCcw, Plus, Trash2 } from "lucide-react";
import { useAdmin, useOverride } from "@/lib/admin";

/* ------------------------------------------------------------------ */
/* EditableText                                                        */
/* ------------------------------------------------------------------ */

type EditableTextProps = {
  /** Stable id used to persist the edit. */
  id: string;
  /** Original text — shown when no override has been saved. */
  defaultValue: string;
  /** Wrapper tag in non-edit mode. Defaults to `span`. */
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "div" | "dd" | "dt" | "li";
  /** Use a textarea editor instead of a single-line input. */
  multiline?: boolean;
  className?: string;
};

export function EditableText({
  id,
  defaultValue,
  as: Tag = "span",
  multiline = false,
  className,
}: EditableTextProps) {
  const { editMode, clearOverride } = useAdmin();
  const [value, setValue] = useOverride<string>(id, defaultValue);

  if (!editMode) {
    return <Tag className={className}>{value}</Tag>;
  }

  const editorBase =
    "w-full bg-black/90 text-white/95 border border-white/15 hover:border-white/25 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20 rounded-none px-2 py-1";

  return (
    <span className="relative inline-block w-full group align-baseline">
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={Math.max(2, value.split("\n").length)}
          className={`${className ?? ""} ${editorBase} resize-y`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`${className ?? ""} ${editorBase}`}
        />
      )}
      {value !== defaultValue && (
        <button
          type="button"
          onClick={() => clearOverride(id)}
          title="Reset to original"
          className="absolute -top-2 -right-2 bg-black/90 border border-white/20 text-white/80 hover:text-white hover:border-white/40 p-1 rounded-none opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
        >
          <RotateCcw className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* EditableImage                                                       */
/* ------------------------------------------------------------------ */

type EditableImageProps = {
  id: string;
  defaultSrc: string;
  alt: string;
  /** Classes applied to the <img> element. */
  className?: string;
  /** Classes applied to the wrapper (only matters in edit mode). */
  wrapperClassName?: string;
  width?: number | string;
  height?: number | string;
  fetchPriority?: "high" | "low" | "auto";
  loading?: "eager" | "lazy";
};

export function EditableImage({
  id,
  defaultSrc,
  alt,
  className,
  wrapperClassName,
  width,
  height,
  fetchPriority,
  loading,
}: EditableImageProps) {
  const { editMode, clearOverride, uploadImage } = useAdmin();
  const [src, setSrc] = useOverride<string>(id, defaultSrc);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);

  // Persist the chosen image. Tries server-side upload first (commits the
  // file to the repo's public/uploads/ via GitHub API → returns a URL we
  // can store in overrides instead of bloating KV with base64). Falls back
  // to embedding the data URL if upload isn't configured / fails.
  const persistImage = React.useCallback(
    async (dataUrl: string) => {
      setUploading(true);
      try {
        const url = await uploadImage(id, dataUrl);
        setSrc(url ?? dataUrl);
      } finally {
        setUploading(false);
      }
    },
    [id, setSrc, uploadImage],
  );

  const onFile = (file?: File | null) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("Image is larger than 10 MB \u2014 please pick a smaller file.");
      return;
    }
    // Downscale + recompress via canvas so the resulting data URL:
    //   1. Fits in localStorage (~5 MB browser quota).
    //   2. Fits under the shared-site publish per-entry cap (~200 KB) so
    //      the picture is actually pushed to every visitor's browser, not
    //      just the editor's. Anything over that cap is stripped from the
    //      shared payload in admin.tsx and stays local-only.
    //
    // We try a sequence of (max-edge, quality) presets and pick the first
    // result under TARGET_BYTES. If nothing fits, we use the smallest
    // produced output.
    const TARGET_BYTES = 180 * 1024;
    const PRESETS: Array<{ maxEdge: number; quality: number }> = [
      { maxEdge: 1600, quality: 0.85 },
      { maxEdge: 1400, quality: 0.78 },
      { maxEdge: 1200, quality: 0.7 },
      { maxEdge: 1000, quality: 0.62 },
      { maxEdge: 900, quality: 0.55 },
      { maxEdge: 800, quality: 0.5 },
      { maxEdge: 700, quality: 0.45 },
    ];
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      if (!dataUrl) return;
      const img = new Image();
      img.onload = () => {
        const isPng = file.type === "image/png";
        // Only keep PNG output for tiny transparent assets (logos / icons).
        // Everything else gets recompressed to JPEG for size.
        if (isPng && file.size < 120 * 1024) {
          void persistImage(dataUrl);
          return;
        }
        const encode = (maxEdge: number, quality: number) => {
          let { width: w, height: h } = img;
          const scale = Math.min(1, maxEdge / Math.max(w, h));
          w = Math.max(1, Math.round(w * scale));
          h = Math.max(1, Math.round(h * scale));
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) return null;
          ctx.drawImage(img, 0, 0, w, h);
          return canvas.toDataURL("image/jpeg", quality);
        };
        let best: string | null = null;
        for (const { maxEdge, quality } of PRESETS) {
          const out = encode(maxEdge, quality);
          if (!out) continue;
          if (!best || out.length < best.length) best = out;
          if (out.length <= TARGET_BYTES) {
            void persistImage(out);
            return;
          }
        }
        void persistImage(best ?? dataUrl);
      };
      img.onerror = () => void persistImage(dataUrl);
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  if (!editMode) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loading ?? "lazy"}
        decoding="async"
        // @ts-expect-error: fetchPriority is a valid HTML attribute
        fetchPriority={fetchPriority}
      />
    );
  }

  const wrapperHasOwnPosition = /\b(absolute|fixed|sticky)\b/.test(wrapperClassName ?? "");
  const positionClass = wrapperHasOwnPosition ? "" : "relative";
  // If the consumer supplied their own display utility (e.g. `block`,
  // `flex`, `grid`), don't force `inline-block` — it would beat their
  // class and collapse the upload control to the image's natural size
  // inside an absolutely-positioned banner container.
  const wrapperHasOwnDisplay = /\b(block|flex|grid|inline-flex|inline-grid|hidden)\b/.test(wrapperClassName ?? "");
  const displayClass = wrapperHasOwnDisplay ? "" : "inline-block";

  return (
    <span
      className={`${positionClass} ${displayClass} group z-10 ${wrapperClassName ?? ""}`}
      // When the editable image is nested inside an <a>/Link (e.g. the brand
      // logo), clicks would otherwise trigger navigation in two ways:
      //   1. TanStack Router's onClick on the anchor → push state.
      //   2. The browser's default click action on the anchor → full nav.
      // stopPropagation kills (1). preventDefault kills (2). But the
      // programmatic click we dispatch on the hidden <input type="file"> also
      // bubbles through here, and its default action is opening the file
      // picker — so we must NOT preventDefault on that one.
      onClick={(e) => {
        e.stopPropagation();
        if (!(e.target instanceof HTMLInputElement)) {
          e.preventDefault();
        }
      }}
    >
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loading ?? "lazy"}
        decoding="async"
        // @ts-expect-error: fetchPriority is a valid HTML attribute
        fetchPriority={fetchPriority}
      />
      <span className="pointer-events-none absolute inset-0 ring-1 ring-blue-500/80 ring-offset-0" />
      <span className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 z-20">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 disabled:opacity-60 disabled:cursor-wait text-white px-3 py-2 text-xs font-semibold rounded-none shadow-lg"
        >
          <Upload className="h-4 w-4" /> {uploading ? "Uploading\u2026" : "Replace image"}
        </button>
        {src !== defaultSrc && (
          <button
            type="button"
            onClick={() => clearOverride(id)}
            className="inline-flex items-center gap-2 bg-background border border-border text-foreground px-3 py-2 text-xs font-semibold rounded-none shadow-lg"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        )}
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* EditableList                                                        */
/*                                                                     */
/* Stores an arbitrary array of items as a single override entry.      */
/* In view mode children receive the read-only item via renderItem.    */
/* In edit mode each item gets a 'Remove' control and the list gets an */
/* 'Add' button. Items themselves are edited inline by the consumer    */
/* (use <ListField>, <ListTextarea>, <ListImage> helpers below).        */
/* ------------------------------------------------------------------ */

export type ListHelpers<T> = {
  update: (patch: Partial<T>) => void;
  remove: () => void;
  editMode: boolean;
  index: number;
};

type EditableListProps<T> = {
  /** Stable id used to persist the list as a single overrides entry. */
  id: string;
  /** Initial / fallback array used when no override has been saved. */
  defaultValue: T[];
  /** Factory for new items appended via the Add button. */
  newItem: () => T;
  /** Label shown on the Add button (e.g. "Add team member"). */
  addLabel: string;
  /** Wrapper class around all items. */
  className?: string;
  /** Class around each item. */
  itemClassName?: string;
  /** Render-prop for each item. */
  renderItem: (item: T, helpers: ListHelpers<T>) => React.ReactNode;
};

export function EditableList<T extends Record<string, unknown>>({
  id,
  defaultValue,
  newItem,
  addLabel,
  className,
  itemClassName,
  renderItem,
}: EditableListProps<T>) {
  const { editMode } = useAdmin();
  const [items, setItems] = useOverride<T[]>(id, defaultValue);

  const update = (idx: number, patch: Partial<T>) => {
    const next = items.slice();
    next[idx] = { ...next[idx], ...patch };
    setItems(next);
  };
  const remove = (idx: number) => {
    const next = items.slice();
    next.splice(idx, 1);
    setItems(next);
  };
  const add = () => {
    setItems([...items, newItem()]);
  };

  return (
    <div className={className}>
      {items.map((item, idx) => (
        <div key={idx} className={`relative ${itemClassName ?? ""}`}>
          {editMode && (
            <button
              type="button"
              onClick={() => remove(idx)}
              title="Remove"
              className="absolute -top-2 -right-2 z-30 inline-flex items-center gap-1 bg-black/90 border border-white/20 text-white/80 hover:text-white hover:border-white/40 px-2 py-1 text-[10px] font-semibold rounded-none"
            >
              <Trash2 className="h-3 w-3" /> Remove
            </button>
          )}
          {renderItem(item, {
            update: (patch) => update(idx, patch),
            remove: () => remove(idx),
            editMode,
            index: idx,
          })}
        </div>
      ))}
      {editMode && (
        <button
          type="button"
          onClick={add}
          className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 text-xs font-semibold rounded-none hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> {addLabel}
        </button>
      )}
    </div>
  );
}

/* Inline single-line text field used inside renderItem. */
export function ListField({
  value,
  onChange,
  editMode,
  className,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  editMode: boolean;
  className?: string;
  placeholder?: string;
}) {
  if (!editMode) return <span className={className}>{value}</span>;
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${className ?? ""} w-full bg-black/90 text-white/95 border border-white/15 hover:border-white/25 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20 rounded-none px-2 py-1`}
    />
  );
}

/* Inline multi-line text field. */
export function ListTextarea({
  value,
  onChange,
  editMode,
  className,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  editMode: boolean;
  className?: string;
  placeholder?: string;
}) {
  if (!editMode) return <span className={className}>{value}</span>;
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={Math.max(2, value.split("\n").length)}
      className={`${className ?? ""} w-full bg-black/90 text-white/95 border border-white/15 hover:border-white/25 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/20 rounded-none px-2 py-1 resize-y`}
    />
  );
}

/* Inline image picker used inside renderItem. Uses the same canvas
   recompression + GitHub upload pipeline as <EditableImage>. */
export function ListImage({
  value,
  onChange,
  editMode,
  alt,
  className,
  fallback,
  uploadId,
}: {
  value: string;
  onChange: (v: string) => void;
  editMode: boolean;
  alt: string;
  className?: string;
  /** Shown when value is empty. */
  fallback?: string;
  /** Override id used for the GitHub upload filename slug. */
  uploadId: string;
}) {
  const { uploadImage } = useAdmin();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const src = value || fallback || "";

  const persist = async (dataUrl: string) => {
    setUploading(true);
    try {
      const url = await uploadImage(uploadId, dataUrl);
      onChange(url ?? dataUrl);
    } finally {
      setUploading(false);
    }
  };

  const onFile = (file?: File | null) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("Image is larger than 10 MB \u2014 please pick a smaller file.");
      return;
    }
    const TARGET_BYTES = 180 * 1024;
    const PRESETS: Array<{ maxEdge: number; quality: number }> = [
      { maxEdge: 1200, quality: 0.82 },
      { maxEdge: 1000, quality: 0.72 },
      { maxEdge: 800, quality: 0.62 },
      { maxEdge: 700, quality: 0.5 },
      { maxEdge: 600, quality: 0.45 },
    ];
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      if (!dataUrl) return;
      const img = new Image();
      img.onload = () => {
        let best: string | null = null;
        for (const { maxEdge, quality } of PRESETS) {
          const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          ctx.drawImage(img, 0, 0, w, h);
          const out = canvas.toDataURL("image/jpeg", quality);
          if (!best || out.length < best.length) best = out;
          if (out.length <= TARGET_BYTES) {
            void persist(out);
            return;
          }
        }
        void persist(best ?? dataUrl);
      };
      img.onerror = () => void persist(dataUrl);
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  if (!editMode) {
    if (!src) {
      return (
        <div
          className={`${className ?? ""} bg-muted flex items-center justify-center text-muted-foreground text-xs`}
          aria-hidden
        >
          No photo
        </div>
      );
    }
    return <img src={src} alt={alt} className={className} loading="lazy" decoding="async" />;
  }

  return (
    <div className={`${className ?? ""} relative bg-muted overflow-hidden`}>
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" decoding="async" />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
          No photo
        </div>
      )}
      <span className="pointer-events-none absolute inset-0 ring-1 ring-blue-500/80" />
      <span className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 bg-blue-500 hover:bg-blue-400 disabled:opacity-60 disabled:cursor-wait text-white px-2 py-1 text-[11px] font-semibold rounded-none shadow-lg"
        >
          <Upload className="h-3 w-3" /> {uploading ? "Uploading\u2026" : src ? "Replace" : "Upload"}
        </button>
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
