import { buildApiFootballSnapshot, mapApiFootballFixture, mapApiFootballLeague } from "./api-football";
import { saveProviderSnapshot, type ProviderSnapshotStorePrismaClient } from "./store";
import type { ProviderSnapshot } from "./types";

type ApiFootballClient = {
  get: <TResponse = unknown>(endpoint: string, params?: Record<string, string | number | boolean | undefined>) => Promise<TResponse>;
};

type SyncApiFootballSoccerDataInput = {
  now: Date;
};

type SyncApiFootballSoccerDataOptions = {
  snapshotStore?: ProviderSnapshotStorePrismaClient;
};

type SyncApiFootballSoccerDataResult = {
  competitions: ReturnType<typeof mapApiFootballLeague>[];
  fixtures: ReturnType<typeof mapApiFootballFixture>[];
  snapshots: ProviderSnapshot[];
};

export async function syncApiFootballSoccerData(
  client: ApiFootballClient,
  input: SyncApiFootballSoccerDataInput,
  options: SyncApiFootballSoccerDataOptions = {},
): Promise<SyncApiFootballSoccerDataResult> {
  const leaguesResponse = await client.get<{ response?: unknown[] }>("leagues");
  const fixturesResponse = await client.get<{ response?: unknown[] }>("fixtures");

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
  ];

  if (options.snapshotStore) {
    for (const snapshot of snapshots) {
      await saveProviderSnapshot(options.snapshotStore, snapshot);
    }
  }

  return {
    competitions,
    fixtures,
    snapshots,
  };
}
