import { Link } from "@tanstack/react-router";

type BlogPaginationProps = {
  currentPage: number;
  totalPages: number;
  baseSearch: Record<string, string | number | undefined>;
  /** Route path for pagination links — /blog or /blog/tag/$tag */
  to: "/blog" | "/blog/tag/$tag";
  tag?: string;
};

export function BlogPagination({ currentPage, totalPages, baseSearch, to, tag }: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  const linkProps =
    to === "/blog/tag/$tag" && tag
      ? { to: "/blog/tag/$tag" as const, params: { tag } }
      : { to: "/blog" as const };

  return (
    <nav
      className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t-2 border-ink/10 pt-8"
      aria-label="Blog pagination"
    >
      {prevPage ? (
        <Link
          {...linkProps}
          search={{ ...baseSearch, page: prevPage }}
          className="text-display rounded-full border-2 border-ink px-5 py-2.5 text-sm uppercase transition-colors hover:bg-ink hover:text-cream"
        >
          ← Newer
        </Link>
      ) : (
        <span />
      )}

      <p className="text-sm font-bold uppercase tracking-wider text-ink/60">
        Page {currentPage} of {totalPages}
      </p>

      {nextPage ? (
        <Link
          {...linkProps}
          search={{ ...baseSearch, page: nextPage }}
          className="text-display rounded-full border-2 border-ink px-5 py-2.5 text-sm uppercase transition-colors hover:bg-ink hover:text-cream"
        >
          Older →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
