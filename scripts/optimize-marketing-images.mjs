#!/usr/bin/env node
/**
 * Resize and compress marketing images → WebP for faster page loads.
 * Source: src/assets/*.jpg → src/assets/*.webp
 * Also recompresses public/og-image.jpg in place.
 */
import { readdir, stat } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const ASSETS_DIR = join(ROOT, "src/assets");
const PUBLIC_OG = join(ROOT, "public/og-image.jpg");

/** @type {{ maxWidth: number; quality: number } | undefined} */
const OVERRIDES = {
  "hero-product.jpg": { maxWidth: 1200, quality: 82 },
  "collection-flatlay.jpg": { maxWidth: 1536, quality: 82 },
  "fabric-stack.jpg": { maxWidth: 1200, quality: 82 },
  "maker-portrait.jpg": { maxWidth: 1024, quality: 80 },
  "bags-flatlay.jpg": { maxWidth: 1200, quality: 82 },
};

const DEFAULTS = { maxWidth: 1600, quality: 82 };

async function optimizeJpegToWebp(inputPath, outputPath, options) {
  const { maxWidth, quality } = options;
  const image = sharp(inputPath).rotate();
  const meta = await image.metadata();
  const resize =
    meta.width && meta.width > maxWidth ? { width: maxWidth, withoutEnlargement: true } : undefined;

  await image.resize(resize).webp({ quality, effort: 4 }).toFile(outputPath);

  const [srcSize, outSize] = await Promise.all([stat(inputPath), stat(outputPath)]);
  const name = basename(inputPath);
  console.log(
    `optimize-images: ${name} → ${basename(outputPath)} (${formatKb(srcSize.size)} → ${formatKb(outSize.size)})`,
  );
}

async function optimizeOgImage() {
  try {
    await stat(PUBLIC_OG);
  } catch {
    console.warn("optimize-images: public/og-image.jpg not found, skipping");
    return;
  }

  const tmp = `${PUBLIC_OG}.tmp`;
  const image = sharp(PUBLIC_OG).rotate();
  const meta = await image.metadata();
  const maxWidth = 1734;
  const resize =
    meta.width && meta.width > maxWidth ? { width: maxWidth, withoutEnlargement: true } : undefined;

  await image.resize(resize).jpeg({ quality: 85, mozjpeg: true }).toFile(tmp);
  const { rename } = await import("node:fs/promises");
  await rename(tmp, PUBLIC_OG);

  const outSize = await stat(PUBLIC_OG);
  console.log(`optimize-images: og-image.jpg (${formatKb(outSize.size)})`);
}

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(0)} KB`;
}

async function main() {
  const entries = await readdir(ASSETS_DIR);
  const jpgs = entries.filter((name) => {
    const lower = name.toLowerCase();
    return lower.endsWith(".jpg") || lower.endsWith(".jpeg");
  });

  if (jpgs.length === 0) {
    console.log("optimize-images: no JPEGs in src/assets");
  }

  for (const name of jpgs) {
    if (name === "og-image.jpg") continue;
    const inputPath = join(ASSETS_DIR, name);
    const outputPath = join(ASSETS_DIR, `${basename(name, extname(name))}.webp`);
    const options = OVERRIDES[name] ?? DEFAULTS;
    await optimizeJpegToWebp(inputPath, outputPath, options);
  }

  await optimizeOgImage();
}

main().catch((err) => {
  console.error("optimize-images:", err.message);
  process.exit(1);
});
