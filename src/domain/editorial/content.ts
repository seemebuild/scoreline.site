import type { EditorialArticle } from "./types";

type ContentClient = {
  fetch: <T>(query: string, params?: Record<string, string | number>) => Promise<T>;
};

const fallbackArticles: EditorialArticle[] = [
  {
    id: "launch-editorial-placeholder",
    slug: "launch-editorial-placeholder",
    title: "Scoreline editorial workflow is coming online",
    summary: "The Sanity-backed newsroom will live here once the content model is connected.",
    body: "This placeholder article keeps the editorial route structure live while the CMS boundary is being wired up.",
    status: "published",
    publishedAt: null,
    author: null,
    sources: [],
  },
];

export async function getEditorialArticles(client?: ContentClient): Promise<EditorialArticle[]> {
  if (!client) {
    return fallbackArticles;
  }

  return client.fetch<EditorialArticle[]>(
    `*[_type == "article"]{
      _id,
      "slug": slug.current,
      title,
      summary,
      body,
      status,
      publishedAt,
      author->{_id, name, "slug": slug.current, bio},
      "sources": sources[]->{label, url}
    } | order(publishedAt desc, _createdAt desc)`,
  );
}

export async function getEditorialArticleBySlug(
  slug: string,
  client?: ContentClient,
): Promise<EditorialArticle | null> {
  if (!client) {
    return fallbackArticles.find((article) => article.slug === slug) ?? null;
  }

  return client.fetch<EditorialArticle | null>(
    `*[_type == "article" && slug.current == $slug][0]{
      _id,
      "slug": slug.current,
      title,
      summary,
      body,
      status,
      publishedAt,
      author->{_id, name, "slug": slug.current, bio},
      "sources": sources[]->{label, url}
    }`,
    { slug },
  );
}
