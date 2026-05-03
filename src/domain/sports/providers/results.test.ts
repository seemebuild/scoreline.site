import { describe, expect, it } from "vitest";

import { mapApiFootballResults } from "./results";

describe("mapApiFootballResults", () => {
  it("maps finished fixtures into normalized result records", () => {
    const results = mapApiFootballResults(
      {
        league: {
          id: 39,
          season: 2025,
        },
        fixtures: [
          {
            fixture: {
              id: 1001,
              date: "2026-05-03T15:00:00+00:00",
              status: { long: "Match Finished" },
            },
            teams: {
              home: { id: 33, name: "Manchester United" },
              away: { id: 49, name: "Chelsea" },
            },
            goals: {
              home: 2,
              away: 1,
            },
          },
        ],
      },
      { provider: "api-football", sportSlug: "soccer" },
    );

    expect(results).toEqual([
      {
        provider: "api-football",
        providerType: "result",
        providerId: "39-2025-1001",
        sportSlug: "soccer",
        competitionProviderId: "39",
        seasonProviderId: "2025",
        fixtureProviderId: "1001",
        homeTeamProviderId: "33",
        awayTeamProviderId: "49",
        kickoffAt: new Date("2026-05-03T15:00:00+00:00"),
        homeScore: 2,
        awayScore: 1,
      },
    ]);
  });
});
