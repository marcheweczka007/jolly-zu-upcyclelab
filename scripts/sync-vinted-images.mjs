#!/usr/bin/env node
/**
 * Sync product gallery images from a Vinted listing into Stripe.
 *
 * Usage: npm run sync:vinted-images
 * Requires STRIPE_SECRET_KEY in .env
 */
import { confirm, input, select } from "@inquirer/prompts";
import Stripe from "stripe";
import { loadEnv } from "./lib/load-env.mjs";
import { fetchVintedListingHtml, scrapeVintedImages } from "./lib/vinted-scraper.mjs";

loadEnv();

function skuLabel(product) {
  const listingId = product.metadata?.listing_id?.trim();
  if (listingId) return listingId;
  return product.id;
}

function truncate(text, max = 60) {
  const t = (text ?? "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

async function listProducts(stripe) {
  const products = [];
  for await (const product of stripe.products.list({ limit: 100 })) {
    products.push(product);
  }
  return products.sort((a, b) => a.name.localeCompare(b.name));
}

async function main() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    console.error("Missing STRIPE_SECRET_KEY in .env");
    process.exit(1);
  }

  const stripe = new Stripe(secret);

  console.log("\nFetching Stripe products…\n");

  const products = await listProducts(stripe);

  if (products.length === 0) {
    console.log("No products found in Stripe.");
    process.exit(0);
  }

  const productId = await select({
    message: "Choose a Stripe product",
    pageSize: 12,
    choices: products.map((p) => ({
      name: `[${skuLabel(p)}] ${truncate(p.name, 55)}`,
      value: p.id,
      description: p.description ? truncate(p.description, 90) : undefined,
    })),
  });

  const product = products.find((p) => p.id === productId);
  if (!product) {
    console.error("Product not found.");
    process.exit(1);
  }

  console.log(`\nSelected: ${product.name} (${product.id})`);
  console.log(`SKU / listing_id: ${skuLabel(product)}\n`);

  const vintedUrl = await input({
    message: "Vinted listing URL",
    validate: (value) =>
      value.includes("vinted.") ? true : "Enter a valid Vinted item URL",
  });

  console.log("\nFetching Vinted page…");
  const html = await fetchVintedListingHtml(vintedUrl);
  const images = scrapeVintedImages(html);

  if (images.length === 0) {
    console.error("No listing images found. Check the URL or try again later.");
    process.exit(1);
  }

  console.log(`\nFound ${images.length} image(s):\n`);
  images.forEach((url, i) => console.log(`  ${i + 1}. ${url}`));

  const shouldUpdate = await confirm({
    message: `Update Stripe with ${images.length} image URL(s)?`,
    default: true,
  });

  if (!shouldUpdate) {
    console.log("Cancelled.");
    process.exit(0);
  }

  const updated = await stripe.products.update(product.id, { images });

  console.log(`\n✓ Updated ${updated.name}`);
  console.log(`  ${updated.images.length} image URL(s) saved to Stripe.`);
  console.log("  Refresh the shop product page to see the gallery.\n");
}

main().catch((err) => {
  if (err instanceof Error && err.name === "ExitPromptError") {
    console.log("\nCancelled.");
    process.exit(0);
  }
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
