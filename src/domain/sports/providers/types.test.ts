import { describe, expect, it } from "vitest";

import { buildProviderSnapshot, isProviderSportType } from "./types";

describe("isProviderSportType", () => {
  it("accepts supported sport types", () => {
    expect(isProviderSportType("soccer")).toBe(true);
    expect(isProviderSportType("nba")).toBe(true);
  });

  it("rejects unknown sport types", () => {
    expect(isProviderSportType("cricket")).toBe(false);
  });
});

describe("buildProviderSnapshot", () => {
  it("captures provider metadata and payload details", () => {
    const snapshot = buildProviderSnapshot({
      provider: "api-football",
      endpoint: "fixtures",
      providerId: "123",
      payload: { foo: "bar" },
      fetchedAt: new Date("2026-05-03T10:00:00.000Z"),
    });

    expect(snapshot).toEqual({
      provider: "api-football",
      endpoint: "fixtures",
      providerId: "123",
      payload: { foo: "bar" },
      fetchedAt: new Date("2026-05-03T10:00:00.000Z"),
    });
  });
});
