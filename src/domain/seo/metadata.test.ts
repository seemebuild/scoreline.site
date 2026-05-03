import { describe, expect, it } from "vitest";

import { buildPageMetadata, buildSportMetadata, canonicalUrl } from "./metadata";

describe("canonicalUrl", () => {
  it("builds absolute urls", () => {
    expect(canonicalUrl("/news")).toBe("https://scoreline.site/news");
  });
});

describe("buildPageMetadata", () => {
  it("builds page metadata with canonical path", () => {
    const metadata = buildPageMetadata({
      title: "News",
      description: "Editorial coverage",
      canonicalPath: "/news",
    });

    expect(metadata.title).toBe("News");
    expect(metadata.alternates?.canonical).toBe("/news");
    expect(metadata.openGraph?.url).toBe("https://scoreline.site/news");
  });
});

describe("buildSportMetadata", () => {
  it("builds sport page metadata", () => {
    const metadata = buildSportMetadata({
      sportName: "Soccer",
      pageName: "fixtures",
      description: "Upcoming fixtures",
      path: "/sports/soccer/fixtures",
    });

    expect(metadata.title).toBe("Soccer fixtures");
  });
});
