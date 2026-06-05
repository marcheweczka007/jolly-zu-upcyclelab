#!/usr/bin/env node
/**
 * Copy a shop hero image to public/og-default.webp for social previews.
 */
import { copyFile, readFile } from "node:fs/promises";
import { join } from "node:path";

const manifestPath = join(process.cwd(), "public/shop-images/manifest.json");

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const productId = Object.keys(manifest)[0];
  if (!productId) {
    console.warn("prepare-seo-assets: no shop images in manifest, skipping og-default.webp");
    return;
  }

  const src = join(process.cwd(), "public/shop-images", productId, "01.webp");
  const dest = join(process.cwd(), "public/og-default.webp");
  await copyFile(src, dest);
  console.log(`prepare-seo-assets: ${dest} ← ${productId}/01.webp`);
}

main().catch((err) => {
  console.error("prepare-seo-assets:", err.message);
  process.exit(1);
});
