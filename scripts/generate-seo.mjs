#!/usr/bin/env node
/**
 * Post-build SEO: sitemap.xml, robots.txt, and prerendered HTML shells
 * with full meta tags for crawlers and social link previews.
 */
import Stripe from "stripe";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { listCatalog } from "../netlify/functions/lib/stripe-catalog.mjs";
import {
  absoluteUrl,
  buildMetaTags,
  organizationJsonLd,
  productBreadcrumbJsonLd,
  productJsonLd,
  resolveSiteUrl,
  webSiteJsonLd,
} from "./lib/seo-meta.mjs";

const DIST = join(process.cwd(), "dist");
const DEFAULT_OG = "/og-default.webp";

const STATIC_PAGES = [
  {
    path: "/",
    outPath: "index.html",
    title: "JollyZu — Upcycled Handmade Bags from Edinburgh",
    description:
      "Handmade upcycled bags built from rescued textiles. Bold, durable, one-of-a-kind. Shop the latest drop.",
    jsonLd: (siteUrl, ogImage) => [organizationJsonLd(siteUrl, ogImage), webSiteJsonLd(siteUrl)],
  },
  {
    path: "/about",
    outPath: "about/index.html",
    title: "About — JollyZu | The maker behind the bags",
    description:
      "Meet Zuza, the indie maker turning rescued textiles into one-of-a-kind upcycled bags from her Edinburgh studio.",
  },
  {
    path: "/contact",
    outPath: "contact/index.html",
    title: "Contact — JollyZu | Get in touch",
    description: "Custom orders, collabs, press, or just to say hi — get in touch with JollyZu.",
  },
  {
    path: "/shop",
    outPath: "shop/index.html",
    title: "Shop — JollyZu | Upcycled bags",
    description:
      "Browse one-of-a-kind upcycled bags handmade in Edinburgh. Small batches, no restocks.",
  },
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function stripSeoMeta(html) {
  return html
    .replace(/<meta\s+name="description"[\s\S]*?>\s*/g, "")
    .replace(/<meta\s+name="robots"[\s\S]*?>\s*/g, "")
    .replace(/<link\s+rel="canonical"[\s\S]*?>\s*/g, "")
    .replace(/<meta\s+property="og:[^"]*"[\s\S]*?>\s*/g, "")
    .replace(/<meta\s+name="twitter:[^"]*"[\s\S]*?>\s*/g, "")
    .replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, "");
}

function injectSeo(html, { title, metaTags }) {
  let out = stripSeoMeta(html);
  out = out.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  out = out.replace("</head>", `    ${metaTags}\n  </head>`);
  return out;
}

async function writeHtml(outPath, content) {
  const full = join(DIST, outPath);
  await mkdir(dirname(full), { recursive: true });
  await writeFile(full, content, "utf8");
}

async function fetchProducts() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    console.warn("generate-seo: STRIPE_SECRET_KEY not set — sitemap will omit product URLs");
    return [];
  }
  const stripe = new Stripe(secret);
  return listCatalog(stripe, { shopOnly: true });
}

function buildSitemap(siteUrl, products) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    ...STATIC_PAGES.map((p) => ({ loc: absoluteUrl(siteUrl, p.path), priority: p.path === "/" ? "1.0" : "0.8" })),
    ...products
      .filter((p) => p.availability !== "sold_out")
      .map((p) => ({
        loc: absoluteUrl(siteUrl, `/shop/${p.id}`),
        priority: "0.7",
      })),
  ];

  const body = urls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

async function main() {
  const siteUrl = resolveSiteUrl();
  const defaultOgImage = absoluteUrl(siteUrl, DEFAULT_OG);
  const template = await readFile(join(DIST, "index.html"), "utf8");
  const products = await fetchProducts();

  for (const page of STATIC_PAGES) {
    const metaTags = buildMetaTags({
      siteUrl,
      title: page.title,
      description: page.description,
      path: page.path,
      ogImage: DEFAULT_OG,
      jsonLd: page.jsonLd?.(siteUrl, defaultOgImage),
    });
    const html = injectSeo(template, { title: page.title, metaTags });
    await writeHtml(page.outPath, html);
    console.log(`generate-seo: ${page.outPath}`);
  }

  for (const product of products) {
    const title = `${product.name} — JollyZu`;
    const description =
      product.description ||
      product.tagline ||
      `${product.name} — handmade upcycled bag from JollyZu, Edinburgh.`;
    const metaTags = buildMetaTags({
      siteUrl,
      title,
      description,
      path: `/shop/${product.id}`,
      ogImage: product.image || DEFAULT_OG,
      ogType: "product",
      noindex: product.availability === "sold_out",
      jsonLd: [productJsonLd(siteUrl, product), productBreadcrumbJsonLd(siteUrl, product)],
    });
    const html = injectSeo(template, { title, metaTags });
    const outPath = `shop/${product.id}/index.html`;
    await writeHtml(outPath, html);
    console.log(`generate-seo: ${outPath}`);
  }

  await writeFile(join(DIST, "sitemap.xml"), buildSitemap(siteUrl, products), "utf8");
  console.log("generate-seo: sitemap.xml");

  const robots = `User-agent: *
Allow: /

Sitemap: ${absoluteUrl(siteUrl, "/sitemap.xml")}
`;
  await writeFile(join(DIST, "robots.txt"), robots, "utf8");
  console.log("generate-seo: robots.txt");
}

main().catch((err) => {
  console.error("generate-seo:", err.message);
  process.exit(1);
});
