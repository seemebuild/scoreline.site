import { describe, expect, it, vi } from "vitest";

import { persistApiFootballSoccerResults } from "./results-store";

describe("persistApiFootballSoccerResults", () => {
  it("updates event scores and marks final results", async () => {
    const prisma = {
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
        findFirst: vi.fn().mockResolvedValue({ id: "event_1" }),
        update: vi.fn().mockResolvedValue({ id: "event_1" }),
      },
      score: {
        upsert: vi.fn().mockResolvedValue({ id: "score_1" }),
      },
    };

    await persistApiFootballSoccerResults(prisma, [
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

    expect(prisma.score.upsert).toHaveBeenCalledWith({
      where: {
        eventId_period: {
          eventId: "event_1",
          period: "full_time",
        },
      },
      create: {
        eventId: "event_1",
        period: "full_time",
        homeScore: 2,
        awayScore: 1,
        clock: null,
      },
      update: {
        homeScore: 2,
        awayScore: 1,
        clock: null,
      },
    });
  });
});
