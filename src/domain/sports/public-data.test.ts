import { describe, expect, it, vi } from "vitest";

import { getSoccerFixtureRows, getSoccerLiveScoreRows, getSoccerResultRows } from "./public-data";

describe("getSoccerFixtureRows", () => {
  it("loads upcoming soccer fixtures from the database", async () => {
    const prisma = {
      event: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "event_1",
            slug: "2026-05-03-manchester-united-chelsea-event_1",
            kickoffAt: new Date("2026-05-03T15:00:00.000Z"),
            status: "scheduled",
            competition: { name: "Premier League", slug: "premier-league" },
            homeTeam: { name: "Manchester United", slug: "manchester-united" },
            awayTeam: { name: "Chelsea", slug: "chelsea" },
            venue: { name: "Stadium" },
            scores: [],
          },
        ]),
      },
    };

    const rows = await getSoccerFixtureRows(prisma as never);

    expect(rows).toEqual([
      {
        id: "event_1",
        title: "Manchester United vs Chelsea",
        competitionName: "Premier League",
        kickoffAt: new Date("2026-05-03T15:00:00.000Z"),
        status: "scheduled",
      },
    ]);
  });
});

describe("getSoccerLiveScoreRows", () => {
  it("loads live soccer events with score rows", async () => {
    const prisma = {
      event: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "event_1",
            slug: "2026-05-03-manchester-united-chelsea-event_1",
            kickoffAt: new Date("2026-05-03T15:00:00.000Z"),
            status: "live",
            competition: { name: "Premier League", slug: "premier-league" },
            homeTeam: { name: "Manchester United", slug: "manchester-united" },
            awayTeam: { name: "Chelsea", slug: "chelsea" },
            venue: { name: "Stadium" },
            scores: [{ homeScore: 2, awayScore: 1, period: "full_time" }],
          },
        ]),
      },
    };

    const rows = await getSoccerLiveScoreRows(prisma as never);

    expect(rows).toEqual([
      {
        id: "event_1",
        title: "Manchester United vs Chelsea",
        competitionName: "Premier League",
        kickoffAt: new Date("2026-05-03T15:00:00.000Z"),
        status: "live",
        homeScore: 2,
        awayScore: 1,
      },
    ]);
  });
});

describe("getSoccerResultRows", () => {
  it("loads completed soccer events with score rows", async () => {
    const prisma = {
      event: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "event_1",
            slug: "2026-05-03-manchester-united-chelsea-event_1",
            kickoffAt: new Date("2026-05-03T15:00:00.000Z"),
            status: "completed",
            competition: { name: "Premier League", slug: "premier-league" },
            homeTeam: { name: "Manchester United", slug: "manchester-united" },
            awayTeam: { name: "Chelsea", slug: "chelsea" },
            venue: { name: "Stadium" },
            scores: [{ homeScore: 3, awayScore: 2, period: "full_time" }],
          },
        ]),
      },
    };

    const rows = await getSoccerResultRows(prisma as never);

    expect(rows).toEqual([
      {
        id: "event_1",
        title: "Manchester United vs Chelsea",
        competitionName: "Premier League",
        kickoffAt: new Date("2026-05-03T15:00:00.000Z"),
        status: "completed",
        homeScore: 3,
        awayScore: 2,
      },
    ]);
  });
});
