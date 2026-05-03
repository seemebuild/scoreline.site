import { describe, expect, it } from "vitest";

import { getProviderCapabilities, supportsProviderJobType } from "./capabilities";

describe("getProviderCapabilities", () => {
  it("marks soccer as a full provider and shells as limited", () => {
    expect(getProviderCapabilities("soccer")).toEqual({
      sportSlug: "soccer",
      competitions: true,
      fixtures: true,
      standings: true,
      results: true,
    });

    expect(getProviderCapabilities("nba")).toEqual({
      sportSlug: "nba",
      competitions: false,
      fixtures: false,
      standings: false,
      results: false,
    });
  });
});

describe("supportsProviderJobType", () => {
  it("rejects unsupported work for shell providers", () => {
    expect(supportsProviderJobType("nba", "fixtures.sync")).toBe(false);
    expect(supportsProviderJobType("soccer", "fixtures.sync")).toBe(true);
    expect(supportsProviderJobType("soccer", "results.finalize")).toBe(true);
  });
});
