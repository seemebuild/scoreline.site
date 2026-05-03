type PublicEventRow = {
  id: string;
  slug: string;
  kickoffAt: Date;
  status: string;
  competition: { name: string; slug: string } | null;
  homeTeam: { name: string; slug: string } | null;
  awayTeam: { name: string; slug: string } | null;
  venue: { name: string } | null;
  scores: Array<{ homeScore: number | null; awayScore: number | null; period: string }>;
};

type PublicSportsPrismaClient = {
  event: {
    findMany: (args: {
      where: { sport: { slug: string } };
      orderBy: { kickoffAt: "asc" | "desc" }[];
      take: number;
      include: {
        competition: true;
        homeTeam: true;
        awayTeam: true;
        venue: true;
        scores: true;
      };
    }) => Promise<PublicEventRow[]>;
  };
};

export type PublicFixtureRow = {
  id: string;
  title: string;
  competitionName: string | null;
  kickoffAt: Date;
  status: string;
};

export type PublicLiveScoreRow = PublicFixtureRow & {
  homeScore: number | null;
  awayScore: number | null;
};

export async function getSoccerFixtureRows(prisma: PublicSportsPrismaClient): Promise<PublicFixtureRow[]> {
  const rows = await prisma.event.findMany({
    where: { sport: { slug: "soccer" } },
    orderBy: [{ kickoffAt: "asc" }],
    take: 20,
    include: {
      competition: true,
      homeTeam: true,
      awayTeam: true,
      venue: true,
      scores: true,
    },
  });

  return rows.map(mapEventToFixtureRow);
}

export async function getSoccerLiveScoreRows(prisma: PublicSportsPrismaClient): Promise<PublicLiveScoreRow[]> {
  const rows = await prisma.event.findMany({
    where: { sport: { slug: "soccer" } },
    orderBy: [{ kickoffAt: "desc" }],
    take: 20,
    include: {
      competition: true,
      homeTeam: true,
      awayTeam: true,
      venue: true,
      scores: true,
    },
  });

  return rows
    .filter((row) => row.status === "live")
    .map((row) => ({
      ...mapEventToFixtureRow(row),
      homeScore: latestScore(row)?.homeScore ?? null,
      awayScore: latestScore(row)?.awayScore ?? null,
    }));
}

function mapEventToFixtureRow(row: PublicEventRow): PublicFixtureRow {
  return {
    id: row.id,
    title: `${row.homeTeam?.name ?? "Home"} vs ${row.awayTeam?.name ?? "Away"}`,
    competitionName: row.competition?.name ?? null,
    kickoffAt: row.kickoffAt,
    status: row.status,
  };
}

function latestScore(row: PublicEventRow) {
  return row.scores[row.scores.length - 1] ?? null;
}
