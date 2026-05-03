import { describe, expect, it, vi } from "vitest";

import { getEditorialArticleBySlug, getEditorialArticles } from "./content";

describe("getEditorialArticles", () => {
  it("returns fallback editorial content without a client", async () => {
    const articles = await getEditorialArticles();

    expect(articles).toHaveLength(1);
    expect(articles[0]?.slug).toBe("launch-editorial-placeholder");
  });

  it("loads editorial content from a CMS client", async () => {
    const client = {
      fetch: vi.fn().mockResolvedValue([
        {
          id: "article_1",
          slug: "hello-world",
          title: "Hello world",
          summary: "Summary",
          body: "Body",
          status: "published",
          publishedAt: "2026-05-03T00:00:00.000Z",
          author: null,
          sources: [],
        },
      ]),
    };

    const articles = await getEditorialArticles(client);

    expect(client.fetch).toHaveBeenCalled();
    expect(articles[0]?.slug).toBe("hello-world");
  });
});

describe("getEditorialArticleBySlug", () => {
  it("returns fallback article by slug", async () => {
    const article = await getEditorialArticleBySlug("launch-editorial-placeholder");

    expect(article?.title).toContain("Scoreline editorial workflow");
  });
});
