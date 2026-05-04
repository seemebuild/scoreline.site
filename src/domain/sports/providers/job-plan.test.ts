import { describe, expect, it } from "vitest";

import { buildProviderSyncJobPlan } from "./job-plan";

describe("buildProviderSyncJobPlan", () => {
  it("includes only supported soccer jobs", () => {
    expect(buildProviderSyncJobPlan("soccer")).toEqual([
      "fixtures.sync",
      "standings.sync",
      "results.finalize",
      "live-scores.sync",
    ]);
  });

  it("falls back to supported non-provider jobs only for shell sports", () => {
    expect(buildProviderSyncJobPlan("nba")).toEqual([]);
  });
});
