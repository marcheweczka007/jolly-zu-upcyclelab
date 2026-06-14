import { BlogCard } from "@/components/blog/BlogCard";
import type { BlogPost } from "@/types/blog";

export function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="border-t-2 border-ink/10 bg-mustard/15 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <h2 className="text-display mb-8 text-3xl md:text-4xl">Related reads</h2>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <BlogCard post={post} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
