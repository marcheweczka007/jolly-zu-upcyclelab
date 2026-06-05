#!/usr/bin/env node
/**
 * Regenerate shop manifest after adding images to public/shop-images/{prod_*}/.
 *
 * Usage: npm run sync:local-images
 */
import { generateShopImagesManifest } from "./generate-shop-images-manifest.mjs";
import { SHOP_IMAGES_PUBLIC_DIR } from "./lib/product-images.mjs";

async function main() {
  const { withImages, manifest } = await generateShopImagesManifest();

  if (withImages === 0) {
    console.error(
      `No product folders with images under ${SHOP_IMAGES_PUBLIC_DIR}/\n` +
        "Add files to public/shop-images/prod_…/ (e.g. 01.webp, 02.webp), then run again.",
    );
    process.exit(1);
  }

  console.log(`\n✓ Manifest updated: ${withImages} product(s) with local gallery\n`);
  for (const [id, urls] of Object.entries(manifest)) {
    console.log(`  ${id}: ${urls.length} image(s)`);
    urls.forEach((url, i) => console.log(`    ${i + 1}. ${url}`));
  }
  console.log("\nRestart netlify dev (or refresh) to see changes on /shop.\n");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
