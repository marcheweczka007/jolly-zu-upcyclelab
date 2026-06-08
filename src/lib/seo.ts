import type { Product } from "@/types/product";

export const SITE_NAME = "JollyZu";
export const SITE_FULL_NAME = "JollyZu Upcycle Lab";
export const SITE_ALTERNATE_NAMES = [
  "Jolly Zu Upcycle Lab",
  "JollyZu",
  "Upcycle Lab JollyZu",
] as const;
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://jollyzu.com").replace(/\/$/, "");
export const HOME_TITLE = "JollyZu | Handmade Upcycled Bags from Scotland";
export const HOME_DESCRIPTION =
  "Handmade upcycled bags from reclaimed textiles in Scotland. Eco-friendly, one-of-a-kind crossbody bags by JollyZu — sustainable slow fashion, UK delivery.";
export const DEFAULT_DESCRIPTION = HOME_DESCRIPTION;

export const SHOP_TITLE = "Shop Upcycled Bags | Handmade in Scotland — JollyZu";
export const SHOP_DESCRIPTION =
  "Shop handmade upcycled bags from reclaimed textiles. Eco-friendly crossbody & shoulder bags from Scotland — small batches by JollyZu, UK delivery.";

export const ABOUT_TITLE = "About JollyZu | Handmade Bags from Scotland";
export const ABOUT_DESCRIPTION =
  "Meet Zuza, Edinburgh maker behind JollyZu. She sews handmade upcycled bags from reclaimed textiles — sustainable, one-of-a-kind pieces from Scotland.";

export const CONTACT_TITLE = "Contact JollyZu | Custom Upcycled Bags, UK";
export const CONTACT_DESCRIPTION =
  "Ask about custom upcycled bags, collaborations, or press. JollyZu makes handmade bags from reclaimed textiles in Edinburgh — eco-friendly, UK-based.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.webp`;
export const LOCALE = "en_GB";
export const INSTAGRAM_URL = "https://instagram.com/upcycle.lab.jollyzu";

type PageHeadOptions = {
  title: string;
  description?: string;
  path: string;
  ogImage?: string;
  ogType?: "website" | "product";
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

export function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

function truncate(text: string, max = 160): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
}

function jsonLdMeta(schemas: Record<string, unknown> | Record<string, unknown>[]) {
  const list = Array.isArray(schemas) ? schemas : [schemas];
  return list.map((schema) => ({ "script:ld+json": schema }));
}

export function pageHead({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  noindex = false,
  jsonLd,
}: PageHeadOptions) {
  const canonical = absoluteUrl(path);
  const image = absoluteUrl(ogImage);
  const desc = truncate(description);

  const meta = [
    { title },
    { name: "description", content: desc },
    ...(noindex ? [{ name: "robots", content: "noindex, nofollow" }] : []),
    { property: "og:title", content: title },
    { property: "og:description", content: desc },
    { property: "og:url", content: canonical },
    { property: "og:type", content: ogType },
    { property: "og:site_name", content: SITE_FULL_NAME },
    { property: "og:locale", content: LOCALE },
    { property: "og:image", content: image },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: desc },
    { name: "twitter:image", content: image },
    ...(jsonLd ? jsonLdMeta(jsonLd) : []),
  ];

  return {
    meta,
    links: [{ rel: "canonical", href: canonical }],
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: SITE_FULL_NAME,
    alternateName: [...SITE_ALTERNATE_NAMES],
    url: SITE_URL,
    logo: DEFAULT_OG_IMAGE,
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

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_FULL_NAME,
    alternateName: [...SITE_ALTERNATE_NAMES],
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: { "@type": "Organization", name: SITE_FULL_NAME },
  };
}

function productAvailability(product: Product): string {
  if (product.availability === "sold_out") {
    return "https://schema.org/OutOfStock";
  }
  if (product.availability === "preorder") {
    return "https://schema.org/PreOrder";
  }
  return "https://schema.org/InStock";
}

export function productJsonLd(product: Product) {
  const url = absoluteUrl(`/shop/${product.id}`);
  const images = (product.images.length > 0 ? product.images : product.image ? [product.image] : [])
    .map(absoluteUrl)
    .filter(Boolean);

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
      priceCurrency: product.currency.toUpperCase(),
      price: (product.pricePence / 100).toFixed(2),
      availability: productAvailability(product),
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE_FULL_NAME },
    },
  };
}

export function productBreadcrumbJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl("/shop") },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: absoluteUrl(`/shop/${product.id}`),
      },
    ],
  };
}

export function shopItemListJsonLd(products: Product[]) {
  const listed = products.filter((p) => p.availability !== "sold_out");
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_FULL_NAME} current drop`,
    description: "One-of-a-kind upcycled bags available to buy",
    numberOfItems: listed.length,
    itemListElement: listed.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.name,
      url: absoluteUrl(`/shop/${product.id}`),
    })),
  };
}

export function productSeoTitle(product: Product): string {
  return `${product.name} | Upcycled Bag — ${SITE_NAME}`;
}

export function productSeoDescription(product: Product): string {
  return (
    product.description ||
    product.tagline ||
    `Handmade upcycled bag from reclaimed textiles. ${product.name} by JollyZu — eco-friendly, one-of-a-kind, made in Scotland. UK shipping.`
  );
}

export function productHead(product: Product) {
  const title = productSeoTitle(product);
  const description = productSeoDescription(product);
  const ogImage = product.image || DEFAULT_OG_IMAGE;
  const noindex = product.availability === "sold_out";

  return pageHead({
    title,
    description,
    path: `/shop/${product.id}`,
    ogImage,
    ogType: "product",
    noindex,
    jsonLd: [productJsonLd(product), productBreadcrumbJsonLd(product)],
  });
}
