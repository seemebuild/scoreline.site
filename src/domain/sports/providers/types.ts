export const PROVIDER_SPORT_TYPES = ["soccer", "nba", "american-football", "baseball", "mma", "tennis", "golf"] as const;

export type ProviderSportType = (typeof PROVIDER_SPORT_TYPES)[number];

export type ProviderSnapshot = {
  provider: string;
  endpoint: string;
  providerId: string | null;
  payload: unknown;
  fetchedAt: Date;
};

export function isProviderSportType(value: string): value is ProviderSportType {
  return PROVIDER_SPORT_TYPES.includes(value as ProviderSportType);
}

export function buildProviderSnapshot(input: ProviderSnapshot): ProviderSnapshot {
  return input;
}
