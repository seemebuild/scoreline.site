import { buildApiFootballSnapshot, mapApiFootballFixture, mapApiFootballLeague } from "./api-football";
import { mapApiFootballStandings } from "./standings";
import { persistApiFootballSoccerSync } from "./persist";
import { persistApiFootballSoccerStandings } from "./standings-store";
import type { ProviderSnapshot } from "./types";

type ApiFootballClient = {
  getLeagues: <TResponse = unknown>(params?: Record<string, string | number | boolean | undefined>) => Promise<TResponse>;
  getFixtures: <TResponse = unknown>(params?: Record<string, string | number | boolean | undefined>) => Promise<TResponse>;
  getStandings: <TResponse = unknown>(params?: Record<string, string | number | boolean | undefined>) => Promise<TResponse>;
};

type SyncApiFootballSoccerDataInput = {
  now: Date;
};

type SyncApiFootballSoccerDataOptions = {
  persistenceStore?: Parameters<typeof persistApiFootballSoccerSync>[0];
  standingsStore?: Parameters<typeof persistApiFootballSoccerStandings>[0];
};

type SyncApiFootballSoccerDataResult = {
  competitions: ReturnType<typeof mapApiFootballLeague>[];
  fixtures: ReturnType<typeof mapApiFootballFixture>[];
  standings: ReturnType<typeof mapApiFootballStandings>;
  snapshots: ProviderSnapshot[];
};

export async function syncApiFootballSoccerData(
  client: ApiFootballClient,
  input: SyncApiFootballSoccerDataInput,
  options: SyncApiFootballSoccerDataOptions = {},
): Promise<SyncApiFootballSoccerDataResult> {
  const leaguesResponse = await client.getLeagues<{ response?: unknown[] }>();
  const fixturesResponse = await client.getFixtures<{ response?: unknown[] }>();
  const standingsResponse = await client.getStandings<{ response?: unknown[] }>();

  const competitions = (leaguesResponse.response ?? []).map((item) =>
    mapApiFootballLeague(item as Parameters<typeof mapApiFootballLeague>[0], {
      provider: "api-football",
      sportSlug: "soccer",
    }),
  );

  const fixtures = (fixturesResponse.response ?? []).map((item) =>
    mapApiFootballFixture(item as Parameters<typeof mapApiFootballFixture>[0], {
      provider: "api-football",
      sportSlug: "soccer",
    }),
  );

  const snapshots = [
    buildApiFootballSnapshot(leaguesResponse, "leagues", null, input.now),
    buildApiFootballSnapshot(fixturesResponse, "fixtures", null, input.now),
    buildApiFootballSnapshot(standingsResponse, "standings", null, input.now),
  ];

  const standings = (standingsResponse.response ?? []).flatMap((item) =>
    mapApiFootballStandings(item as Parameters<typeof mapApiFootballStandings>[0], {
      provider: "api-football",
      sportSlug: "soccer",
    }),
  );

  if (options.persistenceStore) {
    await persistApiFootballSoccerSync(options.persistenceStore, {
      competitions,
      fixtures,
      snapshots,
    });
  }

  if (options.standingsStore) {
    await persistApiFootballSoccerStandings(options.standingsStore, standings);
  }

  return {
    competitions,
    fixtures,
    standings,
    snapshots,
  };
}
