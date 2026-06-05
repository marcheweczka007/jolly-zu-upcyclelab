import { localGalleryUrls } from "./local-product-images.mjs";

/**
 * Stripe Product catalog → shop listings.
 *
 * Product (Dashboard):
 *   name, description, images[] (fallback hero only — gallery from public/shop-images/)
 *
 * Metadata (optional unless noted):
 *   listing_id       — URL slug (defaults to Stripe product id)
 *   tagline
 *   materials        — pipe-separated, e.g. "Denim offcuts|Vintage cotton"
 *   dimensions
 *   availability     — available | preorder | sold_out (manual override)
 *   preorder_note
 *   image_alt
 *   sort_order       — number, lower first
 *   stock_total      — batch size, e.g. 5 (omit for one-of-a-kind)
 *   stock_available  — remaining units (defaults to stock_total; webhook decrements)
 */

function sanitizeImageUrl(url) {
  if (!url?.trim()) return "";
  return url.trim().replace(/\\+$/, "");
}

function parsePositiveInt(raw) {
  if (raw == null || String(raw).trim() === "") return null;
  const n = parseInt(String(raw).trim(), 10);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** @returns {{ stockTotal: number | null, stockAvailable: number | null, isBatch: boolean }} */
export function parseStock(metadata, productActive, priceActive) {
  const stockTotal = parsePositiveInt(metadata?.stock_total);
  if (stockTotal == null) {
    return { stockTotal: null, stockAvailable: null, isBatch: false };
  }

  const parsedAvailable = parsePositiveInt(metadata?.stock_available);
  let stockAvailable = parsedAvailable ?? stockTotal;
  stockAvailable = Math.min(stockAvailable, stockTotal);

  if (!productActive || !priceActive) {
    stockAvailable = 0;
  }

  return { stockTotal, stockAvailable, isBatch: true };
}

export function parseMaterials(raw) {
  if (!raw?.trim()) return [];
  return raw
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseAvailability(metadata, productActive, priceActive, stock) {
  if (!productActive || !priceActive) return "sold_out";
  if (stock.isBatch && stock.stockAvailable <= 0) return "sold_out";

  const raw = metadata?.availability?.toLowerCase().replace(/\s+/g, "_");
  if (raw === "preorder" || raw === "pre_order") return "preorder";
  if (raw === "sold_out" || raw === "soldout") return "sold_out";
  return "available";
}

export function toListing(product, price) {
  const metadata = product.metadata ?? {};
  const id = metadata.listing_id?.trim() || product.id;
  const stripeImages = (product.images ?? [])
    .map(sanitizeImageUrl)
    .filter(Boolean)
    .slice(0, 8);
  const localImages = localGalleryUrls(product.id);
  const images = localImages ?? stripeImages;
  const image = images[0] ?? "";
  const pricePence =
    price?.unit_amount != null && price.currency === "gbp" ? price.unit_amount : 0;
  const stock = parseStock(metadata, product.active, price?.active !== false);

  return {
    id,
    stripeProductId: product.id,
    stripePriceId: price?.id ?? null,
    name: product.name ?? "Untitled",
    tagline: metadata.tagline?.trim() ?? "",
    description: product.description?.trim() ?? "",
    pricePence,
    currency: price?.currency ?? "gbp",
    image,
    images: images.length > 0 ? images : image ? [image] : [],
    imageAlt: metadata.image_alt?.trim() || product.name || "",
    materials: parseMaterials(metadata.materials),
    dimensions: metadata.dimensions?.trim() ?? "",
    availability: parseAvailability(metadata, product.active, price?.active !== false, stock),
    preorderNote: metadata.preorder_note?.trim() || undefined,
    sortOrder: Number(metadata.sort_order) || 0,
    stockTotal: stock.stockTotal,
    stockAvailable: stock.stockAvailable,
  };
}

export async function resolveDefaultPrice(stripe, product) {
  if (typeof product.default_price === "object" && product.default_price) {
    return product.default_price;
  }
  if (typeof product.default_price === "string") {
    return stripe.prices.retrieve(product.default_price);
  }
  const prices = await stripe.prices.list({
    product: product.id,
    active: true,
    limit: 1,
  });
  return prices.data[0] ?? null;
}

export async function listCatalog(stripe, { shopOnly = false } = {}) {
  const products = await stripe.products.list({ limit: 100 });
  const listings = [];

  for (const product of products.data) {
    const price = await resolveDefaultPrice(stripe, product);
    if (!price) continue;
    const listing = toListing(product, price);
    if (shopOnly && listing.availability === "sold_out") continue;
    listings.push(listing);
  }

  listings.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
  return listings;
}

/** Deactivate product + price after a one-of-a-kind sale */
export async function markProductSold(stripe, productId, priceId) {
  const product = await stripe.products.retrieve(productId);
  if (!product.active) {
    return { alreadySold: true, productId, depleted: true };
  }

  await stripe.products.update(productId, {
    active: false,
    metadata: {
      ...product.metadata,
      availability: "sold_out",
    },
  });

  if (priceId) {
    try {
      await stripe.prices.update(priceId, { active: false });
    } catch (err) {
      console.warn("markProductSold: could not deactivate price", priceId, err);
    }
  }

  clearCatalogCache();
  return { alreadySold: false, productId, depleted: true };
}

/**
 * Record a purchase: decrement batch stock or deactivate one-of-a-kind product.
 * @param {import('stripe').Stripe} stripe
 * @param {string} productId
 * @param {string | null} priceId
 * @param {number} quantity
 */
export async function recordPurchase(stripe, productId, priceId, quantity = 1) {
  const product = await stripe.products.retrieve(productId);
  const metadata = product.metadata ?? {};
  const stock = parseStock(metadata, product.active, true);
  const purchased = Math.max(1, Math.floor(quantity));

  if (!stock.isBatch) {
    return markProductSold(stripe, productId, priceId);
  }

  const nextAvailable = Math.max(0, stock.stockAvailable - purchased);
  const nextMetadata = {
    ...metadata,
    stock_available: String(nextAvailable),
  };

  if (nextAvailable <= 0) {
    nextMetadata.availability = "sold_out";
    await stripe.products.update(productId, {
      active: false,
      metadata: nextMetadata,
    });

    if (priceId) {
      try {
        await stripe.prices.update(priceId, { active: false });
      } catch (err) {
        console.warn("recordPurchase: could not deactivate price", priceId, err);
      }
    }

    clearCatalogCache();
    return { productId, stockAvailable: 0, depleted: true, purchased };
  }

  await stripe.products.update(productId, {
    metadata: nextMetadata,
  });

  clearCatalogCache();
  return { productId, stockAvailable: nextAvailable, depleted: false, purchased };
}

export function clearCatalogCache() {
  catalogCacheByKey.clear();
}

/** @type {Map<string, { catalog: unknown[], fetchedAt: number }>} */
const catalogCacheByKey = new Map();
const CACHE_MS = 30_000;

export async function listCatalogCached(stripe, options = {}) {
  const key = `${process.env.STRIPE_SECRET_KEY?.slice(-8) ?? "default"}:${options.shopOnly ? "shop" : "all"}`;
  const cached = catalogCacheByKey.get(key);
  if (cached && Date.now() - cached.fetchedAt < CACHE_MS) {
    return cached.catalog;
  }
  const catalog = await listCatalog(stripe, options);
  catalogCacheByKey.set(key, { catalog, fetchedAt: Date.now() });
  return catalog;
}

export async function findListingById(stripe, listingId) {
  const catalog = await listCatalogCached(stripe);
  return catalog.find((p) => p.id === listingId) ?? null;
}
