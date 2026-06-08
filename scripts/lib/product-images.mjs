import { mkdir, readdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { resolveSiteUrl } from "./seo-meta.mjs";

export const SHOP_IMAGES_PUBLIC_DIR = "public/shop-images";

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export function productImageDir(productId) {
  return join(process.cwd(), SHOP_IMAGES_PUBLIC_DIR, productId);
}

export function publicImagePath(productId, filename) {
  return `/shop-images/${productId}/${filename}`;
}

export function absoluteImageUrl(siteUrl, productId, filename) {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}${publicImagePath(productId, filename)}`;
}

export { resolveSiteUrl };

export async function ensureProductImageDir(productId) {
  await mkdir(productImageDir(productId), { recursive: true });
}

function extensionFromUrl(url) {
  try {
    const ext = extname(new URL(url).pathname).toLowerCase();
    if (ALLOWED_EXT.has(ext)) return ext;
  } catch {
    // ignore
  }
  return ".webp";
}

function padIndex(index) {
  return String(index + 1).padStart(2, "0");
}

/**
 * Download remote URLs into public/shop-images/{productId}/01.webp …
 * @param {string} productId
 * @param {string[]} urls
 * @returns {Promise<string[]>} filenames written
 */
export async function downloadProductImages(productId, urls) {
  await ensureProductImageDir(productId);
  const written = [];

  for (let i = 0; i < urls.slice(0, 8).length; i++) {
    const url = urls[i];
    const filename = `${padIndex(i)}${extensionFromUrl(url)}`;
    const dest = join(productImageDir(productId), filename);

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      redirect: "follow",
    });

    if (!res.ok) {
      throw new Error(`Failed to download image ${i + 1} (${res.status}): ${url}`);
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    await writeFile(dest, buffer);
    written.push(filename);
    console.log(`  saved ${publicImagePath(productId, filename)}`);
  }

  return written;
}

/**
 * @param {string} productId
 * @returns {Promise<string[]>}
 */
export async function listLocalImageFiles(productId) {
  const dir = productImageDir(productId);
  try {
    const entries = await readdir(dir);
    return entries
      .filter((name) => ALLOWED_EXT.has(extname(name).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .slice(0, 8);
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") {
      return [];
    }
    throw err;
  }
}

/**
 * @param {string} productId
 * @param {string} [siteUrl]
 * @returns {Promise<string[]>}
 */
export async function localImageUrlsForProduct(productId, siteUrl = resolveSiteUrl()) {
  const files = await listLocalImageFiles(productId);
  return files.map((filename) => absoluteImageUrl(siteUrl, productId, filename));
}
