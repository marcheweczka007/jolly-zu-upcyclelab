import { createFileRoute, notFound } from "@tanstack/react-router";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { StructuredData } from "@/components/StructuredData";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { blogPostHead, blogPostBreadcrumbJsonLd, blogPostJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post, relatedPosts: getRelatedPosts(post) };
  },
  head: ({ loaderData }) => blogPostHead(loaderData.post),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post, relatedPosts } = Route.useLoaderData();

  return (
    <>
      <StructuredData data={[blogPostJsonLd(post), blogPostBreadcrumbJsonLd(post)]} />
      <BlogPostLayout post={post} relatedPosts={relatedPosts} />
    </>
  );
}
