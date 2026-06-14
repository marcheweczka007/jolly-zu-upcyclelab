/**
 * Build-time blog compiler — reads Markdown from content/blog and produces a manifest.
 * Used by generate-blog.mjs (dev/build) and generate-seo.mjs (sitemap, RSS, prerender).
 */
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const CONTENT_DIR = join(process.cwd(), "content/blog");

/** Words per minute for estimated reading time. */
const WORDS_PER_MINUTE = 200;

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function estimateReadingTimeMinutes(markdown) {
  return Math.max(1, Math.ceil(countWords(markdown) / WORDS_PER_MINUTE));
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  return [...new Set(tags.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean))];
}

function slugFromFilename(filename) {
  return filename.replace(/\.md$/i, "");
}

async function markdownToHtml(markdown) {
  const file = await remark().use(remarkHtml, { sanitize: false }).process(markdown);
  return String(file);
}

/**
 * Parse every .md file in content/blog.
 * To add a post: drop a new .md file with frontmatter — no code changes required.
 */
export async function buildBlogManifest() {
  let entries;
  try {
    entries = await readdir(CONTENT_DIR);
  } catch {
    return { posts: [], generatedAt: new Date().toISOString() };
  }

  const mdFiles = entries.filter((name) => name.endsWith(".md") && name.toLowerCase() !== "readme.md");
  const posts = [];

  for (const filename of mdFiles) {
    const raw = await readFile(join(CONTENT_DIR, filename), "utf8");
    const { data, content } = matter(raw);

    const slug = String(data.slug ?? slugFromFilename(filename)).trim();
    const title = String(data.title ?? "").trim();
    const description = String(data.description ?? "").trim();
    const date = String(data.date ?? "").trim();
    const author = String(data.author ?? "Zuza").trim();
    const coverImage = String(data.coverImage ?? "").trim();

    if (!slug || !title || !description || !date) {
      console.warn(`blog-build: skipping ${filename} — missing slug, title, description, or date`);
      continue;
    }

    const html = await markdownToHtml(content);

    posts.push({
      slug,
      title,
      description,
      date,
      author,
      coverImage,
      tags: normalizeTags(data.tags),
      html,
      readingTimeMinutes: estimateReadingTimeMinutes(content),
    });
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    posts,
    generatedAt: new Date().toISOString(),
  };
}

export const BLOG_MANIFEST_PATH = join(process.cwd(), "src/generated/blog-manifest.json");
