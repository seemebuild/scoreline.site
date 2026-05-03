import type { Event, Prisma } from "@prisma/client";

import type { NormalizedProviderCompetition, NormalizedProviderFixture } from "./api-football";
import type { ProviderSnapshot } from "./types";
import type { EventStatus } from "../status";

type SoccerPersistPrismaClient = {
  sport: {
    findUnique: (args: { where: { slug: string } }) => Promise<{ id: string; slug: string } | null>;
  };
  competition: {
    upsert: (args: {
      where: { sportId_slug: { sportId: string; slug: string } };
      create: {
        sportId: string;
        name: string;
        slug: string;
        region?: string | null;
      };
      update: {
        name?: string;
        region?: string | null;
      };
    }) => Promise<unknown>;
  };
  event: {
    upsert: (args: {
      where: { sportId_slug: { sportId: string; slug: string } };
      create: {
        sportId: string;
        competitionId: string | null;
        slug: string;
        kickoffAt: Date;
        status: EventStatus;
      };
      update: {
        competitionId?: string | null;
        kickoffAt?: Date;
        status?: EventStatus;
      };
    }) => Promise<unknown>;
  };
  providerMapping: {
    upsert: (args: {
      where: { provider_providerType_providerId: { provider: string; providerType: string; providerId: string } };
      create: {
        provider: string;
        providerType: string;
        providerId: string;
        eventId?: string | null;
      };
      update: {
        eventId?: string | null;
      };
    }) => Promise<unknown>;
  };
  providerSnapshot: {
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

type SoccerPersistInput = {
  competitions: NormalizedProviderCompetition[];
  fixtures: NormalizedProviderFixture[];
  snapshots: ProviderSnapshot[];
};

export async function persistApiFootballSoccerSync(
  prisma: SoccerPersistPrismaClient,
  input: SoccerPersistInput,
): Promise<{
  sportId: string;
}> {
  const sport = await prisma.sport.findUnique({ where: { slug: "soccer" } });
  if (!sport) {
    throw new Error("Missing soccer sport row");
  }

  const competitionIdsByProviderId = new Map<string, string>();

  for (const competition of input.competitions) {
    const result = await prisma.competition.upsert({
      where: {
        sportId_slug: {
          sportId: sport.id,
          slug: competition.slug,
        },
      },
      create: {
        sportId: sport.id,
        name: competition.name,
        slug: competition.slug,
        region: competition.countryName,
      },
      update: {
        name: competition.name,
        region: competition.countryName,
      },
    });

    competitionIdsByProviderId.set(competition.providerId, (result as { id: string }).id);
  }

  for (const fixture of input.fixtures) {
    const competitionId = fixture.competitionProviderId
      ? competitionIdsByProviderId.get(fixture.competitionProviderId) ?? null
      : null;

    const slug = buildEventSlug(fixture);
    const event = await prisma.event.upsert({
      where: {
        sportId_slug: {
          sportId: sport.id,
          slug,
        },
      },
      create: {
        sportId: sport.id,
        competitionId,
        slug,
        kickoffAt: fixture.kickoffAt ?? new Date(),
        status: mapFixtureStatusToEventStatus(fixture.status),
      },
      update: {
        competitionId,
        kickoffAt: fixture.kickoffAt ?? new Date(),
        status: mapFixtureStatusToEventStatus(fixture.status),
      },
    });

    await prisma.providerMapping.upsert({
      where: {
        provider_providerType_providerId: {
          provider: fixture.provider,
          providerType: fixture.providerType,
          providerId: fixture.providerId,
        },
      },
      create: {
        provider: fixture.provider,
        providerType: fixture.providerType,
        providerId: fixture.providerId,
        eventId: (event as Event).id,
      },
      update: {
        eventId: (event as Event).id,
      },
    });
  }

  for (const snapshot of input.snapshots) {
    await prisma.providerSnapshot.create({
      data: {
        provider: snapshot.provider,
        endpoint: snapshot.endpoint,
        providerId: snapshot.providerId,
        responseJson: snapshot.payload as Prisma.InputJsonValue,
        fetchedAt: snapshot.fetchedAt,
      },
    });
  }

  return {
    sportId: sport.id,
  };
}

function mapFixtureStatusToEventStatus(status: NormalizedProviderFixture["status"]): EventStatus {
  if (status === "finished") {
    return "final";
  }

  if (status === "live") {
    return "live";
  }

  return "scheduled";
}

function buildEventSlug(fixture: NormalizedProviderFixture): string {
  const kickoffDay = fixture.kickoffAt?.toISOString().slice(0, 10) ?? "unknown-date";
  return [
    kickoffDay,
    fixture.homeTeamProviderId ?? "home",
    fixture.awayTeamProviderId ?? "away",
    fixture.providerId,
  ].join("-");
}
