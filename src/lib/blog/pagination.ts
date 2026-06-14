/** Posts per page on /blog and /blog/tag/:tag — adjust as the archive grows. */
export const BLOG_POSTS_PER_PAGE = 6;

export function paginateItems<T>(items: T[], page: number, perPage = BLOG_POSTS_PER_PAGE) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * perPage;

  return {
    items: items.slice(start, start + perPage),
    currentPage,
    totalPages,
    totalItems: items.length,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}
