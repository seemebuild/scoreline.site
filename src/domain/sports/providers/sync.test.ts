import { describe, expect, it, vi } from "vitest";

import { syncApiFootballSoccerData } from "./sync";

describe("syncApiFootballSoccerData", () => {
  it("maps competitions and fixtures from provider payloads", async () => {
    const create = vi.fn().mockResolvedValue({ id: "snapshot_1" });
    const competitionUpsert = vi.fn().mockResolvedValue({ id: "competition_1" });
    const eventUpsert = vi.fn().mockResolvedValue({ id: "event_1" });
    const providerMappingUpsert = vi.fn().mockResolvedValue({ id: "mapping_1" });
    const client = {
      get: vi.fn().mockImplementation(async (endpoint: string) => {
        if (endpoint === "leagues") {
          return {
            response: [
              {
                league: { id: 39, name: "Premier League", type: "League", country: "England" },
                country: { name: "England" },
              },
            ],
          };
        }

        if (endpoint === "fixtures") {
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
        }

        throw new Error(`Unexpected endpoint ${endpoint}`);
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
      },
      providerMapping: {
        upsert: providerMappingUpsert,
      },
      providerSnapshot: {
        create,
      },
    };

    const result = await syncApiFootballSoccerData(client, {
      now: new Date("2026-05-03T10:00:00.000Z"),
    }, {
      persistenceStore,
    });

    expect(result.competitions).toHaveLength(1);
    expect(result.fixtures).toHaveLength(1);
    expect(result.snapshots).toHaveLength(2);
    expect(create).toHaveBeenCalledTimes(2);
    expect(competitionUpsert).toHaveBeenCalledTimes(1);
    expect(eventUpsert).toHaveBeenCalledTimes(1);
    expect(providerMappingUpsert).toHaveBeenCalledTimes(1);
  });
});
