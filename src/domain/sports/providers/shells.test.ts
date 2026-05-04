import { describe, expect, it } from "vitest";

import {
  createAmericanFootballProviderShell,
  createBaseballProviderShell,
  createGolfProviderShell,
  createMmaProviderShell,
  createNbaProviderShell,
  createTennisProviderShell,
} from "./shells";

describe("provider shells", () => {
  it("expose explicit unsupported adapters for non-soccer launch sports", () => {
    expect(createNbaProviderShell().sportSlug).toBe("nba");
    expect(createAmericanFootballProviderShell().sportSlug).toBe("american-football");
    expect(createBaseballProviderShell().sportSlug).toBe("baseball");
    expect(createMmaProviderShell().sportSlug).toBe("mma");
    expect(createTennisProviderShell().sportSlug).toBe("tennis");
    expect(createGolfProviderShell().sportSlug).toBe("golf");
  });
});
