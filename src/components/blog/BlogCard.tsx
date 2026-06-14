import { Link } from "@tanstack/react-router";
import { formatBlogDate } from "@/lib/blog";
import type { BlogPost } from "@/types/blog";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-ink bg-cream shadow-brutal transition-all hover:-translate-y-1 hover:shadow-brutal-lg">
      <Link to="/blog/$slug" params={{ slug: post.slug }} className="flex min-h-0 flex-1 flex-col">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              decoding="async"
              width={640}
              height={400}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-ink/40">No cover image</div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-deep">
            {formatBlogDate(post.date)} · {post.readingTimeMinutes} min read
          </p>
          <h2 className="text-display text-2xl leading-tight text-ink">{post.title}</h2>
          <p className="flex-1 text-sm leading-relaxed text-ink/70 line-clamp-3">{post.description}</p>
          <span className="text-display inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-ink group-hover:text-purple-deep">
            Read more →
          </span>
        </div>
      </Link>
    </article>
  );
}
