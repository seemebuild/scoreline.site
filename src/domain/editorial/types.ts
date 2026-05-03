export const ARTICLE_STATUSES = ["draft", "scheduled", "published"] as const;

export type ArticleStatus = (typeof ARTICLE_STATUSES)[number];

export type EditorialAuthor = {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
};

export type EditorialSource = {
  label: string;
  url: string;
};

export type EditorialArticle = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  status: ArticleStatus;
  publishedAt: string | null;
  author: EditorialAuthor | null;
  sources: EditorialSource[];
};
