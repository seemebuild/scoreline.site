import { describe, expect, it } from "vitest";

import { isJobType } from "./types";

describe("isJobType", () => {
  it("returns true for known job types", () => {
    expect(isJobType("fixtures.sync")).toBe(true);
    expect(isJobType("cache.revalidate")).toBe(true);
  });

  it("returns false for unknown job types", () => {
    expect(isJobType("unknown.job")).toBe(false);
  });
});
