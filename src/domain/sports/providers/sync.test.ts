import { describe, expect, it, vi } from "vitest";

import { syncApiFootballSoccerData } from "./sync";

describe("syncApiFootballSoccerData", () => {
  it("maps competitions and fixtures from provider payloads", async () => {
    const create = vi.fn().mockResolvedValue({ id: "snapshot_1" });
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
    const snapshotStore = {
      providerSnapshot: {
        create,
      },
    };

    const result = await syncApiFootballSoccerData(client, {
      now: new Date("2026-05-03T10:00:00.000Z"),
    }, {
      snapshotStore,
    });

    expect(result.competitions).toHaveLength(1);
    expect(result.fixtures).toHaveLength(1);
    expect(result.snapshots).toHaveLength(2);
    expect(create).toHaveBeenCalledTimes(2);
  });
});
