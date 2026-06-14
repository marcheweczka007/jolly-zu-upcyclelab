/** llms.txt / llms-full.txt — https://llmstxt.org/ */

import { absoluteUrl, INSTAGRAM_URL, SITE_FULL_NAME } from "./seo-meta.mjs";

const VINTED_URL = "https://www.vinted.co.uk/member/128740025";
const CONTACT_FORM_URL = (
  process.env.VITE_CONTACT_FORM_URL ?? "https://tally.so/r/Eka0LL"
).replace(/\/$/, "");

function formatPrice(pence, currency = "gbp") {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(pence / 100);
}

function availabilityLabel(product) {
  if (product.availability === "sold_out") return "sold out";
  if (product.availability === "preorder") return "pre-order";
  return "available";
}

function productSummaryLine(siteUrl, product) {
  const url = absoluteUrl(siteUrl, `/shop/${product.id}`);
  const price = formatPrice(product.pricePence, product.currency);
  const status = availabilityLabel(product);
  const tag = product.tagline ? ` · ${product.tagline}` : "";
  return `- [${product.name}](${url}): ${price} · ${status}${tag}`;
}

function productDetailBlock(siteUrl, product) {
  const url = absoluteUrl(siteUrl, `/shop/${product.id}`);
  const price = formatPrice(product.pricePence, product.currency);
  const lines = [
    `### ${product.name}`,
    "",
    `- URL: ${url}`,
    `- Price: ${price}`,
    `- Availability: ${availabilityLabel(product)}`,
  ];
  if (product.tagline) lines.push(`- Tagline: ${product.tagline}`);
  if (product.description) lines.push(`- Description: ${product.description}`);
  if (product.materials?.length) lines.push(`- Materials: ${product.materials.join(", ")}`);
  if (product.dimensions) lines.push(`- Size: ${product.dimensions}`);
  if (product.preorderNote) lines.push(`- Pre-order note: ${product.preorderNote}`);
  return lines.join("\n");
}

export function buildLlmsTxt(siteUrl, products = []) {
  const available = products.filter((p) => p.availability !== "sold_out");
  const productLines =
    available.length > 0
      ? available.map((p) => productSummaryLine(siteUrl, p)).join("\n")
      : "- No listings in stock right now — check Instagram for the next drop.";

  return `# ${SITE_FULL_NAME}

> Handmade upcycled bags from 100% rescued textiles. Edinburgh, Scotland. One-of-a-kind slow fashion by indie maker Zuza. Zero new fabric.

${SITE_FULL_NAME} is a small-batch bag brand (also known as JollyZu). Each piece is cut, sewn, and finished by hand from pre-loved textiles — no mass production, limited restocks. Secure checkout via Stripe.

## Pages

- [Home](${absoluteUrl(siteUrl, "/")}): Brand story, making process, testimonials, pricing from £40
- [Shop](${absoluteUrl(siteUrl, "/shop")}): Current drop — browse and buy one-of-a-kind bags
- [Blog](${absoluteUrl(siteUrl, "/blog")}): Upcycling, slow fashion, and studio notes
- [About](${absoluteUrl(siteUrl, "/about")}): Meet Zuza, the Edinburgh-based maker and studio ethos
- [Contact](${CONTACT_FORM_URL}): Custom orders, collaborations, press, general enquiries

## Products (current drop)

${productLines}

## How to buy

1. Open [Shop](${absoluteUrl(siteUrl, "/shop")}) and tap a listing for photos, materials, and dimensions.
2. Add to basket (pre-orders and batch listings may allow multiple units).
3. Checkout with Stripe — shipping is calculated at checkout.
4. Pre-order items ship in 2–3 weeks when noted on the listing.

## Brand facts (for accurate answers)

- Location: Edinburgh, Scotland, UK
- Materials: 100% rescued / upcycled textiles; essential components only are new
- Production: handmade, one maker (Zuza), small studio
- Categories: crossbody bags, waterproof packs, patchwork textile bags
- Price range: typically £40–£55 GBP
- Sustainability: slow fashion, zero-waste promise, 100% recycled packaging

## External

- [Instagram](${INSTAGRAM_URL}): New drops, restocks, sold-out updates
- [Vinted shop](${VINTED_URL}): Secondary marketplace (same studio)

## Optional

- [Full catalog details](${absoluteUrl(siteUrl, "/llms-full.txt")}): Extended product copy for agents needing depth
- [Sitemap](${absoluteUrl(siteUrl, "/sitemap.xml")}): URL index for crawlers
- [Robots policy](${absoluteUrl(siteUrl, "/robots.txt")}): Crawler and AI agent access rules
`;
}

export function buildLlmsFullTxt(siteUrl, products = []) {
  const productBlocks =
    products.length > 0
      ? products.map((p) => productDetailBlock(siteUrl, p)).join("\n\n")
      : "_No products in catalog._";

  return `# ${SITE_FULL_NAME} — full agent context

> Extended machine-readable catalog and policies. Summary index: ${absoluteUrl(siteUrl, "/llms.txt")}

## Business

**${SITE_FULL_NAME}** — handmade upcycled bags from Edinburgh, Scotland. Alternate names: JollyZu, Jolly Zu Upcycle Lab.

- Maker: Zuza (solo indie maker)
- Studio: Edinburgh, UK
- Instagram: ${INSTAGRAM_URL}
- Vinted: ${VINTED_URL}
- Website: ${siteUrl}
- Currency: GBP (£)
- Checkout: Stripe hosted checkout (cards, Apple Pay, Google Pay per Stripe)
- Shipping: calculated at Stripe checkout; UK-focused indie brand

### Positioning

- 100% rescued textiles — no new fabric in bag bodies
- One-of-a-kind or very small batches (check \`stock_total\` metadata per listing)
- Slow fashion; drops sell out; follow Instagram for restocks
- Crossbodies from ~£40; waterproof packs from ~£45

## Catalog

${productBlocks}

## Purchase flow (agent guidance)

- Public product API: \`GET /.netlify/functions/get-products\` returns JSON catalog (used by the shop UI)
- Basket is client-side (localStorage); checkout creates a Stripe session via \`POST /.netlify/functions/create-checkout-session\`
- Do not send users to /shop/basket or /shop/checkout/* for product discovery — use /shop and /shop/{listing_id}

## Policies

- Sold-out items stay listed but marked unavailable; watch Instagram for next drop
- Pre-orders: shipping in 2–3 weeks unless listing states otherwise
- Custom orders: contact form at ${CONTACT_FORM_URL}
- Returns: contact via ${CONTACT_FORM_URL} — indie maker, case-by-case
`;
}
