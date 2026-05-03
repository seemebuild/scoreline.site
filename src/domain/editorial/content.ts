import type { EditorialArticle, EditorialAuthorCard } from "./types";

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

const fallbackAuthors: EditorialAuthorCard[] = [
  {
    id: "launch-editorial-author",
    name: "Scoreline Editorial",
    slug: "scoreline-editorial",
    bio: "The editorial desk behind launch articles and policy coverage.",
    articleCount: 1,
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

export async function getEditorialAuthors(client?: ContentClient): Promise<EditorialAuthorCard[]> {
  if (!client) {
    return fallbackAuthors;
  }

  return client.fetch<EditorialAuthorCard[]>(
    `*[_type == "author"]{
      _id,
      name,
      "slug": slug.current,
      bio,
      "articleCount": count(*[_type == "article" && references(^._id)])
    } | order(name asc)`,
  );
}

export async function getEditorialAuthorBySlug(
  slug: string,
  client?: ContentClient,
): Promise<EditorialAuthorCard | null> {
  if (!client) {
    return fallbackAuthors.find((author) => author.slug === slug) ?? null;
  }

  return client.fetch<EditorialAuthorCard | null>(
    `*[_type == "author" && slug.current == $slug][0]{
      _id,
      name,
      "slug": slug.current,
      bio,
      "articleCount": count(*[_type == "article" && references(^._id)])
    }`,
    { slug },
  );
}
