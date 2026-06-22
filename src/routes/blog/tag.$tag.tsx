import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogPagination } from "@/components/blog/BlogPagination";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllTags, getPostsByTag } from "@/lib/blog";
import { paginateItems } from "@/lib/blog/pagination";
import { blogTagHead } from "@/lib/seo";

type TagSearch = {
  page?: number;
};

export const Route = createFileRoute("/blog/tag/$tag")({
  validateSearch: (search: Record<string, unknown>): TagSearch => {
    const page = Number(search.page);
    return { page: Number.isFinite(page) && page > 0 ? Math.floor(page) : 1 };
  },
  loader: ({ params }) => {
    const tag = params.tag.trim().toLowerCase();
    const knownTags = getAllTags();
    if (!knownTags.includes(tag)) throw notFound();
    return { tag, posts: getPostsByTag(tag) };
  },
  head: ({ params }) => blogTagHead(params.tag),
  component: BlogTagPage,
});

function BlogTagPage() {
  const { tag, posts } = Route.useLoaderData();
  const { page = 1 } = Route.useSearch();
  const pagination = paginateItems(posts, page);
  const label = tag.replace(/-/g, " ");

  return (
    <div className="min-h-screen bg-cream text-ink">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-5 pb-10 pt-8 md:px-8 md:pb-16 md:pt-14">
        <Link
          to="/blog"
          className="mb-6 inline-flex text-sm font-bold uppercase tracking-wider text-purple-deep hover:underline"
        >
          ← Back to blog
        </Link>
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-purple-deep">Tag</p>
        <div className="max-w-5xl">
          <h1 className="text-display text-[10vw] capitalize leading-[0.88] md:text-[3.75rem] lg:text-[4.25rem]">
            {label}
          </h1>
          <p className="mt-8 max-w-2xl text-xl font-medium leading-snug text-ink/85 md:text-2xl">
            {pagination.totalItems} article{pagination.totalItems === 1 ? "" : "s"} tagged &ldquo;
            {label}&rdquo;
          </p>
        </div>
      </section>

      <section className="border-t-2 border-ink/10">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        {pagination.items.length === 0 ? (
          <p className="text-center text-ink/70">No posts with this tag yet.</p>
        ) : (
          <ul className="grid auto-rows-fr gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {pagination.items.map((post) => (
              <li key={post.slug} className="h-full min-h-0">
                <BlogCard post={post} />
              </li>
            ))}
          </ul>
        )}

        <BlogPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          baseSearch={{}}
          to="/blog/tag/$tag"
          tag={tag}
        />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
