import { describe, expect, it, vi } from "vitest";

import { getSoccerCompetitionRows, getSoccerTeamRows } from "./public-data-more";

describe("getSoccerCompetitionRows", () => {
  it("loads competition rows from the database", async () => {
    const prisma = {
      competition: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "competition_1",
            name: "Premier League",
            slug: "premier-league",
            region: "England",
            sport: { slug: "soccer" },
            seasons: [{ id: "season_1", name: "2025/26", slug: "2025-26" }],
            events: [{ id: "event_1" }],
          },
        ]),
      },
    };

    const rows = await getSoccerCompetitionRows(prisma as never);

    expect(rows).toEqual([
      {
        id: "competition_1",
        name: "Premier League",
        slug: "premier-league",
        region: "England",
        seasonCount: 1,
        eventCount: 1,
      },
    ]);
  });
});

describe("getSoccerTeamRows", () => {
  it("loads team rows from the database", async () => {
    const prisma = {
      team: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "team_1",
            name: "Manchester United",
            slug: "manchester-united",
            shortName: "Man Utd",
            countryCode: "GB",
            sport: { slug: "soccer" },
            homeEvents: [{ id: "event_1" }],
            awayEvents: [{ id: "event_2" }],
          },
        ]),
      },
    };

    const rows = await getSoccerTeamRows(prisma as never);

    expect(rows).toEqual([
      {
        id: "team_1",
        name: "Manchester United",
        slug: "manchester-united",
        shortName: "Man Utd",
        countryCode: "GB",
        eventCount: 2,
      },
    ]);
  });
});
