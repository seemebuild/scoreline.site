import { describe, expect, it } from "vitest";

import { buildArticleSchema, buildBreadcrumbSchema, buildOrganizationSchema, buildSportsEventSchema, buildWebSiteSchema } from "./schema";

describe("SEO schema builders", () => {
  it("builds organization and website schema", () => {
    expect(buildOrganizationSchema()["@type"]).toBe("Organization");
    expect(buildWebSiteSchema()["@type"]).toBe("WebSite");
  });

  it("builds breadcrumb schema", () => {
    const schema = buildBreadcrumbSchema([
      { name: "Home", url: "https://scoreline.site" },
      { name: "News", url: "https://scoreline.site/news" },
    ]);

    expect(schema.itemListElement).toHaveLength(2);
  });

  it("builds article schema", () => {
    const schema = buildArticleSchema({
      title: "Hello",
      description: "World",
      url: "https://scoreline.site/news/hello",
      publishedAt: "2026-05-03T00:00:00.000Z",
      authorName: "Scoreline Editorial",
    });

    expect(schema["@type"]).toBe("Article");
    expect(schema.headline).toBe("Hello");
  });

  it("builds sports event schema", () => {
    const schema = buildSportsEventSchema({
      name: "Manchester United vs Chelsea",
      url: "https://scoreline.site/scores",
      startDate: "2026-05-03T00:00:00.000Z",
      status: "live",
      competitionName: "Premier League",
      homeName: "Manchester United",
      awayName: "Chelsea",
      homeScore: 2,
      awayScore: 1,
    });

    expect(schema["@type"]).toBe("SportsEvent");
    expect(schema.name).toBe("Manchester United vs Chelsea");
  });
});
