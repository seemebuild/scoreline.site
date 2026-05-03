import type { NormalizedProviderStanding } from "./standings";

type SoccerStandingPersistPrismaClient = {
  sport: {
    findUnique: (args: { where: { slug: string } }) => Promise<{ id: string; slug: string } | null>;
  };
  competition: {
    findFirst: (args: { where: { sportId: string; slug: string } }) => Promise<{ id: string } | null>;
  };
  season: {
    findFirst: (args: { where: { competitionId: string; slug: string } }) => Promise<{ id: string } | null>;
  };
  team: {
    findFirst: (args: { where: { sportId: string; slug: string } }) => Promise<{ id: string } | null>;
  };
  standing: {
    upsert: (args: {
      where: {
        competitionId_seasonId_teamId: {
          competitionId: string;
          seasonId: string | null;
          teamId: string;
        };
      };
      create: {
        competitionId: string;
        seasonId: string | null;
        teamId: string;
        rank: number;
        played: number;
        won: number;
        drawn: number;
        lost: number;
        points: number;
      };
      update: {
        rank?: number;
        played?: number;
        won?: number;
        drawn?: number;
        lost?: number;
        points?: number;
      };
    }) => Promise<unknown>;
  };
};

export async function persistApiFootballSoccerStandings(
  prisma: SoccerStandingPersistPrismaClient,
  standings: NormalizedProviderStanding[],
): Promise<void> {
  const sport = await prisma.sport.findUnique({ where: { slug: "soccer" } });
  if (!sport) {
    throw new Error("Missing soccer sport row");
  }

  for (const standing of standings) {
    const competition = await prisma.competition.findFirst({
      where: { sportId: sport.id, slug: "premier-league" },
    });

    if (!competition) {
      continue;
    }

    const season = await prisma.season.findFirst({
      where: { competitionId: competition.id, slug: standing.seasonProviderId },
    });

    const team = await prisma.team.findFirst({
      where: { sportId: sport.id, slug: teamSlugFromProviderId(standing.teamProviderId) },
    });

    if (!team) {
      continue;
    }

    await prisma.standing.upsert({
      where: {
        competitionId_seasonId_teamId: {
          competitionId: competition.id,
          seasonId: season?.id ?? null,
          teamId: team.id,
        },
      },
      create: {
        competitionId: competition.id,
        seasonId: season?.id ?? null,
        teamId: team.id,
        rank: standing.rank,
        played: standing.played,
        won: standing.won,
        drawn: standing.drawn,
        lost: standing.lost,
        points: standing.points,
      },
      update: {
        rank: standing.rank,
        played: standing.played,
        won: standing.won,
        drawn: standing.drawn,
        lost: standing.lost,
        points: standing.points,
      },
    });
  }
}

function teamSlugFromProviderId(providerId: string): string {
  return providerId;
}
