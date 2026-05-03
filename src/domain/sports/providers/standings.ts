type ApiFootballStandingsPayload = {
  league?: {
    id?: number | string;
    name?: string;
    season?: number | string;
  };
  standings?: Array<
    Array<{
      rank?: number;
      team?: {
        id?: number | string;
        name?: string;
      };
      points?: number;
      all?: {
        played?: number;
        win?: number;
        draw?: number;
        lose?: number;
      };
    }>
  >;
};

type ApiFootballAdapterContext = {
  provider: "api-football";
  sportSlug: string;
};

export type NormalizedProviderStanding = {
  provider: "api-football";
  providerType: "standing";
  providerId: string;
  sportSlug: string;
  competitionProviderId: string;
  seasonProviderId: string;
  teamProviderId: string;
  rank: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
};

export function mapApiFootballStandings(
  payload: ApiFootballStandingsPayload,
  context: ApiFootballAdapterContext,
): NormalizedProviderStanding[] {
  const leagueId = payload.league?.id != null ? String(payload.league.id) : "";
  const seasonId = payload.league?.season != null ? String(payload.league.season) : "";

  return (payload.standings ?? [])
    .flat()
    .flatMap((entry) => {
      const teamId = entry.team?.id != null ? String(entry.team.id) : "";

      if (!leagueId || !seasonId || !teamId) {
        return [];
      }

      return [
        {
          provider: context.provider,
          providerType: "standing",
          providerId: `${leagueId}-${seasonId}-${teamId}`,
          sportSlug: context.sportSlug,
          competitionProviderId: leagueId,
          seasonProviderId: seasonId,
          teamProviderId: teamId,
          rank: entry.rank ?? 0,
          played: entry.all?.played ?? 0,
          won: entry.all?.win ?? 0,
          drawn: entry.all?.draw ?? 0,
          lost: entry.all?.lose ?? 0,
          points: entry.points ?? 0,
        },
      ];
    });
}
