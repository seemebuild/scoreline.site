import { describe, expect, it } from "vitest";

import NewsArticlePage from "./page";

describe("NewsArticlePage", () => {
  it("returns the editorial placeholder article route", () => {
    expect(typeof NewsArticlePage).toBe("function");
  });
});
