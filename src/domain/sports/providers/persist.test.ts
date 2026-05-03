import { describe, expect, it, vi } from "vitest";

import { persistApiFootballSoccerSync } from "./persist";

describe("persistApiFootballSoccerSync", () => {
  it("writes normalized competitions, events, mappings, and snapshots", async () => {
    const prisma = {
      sport: {
        findUnique: vi.fn().mockResolvedValue({ id: "sport_1", slug: "soccer" }),
      },
      competition: {
        upsert: vi.fn().mockResolvedValue({ id: "competition_1" }),
      },
      event: {
        upsert: vi.fn().mockResolvedValue({ id: "event_1" }),
      },
      providerMapping: {
        upsert: vi.fn().mockResolvedValue({ id: "mapping_1" }),
      },
      providerSnapshot: {
        create: vi.fn().mockResolvedValue({ id: "snapshot_1" }),
      },
    };

    const result = await persistApiFootballSoccerSync(prisma, {
      competitions: [
        {
          provider: "api-football",
          providerType: "competition",
          providerId: "39",
          sportSlug: "soccer",
          name: "Premier League",
          slug: "premier-league",
          countryName: "England",
          logoUrl: null,
          rawType: "League",
        },
      ],
      fixtures: [
        {
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
        },
      ],
      snapshots: [
        {
          provider: "api-football",
          endpoint: "leagues",
          providerId: null,
          payload: { response: [] },
          fetchedAt: new Date("2026-05-03T10:00:00.000Z"),
        },
      ],
    });

    expect(result.sportId).toBe("sport_1");
    expect(prisma.competition.upsert).toHaveBeenCalledTimes(1);
    expect(prisma.event.upsert).toHaveBeenCalledTimes(1);
    expect(prisma.providerMapping.upsert).toHaveBeenCalledTimes(1);
    expect(prisma.providerSnapshot.create).toHaveBeenCalledTimes(1);
  });
});
