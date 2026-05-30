/**
 * Stripe Product catalog → shop listings.
 *
 * Product (Dashboard):
 *   name, description, images[] (HTTPS URLs), active
 *
 * Metadata (optional unless noted):
 *   listing_id     — URL slug (defaults to Stripe product id)
 *   tagline
 *   materials      — pipe-separated, e.g. "Denim offcuts|Vintage cotton"
 *   dimensions
 *   availability   — available | preorder | sold_out (overrides when product/price inactive)
 *   preorder_note
 *   image_alt
 *   sort_order     — number, lower first
 */

export function parseMaterials(raw) {
  if (!raw?.trim()) return [];
  return raw
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseAvailability(metadata, productActive, priceActive) {
  if (!productActive || !priceActive) return "sold_out";
  const raw = metadata?.availability?.toLowerCase().replace(/\s+/g, "_");
  if (raw === "preorder" || raw === "pre_order") return "preorder";
  if (raw === "sold_out" || raw === "soldout") return "sold_out";
  return "available";
}

export function toListing(product, price) {
  const metadata = product.metadata ?? {};
  const id = metadata.listing_id?.trim() || product.id;
  const image = product.images?.[0] ?? "";
  const pricePence =
    price?.unit_amount != null && price.currency === "gbp" ? price.unit_amount : 0;

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
    imageAlt: metadata.image_alt?.trim() || product.name || "",
    materials: parseMaterials(metadata.materials),
    dimensions: metadata.dimensions?.trim() ?? "",
    availability: parseAvailability(metadata, product.active, price?.active !== false),
    preorderNote: metadata.preorder_note?.trim() || undefined,
    sortOrder: Number(metadata.sort_order) || 0,
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

/** Deactivate product + price after a one-of-one sale */
export async function markProductSold(stripe, productId, priceId) {
  const product = await stripe.products.retrieve(productId);
  if (!product.active) {
    return { alreadySold: true, productId };
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
  return { alreadySold: false, productId };
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
