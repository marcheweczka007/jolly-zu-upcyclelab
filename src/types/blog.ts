export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  author: string;
  coverImage: string;
  tags: string[];
  /** Pre-rendered HTML from Markdown */
  html: string;
  readingTimeMinutes: number;
};

export type BlogManifest = {
  posts: BlogPost[];
  generatedAt: string;
};
