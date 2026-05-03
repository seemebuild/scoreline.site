import { describe, expect, it } from "vitest";

import { mapApiFootballFixture, mapApiFootballLeague } from "./api-football";

describe("mapApiFootballLeague", () => {
  it("maps a league payload into a normalized competition record", () => {
    const competition = mapApiFootballLeague(
      {
        league: {
          id: 39,
          name: "Premier League",
          type: "League",
          country: "England",
          logo: "https://example.com/epl.png",
        },
        country: { name: "England", code: "GB", flag: "https://example.com/flag.png" },
        seasons: [{ year: 2025, current: true }],
      },
      { provider: "api-football", sportSlug: "soccer" },
    );

    expect(competition).toEqual({
      provider: "api-football",
      providerType: "competition",
      providerId: "39",
      sportSlug: "soccer",
      name: "Premier League",
      slug: "premier-league",
      countryName: "England",
      logoUrl: "https://example.com/epl.png",
      rawType: "League",
    });
  });
});

describe("mapApiFootballFixture", () => {
  it("maps a fixture payload into a normalized event record", () => {
    const fixture = mapApiFootballFixture(
      {
        fixture: {
          id: 1001,
          referee: "John Doe",
          timezone: "UTC",
          date: "2026-05-03T15:00:00+00:00",
          timestamp: 1777820400,
          periods: { first: 1, second: 2 },
          venue: {
            id: 88,
            name: "Stadium",
            city: "London",
          },
          status: {
            long: "Match Finished",
            short: "FT",
            elapsed: 90,
          },
        },
        league: {
          id: 39,
          name: "Premier League",
          country: "England",
        },
        teams: {
          home: { id: 33, name: "Manchester United" },
          away: { id: 49, name: "Chelsea" },
        },
        goals: { home: 2, away: 1 },
      },
      { provider: "api-football", sportSlug: "soccer" },
    );

    expect(fixture).toEqual({
      provider: "api-football",
      providerType: "fixture",
      providerId: "1001",
      sportSlug: "soccer",
      competitionProviderId: "39",
      homeTeamProviderId: "33",
      awayTeamProviderId: "49",
      venueProviderId: "88",
      venueName: "Stadium",
      venueCity: "London",
      kickoffAt: new Date("2026-05-03T15:00:00+00:00"),
      status: "finished",
      statusLabel: "Match Finished",
      elapsedMinutes: 90,
      homeScore: 2,
      awayScore: 1,
      rawReferee: "John Doe",
    });
  });
});
