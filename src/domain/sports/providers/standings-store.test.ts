import { describe, expect, it, vi } from "vitest";

import { persistApiFootballSoccerStandings } from "./standings-store";

describe("persistApiFootballSoccerStandings", () => {
  it("upserts standings rows by competition, season, and team", async () => {
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
      team: {
        findFirst: vi.fn().mockResolvedValue({ id: "team_1" }),
      },
      standing: {
        upsert: vi.fn().mockResolvedValue({ id: "standing_1" }),
      },
    };

    await persistApiFootballSoccerStandings(prisma, [
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

    expect(prisma.standing.upsert).toHaveBeenCalledWith({
      where: {
        competitionId_seasonId_teamId: {
          competitionId: "competition_1",
          seasonId: "season_1",
          teamId: "team_1",
        },
      },
      create: {
        competitionId: "competition_1",
        seasonId: "season_1",
        teamId: "team_1",
        rank: 1,
        played: 38,
        won: 28,
        drawn: 4,
        lost: 6,
        points: 88,
      },
      update: {
        rank: 1,
        played: 38,
        won: 28,
        drawn: 4,
        lost: 6,
        points: 88,
      },
    });
  });
});
