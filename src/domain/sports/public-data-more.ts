type PublicCompetitionRow = {
  id: string;
  name: string;
  slug: string;
  region: string | null;
  sport: { slug: string };
  seasons: Array<{ id: string }>;
  events: Array<{ id: string }>;
};

type PublicTeamRow = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  countryCode: string | null;
  sport: { slug: string };
  homeEvents: Array<{ id: string }>;
  awayEvents: Array<{ id: string }>;
};

type PublicMorePrismaClient = {
  competition: {
    findMany: (args: {
      where: { sport: { slug: string } };
      include: { sport: true; seasons: true; events: true };
      orderBy: { name: "asc" | "desc" }[];
      take: number;
    }) => Promise<PublicCompetitionRow[]>;
  };
  team: {
    findMany: (args: {
      where: { sport: { slug: string } };
      include: { sport: true; homeEvents: true; awayEvents: true };
      orderBy: { name: "asc" | "desc" }[];
      take: number;
    }) => Promise<PublicTeamRow[]>;
  };
};

export type PublicCompetitionCard = {
  id: string;
  name: string;
  slug: string;
  region: string | null;
  seasonCount: number;
  eventCount: number;
};

export type PublicTeamCard = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  countryCode: string | null;
  eventCount: number;
};

export async function getSoccerCompetitionRows(prisma: PublicMorePrismaClient): Promise<PublicCompetitionCard[]> {
  const rows = await prisma.competition.findMany({
    where: { sport: { slug: "soccer" } },
    include: { sport: true, seasons: true, events: true },
    orderBy: [{ name: "asc" }],
    take: 20,
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    region: row.region,
    seasonCount: row.seasons.length,
    eventCount: row.events.length,
  }));
}

export async function getSoccerTeamRows(prisma: PublicMorePrismaClient): Promise<PublicTeamCard[]> {
  const rows = await prisma.team.findMany({
    where: { sport: { slug: "soccer" } },
    include: { sport: true, homeEvents: true, awayEvents: true },
    orderBy: [{ name: "asc" }],
    take: 20,
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortName: row.shortName,
    countryCode: row.countryCode,
    eventCount: row.homeEvents.length + row.awayEvents.length,
  }));
}
