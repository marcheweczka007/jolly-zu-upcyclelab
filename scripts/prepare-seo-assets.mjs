#!/usr/bin/env node
/**
 * Pre-build SEO/AI assets: og-default.webp, llms.txt, robots.txt → public/
 */
import { copyFile, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fetchCatalogProducts } from "./lib/fetch-catalog.mjs";
import { buildLlmsFullTxt, buildLlmsTxt } from "./lib/llms-txt.mjs";
import { buildRobotsTxt } from "./lib/robots-txt.mjs";
import { resolveSiteUrl } from "./lib/seo-meta.mjs";

const publicDir = join(process.cwd(), "public");
const manifestPath = join(publicDir, "shop-images/manifest.json");

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const productId = Object.keys(manifest)[0];
  if (!productId) {
    console.warn("prepare-seo-assets: no shop images in manifest, skipping og-default.webp");
  } else {
    const src = join(publicDir, "shop-images", productId, "01.webp");
    const dest = join(publicDir, "og-default.webp");
    await copyFile(src, dest);
    console.log(`prepare-seo-assets: ${dest} ← ${productId}/01.webp`);
  }

  const siteUrl = resolveSiteUrl();
  const products = await fetchCatalogProducts();
  await writeFile(join(publicDir, "llms.txt"), buildLlmsTxt(siteUrl, products), "utf8");
  await writeFile(join(publicDir, "llms-full.txt"), buildLlmsFullTxt(siteUrl, products), "utf8");
  await writeFile(join(publicDir, "robots.txt"), buildRobotsTxt(siteUrl), "utf8");
  console.log("prepare-seo-assets: llms.txt, llms-full.txt, robots.txt");
}

main().catch((err) => {
  console.error("prepare-seo-assets:", err.message);
  process.exit(1);
});
