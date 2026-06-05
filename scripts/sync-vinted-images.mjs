#!/usr/bin/env node
/**
 * Scrape Vinted → save images to public/shop-images/{stripe_product_id}/ → refresh manifest.
 * Gallery is served from the repo; Stripe images[] is not updated.
 *
 * Usage: npm run sync:vinted-images
 */
import { confirm, input } from "@inquirer/prompts";
import Stripe from "stripe";
import { generateShopImagesManifest } from "./generate-shop-images-manifest.mjs";
import { loadEnv } from "./lib/load-env.mjs";
import {
  downloadProductImages,
  productImageDir,
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

  console.log("\nFetching Stripe products…\n");

  const product = await selectStripeProduct(stripe);
  if (!product) {
    console.log("No products found in Stripe.");
    process.exit(0);
  }

  console.log(`\nSelected: ${product.name} (${product.id})`);
  console.log(`SKU / listing_id: ${skuLabel(product)}`);
  console.log(`Local folder: ${SHOP_IMAGES_PUBLIC_DIR}/${product.id}/\n`);

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

  const { manifest } = await generateShopImagesManifest();
  const urls = manifest[product.id] ?? [];

  console.log(`\n✓ Saved ${urls.length} image(s) for ${product.id}`);
  urls.forEach((url, i) => console.log(`  ${i + 1}. ${url}`));
  console.log("\nRestart netlify dev (or refresh) to see the gallery on /shop.\n");
}

main().catch((err) => {
  if (err instanceof Error && err.name === "ExitPromptError") {
    console.log("\nCancelled.");
    process.exit(0);
  }
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
