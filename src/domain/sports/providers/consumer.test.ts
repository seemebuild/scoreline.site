import { describe, expect, it } from "vitest";

import { buildProviderJobPlan } from "./consumer";

describe("buildProviderJobPlan", () => {
  it("filters unsupported jobs for shell sports", () => {
    expect(buildProviderJobPlan("nba", ["fixtures.sync", "results.finalize", "algolia.index"])).toEqual(["algolia.index"]);
    expect(buildProviderJobPlan("soccer", ["fixtures.sync", "results.finalize", "algolia.index"])).toEqual([
      "fixtures.sync",
      "results.finalize",
      "algolia.index",
    ]);
  });
});
