import { absoluteUrl } from "./seo-meta.mjs";

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RSS 2.0 feed for blog posts — written to dist/blog/rss.xml at build time. */
export function buildRssFeed(siteUrl, posts) {
  const channelLink = absoluteUrl(siteUrl, "/blog");
  const items = posts
    .map((post) => {
      const link = absoluteUrl(siteUrl, `/blog/${post.slug}`);
      const pubDate = new Date(post.date).toUTCString();
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(post.author)}</author>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>JollyZu Blog</title>
    <link>${escapeXml(channelLink)}</link>
    <description>Stories about upcycling, slow fashion, and handmade bags from Edinburgh.</description>
    <language>en-gb</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(absoluteUrl(siteUrl, "/blog/rss.xml"))}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}
