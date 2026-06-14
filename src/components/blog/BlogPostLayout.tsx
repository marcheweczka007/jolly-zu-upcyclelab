import { Link } from "@tanstack/react-router";
import { BlogProse } from "@/components/blog/BlogProse";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { formatBlogDate } from "@/lib/blog";
import type { BlogPost } from "@/types/blog";

type BlogPostLayoutProps = {
  post: BlogPost;
  relatedPosts: BlogPost[];
};

/** Shared layout for individual blog post pages. */
export function BlogPostLayout({ post, relatedPosts }: BlogPostLayoutProps) {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <SiteHeader />

      <article>
        <div className="mx-auto max-w-7xl px-5 pt-8 md:px-8 md:pt-10">
          <Link
            to="/blog"
            className="inline-flex text-sm font-bold uppercase tracking-wider text-purple-deep hover:underline"
          >
            ← Back to blog
          </Link>
        </div>

        {post.coverImage && (
          <div className="mx-auto max-w-7xl px-5 pt-4 md:px-8 md:pt-6">
            <div className="overflow-hidden rounded-2xl border-2 border-ink shadow-brutal">
              <img
                src={post.coverImage}
                alt=""
                className="aspect-[21/9] w-full object-cover"
                width={1280}
                height={548}
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>
        )}

        <header className="mx-auto max-w-3xl px-5 py-10 md:px-8 md:py-14">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-purple-deep">Blog</p>
          <h1 className="text-display text-[9vw] leading-[0.9] md:text-5xl lg:text-6xl">{post.title}</h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-ink/70">
            <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span>{post.author}</span>
            <span aria-hidden>·</span>
            <span>{post.readingTimeMinutes} min read</span>
          </div>
          {post.tags.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tags">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <Link
                    to="/blog/tag/$tag"
                    params={{ tag }}
                    className="rounded-full border-2 border-ink bg-mustard/40 px-3 py-1 text-xs font-black uppercase tracking-wider transition-colors hover:bg-mustard"
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </header>

        <div className="mx-auto max-w-3xl px-5 pb-16 md:px-8 md:pb-24">
          <BlogProse html={post.html} />
        </div>
      </article>

      <RelatedPosts posts={relatedPosts} />
      <SiteFooter />
    </div>
  );
}
