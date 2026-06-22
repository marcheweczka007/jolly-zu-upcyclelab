import { createFileRoute, Link } from "@tanstack/react-router";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogPagination } from "@/components/blog/BlogPagination";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllTags, getSortedPosts } from "@/lib/blog";
import { paginateItems } from "@/lib/blog/pagination";
import { BLOG_DESCRIPTION, BLOG_TITLE, pageHead } from "@/lib/seo";

type BlogSearch = {
  page?: number;
};

export const Route = createFileRoute("/blog/")({
  validateSearch: (search: Record<string, unknown>): BlogSearch => {
    const page = Number(search.page);
    return { page: Number.isFinite(page) && page > 0 ? Math.floor(page) : 1 };
  },
  head: () =>
    pageHead({
      title: BLOG_TITLE,
      description: BLOG_DESCRIPTION,
      path: "/blog",
    }),
  component: BlogIndex,
});

function BlogIndex() {
  const { page = 1 } = Route.useSearch();
  const posts = getSortedPosts();
  const pagination = paginateItems(posts, page);
  const tags = getAllTags();

  return (
    <div className="min-h-screen bg-cream text-ink">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-5 pb-10 pt-8 md:px-8 md:pb-16 md:pt-14">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-purple-deep">Blog</p>
        <div className="max-w-5xl">
          <h1 className="text-display text-[10vw] leading-[0.88] md:text-[3.75rem] lg:text-[4.25rem]">
            My reflections
            <br />
            <span className="bg-mustard px-3 inline-block -rotate-1">
              on sustainability, fashion and more.
            </span>
          </h1>
          <p className="mt-8 max-w-2xl text-xl font-medium leading-snug text-ink/85 md:text-2xl">
            Upcycling, rescued textiles, and behind the scenes of handmade - from my JollyZu studio.
          </p>
        </div>

        {tags.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-3 md:mt-12" aria-label="Filter by tag">
            <li>
              <Link
                to="/blog"
                search={{}}
                className="inline-block rounded-full border-2 border-ink bg-ink px-4 py-2 text-xs font-black uppercase tracking-wider text-cream shadow-brutal"
              >
                All
              </Link>
            </li>
            {tags.map((tag) => (
              <li key={tag}>
                <Link
                  to="/blog/tag/$tag"
                  params={{ tag }}
                  className="inline-block rounded-full border-2 border-ink bg-cream px-4 py-2 text-xs font-black uppercase tracking-wider shadow-brutal transition-colors hover:bg-mustard"
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="border-t-2 border-ink/10">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        {pagination.items.length === 0 ? (
          <p className="rounded-2xl border-2 border-dashed border-ink/25 p-12 text-center text-ink/70">
            No posts yet — add a Markdown file to <code className="text-ink">content/blog/</code>.
          </p>
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
          to="/blog"
        />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
