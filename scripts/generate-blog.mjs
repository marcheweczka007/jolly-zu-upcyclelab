#!/usr/bin/env node
/**
 * Compiles content/blog/*.md → src/generated/blog-manifest.json
 * Runs automatically before dev and build (see package.json predev / build scripts).
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { buildBlogManifest, BLOG_MANIFEST_PATH } from "./lib/blog-build.mjs";

async function main() {
  const manifest = await buildBlogManifest();
  await mkdir(dirname(BLOG_MANIFEST_PATH), { recursive: true });
  await writeFile(BLOG_MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`generate-blog: ${manifest.posts.length} post(s) → src/generated/blog-manifest.json`);
}

main().catch((err) => {
  console.error("generate-blog:", err.message);
  process.exit(1);
});
