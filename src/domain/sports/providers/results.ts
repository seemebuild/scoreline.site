type ApiFootballResultsPayload = {
  league?: {
    id?: number | string;
    season?: number | string;
  };
  fixtures?: Array<{
    fixture?: {
      id?: number | string;
      date?: string;
      status?: {
        long?: string;
      };
    };
    teams?: {
      home?: {
        id?: number | string;
        name?: string;
      };
      away?: {
        id?: number | string;
        name?: string;
      };
    };
    goals?: {
      home?: number | null;
      away?: number | null;
    };
  }>;
};

type ApiFootballAdapterContext = {
  provider: "api-football";
  sportSlug: string;
};

export type NormalizedProviderResult = {
  provider: "api-football";
  providerType: "result";
  providerId: string;
  sportSlug: string;
  competitionProviderId: string;
  seasonProviderId: string;
  fixtureProviderId: string;
  homeTeamProviderId: string;
  awayTeamProviderId: string;
  kickoffAt: Date | null;
  homeScore: number | null;
  awayScore: number | null;
};

export function mapApiFootballResults(
  payload: ApiFootballResultsPayload,
  context: ApiFootballAdapterContext,
): NormalizedProviderResult[] {
  const competitionId = payload.league?.id != null ? String(payload.league.id) : "";
  const seasonId = payload.league?.season != null ? String(payload.league.season) : "";

  return (payload.fixtures ?? []).flatMap((entry) => {
    const fixtureId = entry.fixture?.id != null ? String(entry.fixture.id) : "";
    const homeTeamId = entry.teams?.home?.id != null ? String(entry.teams.home.id) : "";
    const awayTeamId = entry.teams?.away?.id != null ? String(entry.teams.away.id) : "";

    if (!competitionId || !seasonId || !fixtureId || !homeTeamId || !awayTeamId) {
      return [];
    }

    return [
      {
        provider: context.provider,
        providerType: "result",
        providerId: `${competitionId}-${seasonId}-${fixtureId}`,
        sportSlug: context.sportSlug,
        competitionProviderId: competitionId,
        seasonProviderId: seasonId,
        fixtureProviderId: fixtureId,
        homeTeamProviderId: homeTeamId,
        awayTeamProviderId: awayTeamId,
        kickoffAt: entry.fixture?.date ? new Date(entry.fixture.date) : null,
        homeScore: entry.goals?.home ?? null,
        awayScore: entry.goals?.away ?? null,
      },
    ];
  });
}
