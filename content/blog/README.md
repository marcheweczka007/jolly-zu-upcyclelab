# JollyZu blog

Add a new post by creating a `.md` file in this folder. **No code changes needed.**

## Steps

1. Copy an existing post file and rename it (e.g. `my-new-post.md`).
2. Update the frontmatter at the top.
3. Write your content in Markdown below the `---` block.
4. Add a cover image to `public/images/blog/` and reference it in `coverImage`.
5. Restart dev (`npm run dev`) or run `npm run generate:blog` if the server is already running.

## Frontmatter template

```yaml
---
title: "Your post title"
description: "Short SEO description (under 160 characters)"
date: "2026-06-14"
author: "Zuza"
coverImage: "/images/blog/your-image.webp"
tags:
  - sustainability
  - handmade
slug: "your-url-slug"
---
```

The post will be published at `/blog/your-url-slug`.
