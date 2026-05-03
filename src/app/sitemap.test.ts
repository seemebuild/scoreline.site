import { describe, expect, it } from "vitest";

import sitemap from "./sitemap";

describe("sitemap", () => {
  it("includes the editorial routes", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain("https://scoreline.site/");
    expect(urls).toContain("https://scoreline.site/about");
    expect(urls).toContain("https://scoreline.site/contact");
    expect(urls).toContain("https://scoreline.site/news");
    expect(urls).toContain("https://scoreline.site/authors");
    expect(urls).toContain("https://scoreline.site/categories");
    expect(urls).toContain("https://scoreline.site/policy");
    expect(urls).toContain("https://scoreline.site/studio");
    expect(urls).toContain("https://scoreline.site/sports/soccer");
  });
});
