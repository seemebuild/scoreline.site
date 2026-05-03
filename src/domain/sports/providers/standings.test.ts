import { describe, expect, it } from "vitest";

import { mapApiFootballStandings } from "./standings";

describe("mapApiFootballStandings", () => {
  it("maps standings payloads into normalized records", () => {
    const standings = mapApiFootballStandings(
      {
        league: {
          id: 39,
          name: "Premier League",
          season: 2025,
        },
        standings: [
          [
            {
              rank: 1,
              team: {
                id: 33,
                name: "Manchester United",
              },
              points: 88,
              all: {
                played: 38,
                win: 28,
                draw: 4,
                lose: 6,
              },
            },
          ],
        ],
      },
      { provider: "api-football", sportSlug: "soccer" },
    );

    expect(standings).toEqual([
      {
        provider: "api-football",
        providerType: "standing",
        providerId: "39-2025-33",
        sportSlug: "soccer",
        competitionProviderId: "39",
        seasonProviderId: "2025",
        teamProviderId: "33",
        rank: 1,
        played: 38,
        won: 28,
        drawn: 4,
        lost: 6,
        points: 88,
      },
    ]);
  });
});
