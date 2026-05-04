import { describe, expect, it } from "vitest";

import CategoryPage from "./page";

describe("CategoryPage", () => {
  it("is a route component", () => {
    expect(typeof CategoryPage).toBe("function");
  });
});
