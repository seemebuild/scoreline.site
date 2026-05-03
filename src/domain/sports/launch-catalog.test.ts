import { describe, expect, it } from "vitest";

import {
  LAUNCH_SOCCER_COMPETITIONS,
  LAUNCH_SPORTS,
  getLaunchSport,
} from "./launch-catalog";

describe("LAUNCH_SPORTS", () => {
  it("contains the complete launch sport set with canonical slugs", () => {
    expect(LAUNCH_SPORTS.map((sport) => sport.slug)).toEqual([
      "soccer",
      "nba",
      "american-football",
      "baseball",
      "mma",
      "tennis",
      "golf",
    ]);
  });
});

describe("LAUNCH_SOCCER_COMPETITIONS", () => {
  it("contains must-have launch soccer competitions", () => {
    expect(LAUNCH_SOCCER_COMPETITIONS.map((competition) => competition.slug)).toEqual([
      "fifa-world-cup",
      "world-cup-qualifiers",
      "uefa-champions-league",
      "premier-league",
      "la-liga",
      "serie-a",
      "bundesliga",
      "ligue-1",
      "mls",
      "afcon",
    ]);
  });

  it("uses unique slugs and assigns each competition to soccer", () => {
    const slugs = LAUNCH_SOCCER_COMPETITIONS.map(
      (competition) => competition.slug,
    );

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(
      LAUNCH_SOCCER_COMPETITIONS.every(
        (competition) => competition.sportSlug === "soccer",
      ),
    ).toBe(true);
  });
});

describe("getLaunchSport", () => {
  it("returns launch sport metadata by slug", () => {
    expect(getLaunchSport("soccer")).toEqual({
      name: "Soccer",
      slug: "soccer",
    });
  });
});
