import type { BlogManifest, BlogPost } from "@/types/blog";

/**
 * Blog data is compiled from content/blog/*.md at build/dev time.
 * Run `npm run generate:blog` manually if you add a post while the dev server is running.
 */
import manifest from "@/generated/blog-manifest.json";

const data = manifest as BlogManifest;

/** All posts in the order they appear in the manifest (newest first). */
export function getAllPosts(): BlogPost[] {
  return data.posts;
}

/** Newest-first — alias used by listing pages. */
export function getSortedPosts(): BlogPost[] {
  return [...data.posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return data.posts.find((post) => post.slug === slug);
}

export function getPostsByTag(tag: string): BlogPost[] {
  const normalized = tag.trim().toLowerCase();
  return getSortedPosts().filter((post) => post.tags.includes(normalized));
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const post of data.posts) {
    for (const tag of post.tags) {
      tags.add(tag);
    }
  }
  return [...tags].sort();
}

/** Related posts ranked by number of shared tags (excludes current post). */
export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const tagSet = new Set(post.tags);

  return getSortedPosts()
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => ({
      post: candidate,
      score: candidate.tags.filter((tag) => tagSet.has(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.post.date).getTime() - new Date(a.post.date).getTime())
    .slice(0, limit)
    .map(({ post: related }) => related);
}

export function formatBlogDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
