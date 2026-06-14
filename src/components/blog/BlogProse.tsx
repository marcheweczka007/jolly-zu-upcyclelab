/** Typography styles for compiled Markdown HTML — matches JollyZu design system. */
export function BlogProse({ html }: { html: string }) {
  return (
    <div
      className="blog-prose space-y-6 text-lg leading-relaxed text-ink/85 [&_a]:font-semibold [&_a]:text-purple-deep [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l-4 [&_blockquote]:border-mustard [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-ink/75 [&_em]:italic [&_h2]:text-display [&_h2]:mt-10 [&_h2]:text-3xl [&_h2]:leading-tight [&_h2]:text-ink [&_h3]:text-display [&_h3]:mt-8 [&_h3]:text-2xl [&_h3]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_p]:text-ink/80 [&_strong]:font-bold [&_strong]:text-ink [&_ul]:space-y-2"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
