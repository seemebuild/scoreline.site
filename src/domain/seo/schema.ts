export type StructuredData = Record<string, unknown>;

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Scoreline",
    url: "https://scoreline.site",
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Scoreline",
    url: "https://scoreline.site",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://scoreline.site/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildArticleSchema(input: {
  title: string;
  description: string;
  url: string;
  publishedAt: string | null;
  authorName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: input.url,
    datePublished: input.publishedAt ?? undefined,
    author: {
      "@type": "Person",
      name: input.authorName,
    },
  };
}
