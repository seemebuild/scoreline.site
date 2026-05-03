import { describe, expect, it } from "vitest";

import {
  buildCompetitionPath,
  buildEventPath,
  buildSportPath,
  createSlug,
} from "./routing";

describe("createSlug", () => {
  it("normalizes names into stable lowercase route slugs", () => {
    expect(createSlug("FIFA World Cup 2026")).toBe("fifa-world-cup-2026");
    expect(createSlug("Cote d'Ivoire vs. Ghana")).toBe("cote-d-ivoire-vs-ghana");
    expect(createSlug("  UEFA   Champions League  ")).toBe(
      "uefa-champions-league",
    );
  });
});

describe("sports route builders", () => {
  it("builds canonical public paths for sports and competitions", () => {
    expect(buildSportPath("American Football")).toBe("/sports/american-football");
    expect(buildCompetitionPath("Soccer", "FIFA World Cup")).toBe(
      "/sports/soccer/competitions/fifa-world-cup",
    );
  });

  it("builds event paths with date, teams, and stable event id", () => {
    expect(
      buildEventPath({
        sport: "Soccer",
        kickoff: new Date("2026-06-11T19:00:00.000Z"),
        homeTeam: "Mexico",
        awayTeam: "South Africa",
        eventId: "evt_123",
      }),
    ).toBe("/sports/soccer/events/2026-06-11-mexico-v-south-africa-evt_123");
  });
});
