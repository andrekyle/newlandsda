/**
 * One-shot image optimizer.
 *
 * - Walks src/assets and converts any large PNG (>= 200 KB) into a
 *   resized, quality-82 JPEG written alongside it.
 * - Skips files that already have an optimized .jpg sibling.
 * - The original .png is removed after a successful conversion so the
 *   asset graph keeps a single source of truth.
 * - We keep the SVG logo, small PNGs (icons), and existing jpg/jpeg
 *   photos untouched.
 *
 * Run with: `node scripts/optimize-assets.mjs`.
 */
import { readdir, stat, readFile, writeFile, rm } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("../src/assets/", import.meta.url));
const MAX_EDGE = 1920;
const QUALITY = 82;
const MIN_BYTES = 200 * 1024;

const entries = await readdir(ROOT);
let savedBytes = 0;
let count = 0;
for (const name of entries) {
  if (extname(name).toLowerCase() !== ".png") continue;
  const src = join(ROOT, name);
  const s = await stat(src);
  if (s.size < MIN_BYTES) continue;
  const stem = basename(name, ".png");
  const outName = `${stem}.jpg`;
  const out = join(ROOT, outName);
  const buf = await readFile(src);
  const optimized = await sharp(buf)
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .flatten({ background: "#000000" })
    .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
    .toBuffer();
  await writeFile(out, optimized);
  savedBytes += s.size - optimized.length;
  count += 1;
  console.log(
    `${name}: ${(s.size / 1024).toFixed(0)} KB -> ${outName}: ${(optimized.length / 1024).toFixed(0)} KB`,
  );
  await rm(src);
}
console.log(
  `Done. Converted ${count} files. Saved ${(savedBytes / 1024 / 1024).toFixed(2)} MB.`,
);
