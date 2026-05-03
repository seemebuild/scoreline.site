import { describe, expect, it, vi } from "vitest";

import { syncApiFootballSoccerData } from "./sync";

describe("syncApiFootballSoccerData", () => {
  it("maps competitions and fixtures from provider payloads", async () => {
    const create = vi.fn().mockResolvedValue({ id: "snapshot_1" });
    const competitionUpsert = vi.fn().mockResolvedValue({ id: "competition_1" });
    const eventUpsert = vi.fn().mockResolvedValue({ id: "event_1" });
    const providerMappingUpsert = vi.fn().mockResolvedValue({ id: "mapping_1" });
    const standingUpsert = vi.fn().mockResolvedValue({ id: "standing_1" });
    const scoreUpsert = vi.fn().mockResolvedValue({ id: "score_1" });
    const eventFindFirst = vi.fn().mockResolvedValue({ id: "event_1" });
    const eventUpdate = vi.fn().mockResolvedValue({ id: "event_1" });
    const client = {
      getLeagues: vi.fn().mockImplementation(async () => {
          return {
            response: [
              {
                league: { id: 39, name: "Premier League", type: "League", country: "England" },
                country: { name: "England" },
              },
            ],
          };
      }),
      getFixtures: vi.fn().mockImplementation(async () => {
          return {
            response: [
              {
                fixture: {
                  id: 1001,
                  date: "2026-05-03T15:00:00+00:00",
                  venue: { id: 88, name: "Stadium", city: "London" },
                  status: { long: "Match Finished", elapsed: 90 },
                },
                league: { id: 39, name: "Premier League" },
                teams: { home: { id: 33 }, away: { id: 49 } },
                goals: { home: 2, away: 1 },
              },
            ],
          };
      }),
      getStandings: vi.fn().mockImplementation(async () => {
          return {
            response: [
              {
                league: { id: 39, season: 2025 },
                standings: [
                  [
                    {
                      rank: 1,
                      team: { id: 33 },
                      points: 88,
                      all: { played: 38, win: 28, draw: 4, lose: 6 },
                    },
                  ],
                ],
              },
            ],
          };
      }),
      getResults: vi.fn().mockImplementation(async () => {
          return {
            response: [
              {
                league: { id: 39, season: 2025 },
                fixtures: [
                  {
                    fixture: {
                      id: 1001,
                      date: "2026-05-03T15:00:00+00:00",
                    },
                    teams: { home: { id: 33 }, away: { id: 49 } },
                    goals: { home: 2, away: 1 },
                  },
                ],
              },
            ],
          };
      }),
    };
    const persistenceStore = {
      sport: {
        findUnique: vi.fn().mockResolvedValue({ id: "sport_1", slug: "soccer" }),
      },
      competition: {
        upsert: competitionUpsert,
      },
      event: {
        upsert: eventUpsert,
        findFirst: eventFindFirst,
        update: eventUpdate,
      },
      providerMapping: {
        upsert: providerMappingUpsert,
      },
      providerSnapshot: {
        create,
      },
      standing: {
        upsert: standingUpsert,
      },
      score: {
        upsert: scoreUpsert,
      },
    };

    const result = await syncApiFootballSoccerData(client, {
      now: new Date("2026-05-03T10:00:00.000Z"),
    }, {
      persistenceStore,
      standingsStore: {
        sport: {
          findUnique: vi.fn().mockResolvedValue({ id: "sport_1", slug: "soccer" }),
        },
        competition: {
          findFirst: vi.fn().mockResolvedValue({ id: "competition_1" }),
        },
        season: {
          findFirst: vi.fn().mockResolvedValue({ id: "season_1" }),
        },
        team: {
          findFirst: vi.fn().mockResolvedValue({ id: "team_1" }),
        },
        standing: {
          upsert: standingUpsert,
        },
      },
      resultsStore: {
        sport: {
          findUnique: vi.fn().mockResolvedValue({ id: "sport_1", slug: "soccer" }),
        },
        competition: {
          findFirst: vi.fn().mockResolvedValue({ id: "competition_1" }),
        },
        season: {
          findFirst: vi.fn().mockResolvedValue({ id: "season_1" }),
        },
        event: {
          findFirst: eventFindFirst,
          update: eventUpdate,
        },
        score: {
          upsert: scoreUpsert,
        },
      },
    });

    expect(result.competitions).toHaveLength(1);
    expect(result.fixtures).toHaveLength(1);
    expect(result.standings).toHaveLength(1);
    expect(result.results).toHaveLength(1);
    expect(result.snapshots).toHaveLength(4);
    expect(create).toHaveBeenCalledTimes(4);
    expect(competitionUpsert).toHaveBeenCalledTimes(1);
    expect(eventUpsert).toHaveBeenCalledTimes(1);
    expect(providerMappingUpsert).toHaveBeenCalledTimes(1);
    expect(standingUpsert).toHaveBeenCalledTimes(1);
    expect(scoreUpsert).toHaveBeenCalledTimes(1);
    expect(eventUpdate).toHaveBeenCalledTimes(1);
  });
});
