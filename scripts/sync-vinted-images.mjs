#!/usr/bin/env node
/**
 * Sync product gallery: scrape Vinted → save images locally → push URLs to Stripe.
 *
 * Images are stored in public/shop-images/{stripe_product_id}/ (e.g. prod_UeDMxD9YW7XooH).
 *
 * Usage: npm run sync:vinted-images
 * Requires STRIPE_SECRET_KEY and SITE_URL in .env (for Stripe image URLs)
 */
import { confirm, input } from "@inquirer/prompts";
import Stripe from "stripe";
import { loadEnv } from "./lib/load-env.mjs";
import {
  downloadProductImages,
  localImageUrlsForProduct,
  productImageDir,
  resolveSiteUrl,
  SHOP_IMAGES_PUBLIC_DIR,
} from "./lib/product-images.mjs";
import { selectStripeProduct, skuLabel } from "./lib/stripe-products.mjs";
import { fetchVintedListingHtml, scrapeVintedImages } from "./lib/vinted-scraper.mjs";

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

  console.log(`\nSelected: ${product.name} (${product.id})`);
  console.log(`SKU / listing_id: ${skuLabel(product)}`);
  console.log(`Local folder: ${SHOP_IMAGES_PUBLIC_DIR}/${product.id}/`);
  console.log(`Public URLs base: ${siteUrl}\n`);

  const vintedUrl = await input({
    message: "Vinted listing URL",
    validate: (value) =>
      value.includes("vinted.") ? true : "Enter a valid Vinted item URL",
  });

  console.log("\nFetching Vinted page…");
  const html = await fetchVintedListingHtml(vintedUrl);
  const vintedUrls = scrapeVintedImages(html);

  if (vintedUrls.length === 0) {
    console.error("No listing images found. Check the URL or try again later.");
    process.exit(1);
  }

  console.log(`\nFound ${vintedUrls.length} image(s) on Vinted.`);

  const shouldDownload = await confirm({
    message: `Download to ${productImageDir(product.id)}?`,
    default: true,
  });

  if (!shouldDownload) {
    console.log("Cancelled.");
    process.exit(0);
  }

  console.log("\nDownloading…");
  await downloadProductImages(product.id, vintedUrls);

  const imageUrls = await localImageUrlsForProduct(product.id, siteUrl);
  console.log(`\nLocal gallery (${imageUrls.length} file(s)):\n`);
  imageUrls.forEach((url, i) => console.log(`  ${i + 1}. ${url}`));

  const shouldUpdate = await confirm({
    message: `Update Stripe with ${imageUrls.length} local image URL(s)?`,
    default: true,
  });

  if (!shouldUpdate) {
    console.log("\nFiles saved locally. Run npm run sync:local-images to update Stripe later.");
    process.exit(0);
  }

  const updated = await stripe.products.update(product.id, { images: imageUrls });

  console.log(`\n✓ Updated ${updated.name}`);
  console.log(`  ${updated.images.length} image URL(s) saved to Stripe.`);
  console.log("  Commit public/shop-images/ and deploy so Stripe can reach the images.");
  console.log("  Refresh the shop product page after deploy.\n");
}

main().catch((err) => {
  if (err instanceof Error && err.name === "ExitPromptError") {
    console.log("\nCancelled.");
    process.exit(0);
  }
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
