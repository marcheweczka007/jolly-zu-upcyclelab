/** Build-time SEO helpers — keep in sync with src/lib/seo.ts */

export const SITE_NAME = "JollyZu";
export const SITE_FULL_NAME = "JollyZu Upcycle Lab";
export const SITE_ALTERNATE_NAMES = [
  "Jolly Zu Upcycle Lab",
  "JollyZu",
  "Upcycle Lab JollyZu",
];
export const HOME_TITLE = `${SITE_FULL_NAME} — Upcycled Handmade Bags from Edinburgh`;
export const DEFAULT_DESCRIPTION =
  "JollyZu Upcycle Lab — handmade upcycled bags built from rescued textiles in Edinburgh, Scotland. Bold, durable, one-of-a-kind slow fashion by indie maker Zuza.";
export const LOCALE = "en_GB";
export const INSTAGRAM_URL = "https://instagram.com/upcycle.lab.jollyzu";

export function resolveSiteUrl() {
  const raw =
    process.env.VITE_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim() ||
    process.env.URL?.trim() ||
    "https://jollyzu.com";
  return raw.replace(/\/$/, "");
}

export function absoluteUrl(siteUrl, pathOrUrl) {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  return `${siteUrl}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

function truncate(text, max = 160) {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function buildMetaTags({
  siteUrl,
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  ogImage,
  ogType = "website",
  noindex = false,
  jsonLd,
}) {
  const canonical = absoluteUrl(siteUrl, path);
  const image = absoluteUrl(siteUrl, ogImage);
  const desc = truncate(description);

  const tags = [
    `<meta name="description" content="${escapeAttr(desc)}">`,
    noindex ? `<meta name="robots" content="noindex, nofollow">` : "",
    `<link rel="canonical" href="${escapeAttr(canonical)}">`,
    `<meta property="og:title" content="${escapeAttr(title)}">`,
    `<meta property="og:description" content="${escapeAttr(desc)}">`,
    `<meta property="og:url" content="${escapeAttr(canonical)}">`,
    `<meta property="og:type" content="${escapeAttr(ogType)}">`,
    `<meta property="og:site_name" content="${escapeAttr(SITE_FULL_NAME)}">`,
    `<meta property="og:locale" content="${escapeAttr(LOCALE)}">`,
    `<meta property="og:image" content="${escapeAttr(image)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeAttr(title)}">`,
    `<meta name="twitter:description" content="${escapeAttr(desc)}">`,
    `<meta name="twitter:image" content="${escapeAttr(image)}">`,
  ].filter(Boolean);

  if (jsonLd) {
    const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
    for (const schema of schemas) {
      tags.push(
        `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`,
      );
    }
  }

  return tags.join("\n    ");
}

export function organizationJsonLd(siteUrl, defaultOgImage) {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: SITE_FULL_NAME,
    alternateName: SITE_ALTERNATE_NAMES,
    url: siteUrl,
    logo: defaultOgImage,
    description: DEFAULT_DESCRIPTION,
    sameAs: [INSTAGRAM_URL],
    founder: { "@type": "Person", name: "Zuza" },
    areaServed: { "@type": "Country", name: "United Kingdom" },
    priceRange: "££",
    knowsAbout: [
      "upcycling",
      "slow fashion",
      "handmade bags",
      "rescued textiles",
      "sustainable fashion",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Edinburgh",
      addressCountry: "GB",
    },
  };
}

export function webSiteJsonLd(siteUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_FULL_NAME,
    alternateName: SITE_ALTERNATE_NAMES,
    url: siteUrl,
    description: DEFAULT_DESCRIPTION,
    publisher: { "@type": "Organization", name: SITE_FULL_NAME },
  };
}

export function productJsonLd(siteUrl, product) {
  const url = absoluteUrl(siteUrl, `/shop/${product.id}`);
  const images = (product.images?.length > 0 ? product.images : product.image ? [product.image] : [])
    .map((img) => absoluteUrl(siteUrl, img))
    .filter(Boolean);

  let availability = "https://schema.org/InStock";
  if (product.availability === "sold_out") availability = "https://schema.org/OutOfStock";
  if (product.availability === "preorder") availability = "https://schema.org/PreOrder";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.tagline,
    image: images.length > 0 ? images : undefined,
    brand: { "@type": "Brand", name: SITE_FULL_NAME },
    sku: product.id,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: (product.currency ?? "gbp").toUpperCase(),
      price: (product.pricePence / 100).toFixed(2),
      availability,
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE_FULL_NAME },
    },
  };
}

export function productBreadcrumbJsonLd(siteUrl, product) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl(siteUrl, "/shop") },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: absoluteUrl(siteUrl, `/shop/${product.id}`),
      },
    ],
  };
}
