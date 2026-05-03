import type { Prisma } from "@prisma/client";

import type { NormalizedProviderResult } from "./results";
import type { EventStatus } from "../status";

type SoccerResultPersistPrismaClient = {
  sport: {
    findUnique: (args: { where: { slug: string } }) => Promise<{ id: string; slug: string } | null>;
  };
  competition: {
    findFirst: (args: { where: { sportId: string; slug: string } }) => Promise<{ id: string } | null>;
  };
  season: {
    findFirst: (args: { where: { competitionId: string; slug: string } }) => Promise<{ id: string } | null>;
  };
  event: {
    findFirst: (args: { where: { sportId: string; slug: string } }) => Promise<{ id: string } | null>;
    update: (args: {
      where: { id: string };
      data: { status?: EventStatus };
    }) => Promise<unknown>;
  };
  score: {
    upsert: (args: {
      where: { eventId_period: { eventId: string; period: string } };
      create: {
        eventId: string;
        period: string;
        homeScore: number | null;
        awayScore: number | null;
        clock: string | null;
      };
      update: {
        homeScore?: number | null;
        awayScore?: number | null;
        clock?: string | null;
      };
    }) => Promise<unknown>;
  };
  providerSnapshot?: {
    create: (args: {
      data: {
        provider: string;
        endpoint: string;
        providerId?: string | null;
        responseJson: Prisma.InputJsonValue;
        fetchedAt?: Date;
      };
    }) => Promise<unknown>;
  };
};

export async function persistApiFootballSoccerResults(
  prisma: SoccerResultPersistPrismaClient,
  results: NormalizedProviderResult[],
): Promise<void> {
  const sport = await prisma.sport.findUnique({ where: { slug: "soccer" } });
  if (!sport) {
    throw new Error("Missing soccer sport row");
  }

  for (const result of results) {
    const competition = await prisma.competition.findFirst({
      where: { sportId: sport.id, slug: "premier-league" },
    });

    if (!competition) {
      continue;
    }

    const event = await prisma.event.findFirst({
      where: {
        sportId: sport.id,
        slug: buildEventSlug(result),
      },
    });

    if (!event) {
      continue;
    }

    await prisma.score.upsert({
      where: {
        eventId_period: {
          eventId: event.id,
          period: "full_time",
        },
      },
      create: {
        eventId: event.id,
        period: "full_time",
        homeScore: result.homeScore,
        awayScore: result.awayScore,
        clock: null,
      },
      update: {
        homeScore: result.homeScore,
        awayScore: result.awayScore,
        clock: null,
      },
    });

    await prisma.event.update({
      where: { id: event.id },
      data: { status: "final" },
    });
  }
}

function buildEventSlug(result: NormalizedProviderResult): string {
  const kickoffDay = result.kickoffAt?.toISOString().slice(0, 10) ?? "unknown-date";
  return [
    kickoffDay,
    result.homeTeamProviderId,
    result.awayTeamProviderId,
    result.fixtureProviderId,
  ].join("-");
}
