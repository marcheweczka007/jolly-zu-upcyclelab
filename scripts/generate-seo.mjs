#!/usr/bin/env node
/**
 * Post-build SEO: sitemap.xml, robots.txt, and prerendered HTML shells
 * with full meta tags for crawlers and social link previews.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fetchCatalogProducts } from "./lib/fetch-catalog.mjs";
import { buildBlogManifest } from "./lib/blog-build.mjs";
import { buildLlmsFullTxt, buildLlmsTxt } from "./lib/llms-txt.mjs";
import { buildRobotsTxt } from "./lib/robots-txt.mjs";
import { buildRssFeed } from "./lib/rss-feed.mjs";
import {
  absoluteUrl,
  ABOUT_DESCRIPTION,
  ABOUT_TITLE,
  BLOG_DESCRIPTION,
  BLOG_TITLE,
  blogPostJsonLd,
  blogPostSeoTitle,
  buildMetaTags,
  HOME_DESCRIPTION,
  HOME_TITLE,
  organizationJsonLd,
  productBreadcrumbJsonLd,
  productJsonLd,
  productSeoDescription,
  productSeoTitle,
  resolveSiteUrl,
  SHOP_DESCRIPTION,
  SHOP_TITLE,
  webSiteJsonLd,
} from "./lib/seo-meta.mjs";

const PUBLIC = join(process.cwd(), "public");

const DIST = join(process.cwd(), "dist");
const DEFAULT_OG = "/og-image.jpg";

const STATIC_PAGES = [
  {
    path: "/",
    outPath: "index.html",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    jsonLd: (siteUrl, ogImage) => [
      organizationJsonLd(siteUrl, ogImage),
      webSiteJsonLd(siteUrl, ogImage),
    ],
  },
  {
    path: "/about",
    outPath: "about/index.html",
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
  },
  {
    path: "/blog",
    outPath: "blog/index.html",
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
  },
  {
    path: "/shop",
    outPath: "shop/index.html",
    title: SHOP_TITLE,
    description: SHOP_DESCRIPTION,
  },
];

function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
  const products = await fetchCatalogProducts();
  if (products.length === 0 && !process.env.STRIPE_SECRET_KEY) {
    console.warn("generate-seo: STRIPE_SECRET_KEY not set — sitemap will omit product URLs");
  }
  return products;
}

function buildSitemap(siteUrl, products, blogPosts) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    ...STATIC_PAGES.map((p) => ({
      loc: absoluteUrl(siteUrl, p.path),
      priority: p.path === "/" ? "1.0" : "0.8",
    })),
    ...blogPosts.map((post) => ({
      loc: absoluteUrl(siteUrl, `/blog/${post.slug}`),
      priority: "0.7",
      lastmod: post.date,
    })),
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
    <lastmod>${u.lastmod ?? today}</lastmod>
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
  if (siteUrl.includes("netlify.app") || siteUrl.includes("lovable.app")) {
    console.warn(
      `generate-seo: unexpected siteUrl "${siteUrl}" — set SITE_URL and VITE_SITE_URL to https://jollyzu.com`,
    );
  }
  const defaultOgImage = absoluteUrl(siteUrl, DEFAULT_OG);
  const template = await readFile(join(DIST, "index.html"), "utf8");
  const products = await fetchProducts();
  const { posts: blogPosts } = await buildBlogManifest();

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
    const title = productSeoTitle(product);
    const description = productSeoDescription(product);
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

  for (const post of blogPosts) {
    const title = blogPostSeoTitle(post.title);
    const metaTags = buildMetaTags({
      siteUrl,
      title,
      description: post.description,
      path: `/blog/${post.slug}`,
      ogImage: post.coverImage || DEFAULT_OG,
      ogType: "article",
      jsonLd: blogPostJsonLd(siteUrl, post),
    });
    const html = injectSeo(template, { title, metaTags });
    const outPath = `blog/${post.slug}/index.html`;
    await writeHtml(outPath, html);
    console.log(`generate-seo: ${outPath}`);
  }

  await writeFile(join(DIST, "sitemap.xml"), buildSitemap(siteUrl, products, blogPosts), "utf8");
  console.log("generate-seo: sitemap.xml");

  const rss = buildRssFeed(siteUrl, blogPosts);
  await mkdir(join(DIST, "blog"), { recursive: true });
  await mkdir(join(PUBLIC, "blog"), { recursive: true });
  await writeFile(join(DIST, "blog/rss.xml"), rss, "utf8");
  await writeFile(join(PUBLIC, "blog/rss.xml"), rss, "utf8");
  console.log("generate-seo: blog/rss.xml");

  const robots = buildRobotsTxt(siteUrl);
  await writeFile(join(DIST, "robots.txt"), robots, "utf8");
  await writeFile(join(PUBLIC, "robots.txt"), robots, "utf8");
  console.log("generate-seo: robots.txt");

  const llmsTxt = buildLlmsTxt(siteUrl, products);
  const llmsFullTxt = buildLlmsFullTxt(siteUrl, products);
  for (const dir of [DIST, PUBLIC]) {
    await writeFile(join(dir, "llms.txt"), llmsTxt, "utf8");
    await writeFile(join(dir, "llms-full.txt"), llmsFullTxt, "utf8");
  }
  console.log("generate-seo: llms.txt, llms-full.txt");
}

main().catch((err) => {
  console.error("generate-seo:", err.message);
  process.exit(1);
});
