import * as React from "react";
import { Upload, RotateCcw } from "lucide-react";
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
  const { editMode, clearOverride } = useAdmin();
  const [src, setSrc] = useOverride<string>(id, defaultSrc);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onFile = (file?: File | null) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("Image is larger than 10 MB \u2014 please pick a smaller file.");
      return;
    }
    // Downscale via canvas so the resulting data URL fits in localStorage
    // (~5 MB quota). Without this, large originals appear to save but get
    // dropped on the next page load.
    const MAX_EDGE = 1600;
    const QUALITY = 0.85;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      if (!dataUrl) return;
      const img = new Image();
      img.onload = () => {
        let { width: w, height: h } = img;
        const scale = Math.min(1, MAX_EDGE / Math.max(w, h));
        w = Math.round(w * scale);
        h = Math.round(h * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setSrc(dataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const isPng = file.type === "image/png";
        // Keep PNG only for small transparent assets (logos); compress to JPEG
        // otherwise to stay under the storage quota.
        const out =
          isPng && file.size < 200 * 1024
            ? canvas.toDataURL("image/png")
            : canvas.toDataURL("image/jpeg", QUALITY);
        setSrc(out);
      };
      img.onerror = () => setSrc(dataUrl);
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
        loading={loading}
        // @ts-expect-error: fetchPriority is a valid HTML attribute
        fetchPriority={fetchPriority}
      />
    );
  }

  const wrapperHasOwnPosition = /\b(absolute|fixed|sticky)\b/.test(wrapperClassName ?? "");
  const positionClass = wrapperHasOwnPosition ? "" : "relative";

  return (
    <span
      className={`${positionClass} inline-block group z-10 ${wrapperClassName ?? ""}`}
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
        loading={loading}
        // @ts-expect-error: fetchPriority is a valid HTML attribute
        fetchPriority={fetchPriority}
      />
      <span className="pointer-events-none absolute inset-0 ring-1 ring-blue-500/80 ring-offset-0" />
      <span className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 z-20">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-3 py-2 text-xs font-semibold rounded-none shadow-lg"
        >
          <Upload className="h-4 w-4" /> Replace image
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
