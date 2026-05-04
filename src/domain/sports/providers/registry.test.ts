import { describe, expect, it } from "vitest";

import { getProviderAdapter, isSupportedProviderSport } from "./registry";

describe("isSupportedProviderSport", () => {
  it("accepts launch sports", () => {
    expect(isSupportedProviderSport("soccer")).toBe(true);
    expect(isSupportedProviderSport("nba")).toBe(true);
  });

  it("rejects unsupported sports", () => {
    expect(isSupportedProviderSport("cricket")).toBe(false);
  });
});

describe("getProviderAdapter", () => {
  it("returns the soccer adapter for soccer", () => {
    const adapter = getProviderAdapter("soccer");

    expect(adapter.sportSlug).toBe("soccer");
    expect(adapter.kind).toBe("api-football");
  });

  it("returns a shell adapter for non-soccer launch sports", () => {
    const adapter = getProviderAdapter("nba");

    expect(adapter.sportSlug).toBe("nba");
    expect(adapter.kind).toBe("shell");
  });

  it("throws for unknown sports", () => {
    expect(() => getProviderAdapter("cricket")).toThrow("Unsupported provider sport: cricket");
  });
});
