import { absoluteUrl } from "./seo-meta.mjs";

/** robots.txt — search crawlers + explicit AI agent access */
export function buildRobotsTxt(siteUrl) {
  return `# JollyZu — https://llmstxt.org/
# LLM-readable site summary: ${absoluteUrl(siteUrl, "/llms.txt")}

User-agent: *
Allow: /

# AI / LLM crawlers (explicitly allowed)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: Bytespider
Allow: /

# Transactional pages — low value for indexing
Disallow: /shop/basket
Disallow: /shop/checkout/

Sitemap: ${absoluteUrl(siteUrl, "/sitemap.xml")}
`;
}
