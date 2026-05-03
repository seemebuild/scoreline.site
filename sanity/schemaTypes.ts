export const schemaTypes = [
  {
    name: "article",
    title: "Article",
    type: "document",
    fields: [
      { name: "title", title: "Title", type: "string" },
      { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
      { name: "summary", title: "Summary", type: "text" },
      { name: "body", title: "Body", type: "text" },
      { name: "status", title: "Status", type: "string" },
      { name: "publishedAt", title: "Published at", type: "datetime" },
      { name: "author", title: "Author", type: "reference", to: [{ type: "author" }] },
      { name: "sources", title: "Sources", type: "array", of: [{ type: "reference", to: [{ type: "source" }] }] },
    ],
  },
  {
    name: "author",
    title: "Author",
    type: "document",
    fields: [
      { name: "name", title: "Name", type: "string" },
      { name: "slug", title: "Slug", type: "slug", options: { source: "name" } },
      { name: "bio", title: "Bio", type: "text" },
    ],
  },
  {
    name: "source",
    title: "Source",
    type: "document",
    fields: [
      { name: "label", title: "Label", type: "string" },
      { name: "url", title: "URL", type: "url" },
    ],
  },
] as const;
