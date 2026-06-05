#!/usr/bin/env node
/**
 * Push images from public/shop-images/{stripe_product_id}/ to Stripe.
 * Use after manually adding files to the product folder.
 *
 * Usage: npm run sync:local-images
 */
import { confirm } from "@inquirer/prompts";
import Stripe from "stripe";
import { loadEnv } from "./lib/load-env.mjs";
import {
  listLocalImageFiles,
  localImageUrlsForProduct,
  productImageDir,
  resolveSiteUrl,
  SHOP_IMAGES_PUBLIC_DIR,
} from "./lib/product-images.mjs";
import { selectStripeProduct, skuLabel } from "./lib/stripe-products.mjs";

loadEnv();

async function main() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    console.error("Missing STRIPE_SECRET_KEY in .env");
    process.exit(1);
  }

  const stripe = new Stripe(secret);
  const siteUrl = resolveSiteUrl();

  console.log("\nFetching Stripe products…\n");

  const product = await selectStripeProduct(stripe);
  if (!product) {
    console.log("No products found in Stripe.");
    process.exit(0);
  }

  const dir = productImageDir(product.id);
  const files = await listLocalImageFiles(product.id);

  console.log(`\nSelected: ${product.name} (${product.id})`);
  console.log(`SKU / listing_id: ${skuLabel(product)}`);
  console.log(`Folder: ${dir}\n`);

  if (files.length === 0) {
    console.error(
      `No images in ${SHOP_IMAGES_PUBLIC_DIR}/${product.id}/\n` +
        "Add .jpg, .jpeg, .png, or .webp files (e.g. 01.jpg, 02.jpg), then run again.",
    );
    process.exit(1);
  }

  console.log(`Found ${files.length} local file(s):`);
  files.forEach((file, i) => console.log(`  ${i + 1}. ${file}`));

  const imageUrls = await localImageUrlsForProduct(product.id, siteUrl);
  console.log(`\nStripe URLs (SITE_URL=${siteUrl}):\n`);
  imageUrls.forEach((url, i) => console.log(`  ${i + 1}. ${url}`));

  const shouldUpdate = await confirm({
    message: `Update Stripe with these ${imageUrls.length} URL(s)?`,
    default: true,
  });

  if (!shouldUpdate) {
    console.log("Cancelled.");
    process.exit(0);
  }

  const updated = await stripe.products.update(product.id, { images: imageUrls });

  console.log(`\n✓ Updated ${updated.name}`);
  console.log(`  ${updated.images.length} image URL(s) saved to Stripe.\n`);
}

main().catch((err) => {
  if (err instanceof Error && err.name === "ExitPromptError") {
    console.log("\nCancelled.");
    process.exit(0);
  }
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
