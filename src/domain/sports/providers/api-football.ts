import type { ProviderSnapshot } from "./types";

export type ApiFootballAdapterContext = {
  provider: "api-football";
  sportSlug: string;
};

type ApiFootballLeaguePayload = {
  league?: {
    id?: number | string;
    name?: string;
    type?: string;
    country?: string;
    logo?: string;
  };
  country?: {
    name?: string;
    code?: string;
    flag?: string;
  };
  seasons?: Array<{
    year?: number;
    current?: boolean;
  }>;
};

type ApiFootballFixturePayload = {
  fixture?: {
    id?: number | string;
    referee?: string;
    timezone?: string;
    date?: string;
    timestamp?: number;
    periods?: {
      first?: number | null;
      second?: number | null;
    };
    venue?: {
      id?: number | string;
      name?: string;
      city?: string;
    };
    status?: {
      long?: string;
      short?: string;
      elapsed?: number;
    };
  };
  league?: {
    id?: number | string;
    name?: string;
    country?: string;
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
};

export type NormalizedProviderCompetition = {
  provider: "api-football";
  providerType: "competition";
  providerId: string;
  sportSlug: string;
  name: string;
  slug: string;
  countryName: string | null;
  logoUrl: string | null;
  rawType: string | null;
};

export type NormalizedProviderFixture = {
  provider: "api-football";
  providerType: "fixture";
  providerId: string;
  sportSlug: string;
  competitionProviderId: string | null;
  homeTeamProviderId: string | null;
  awayTeamProviderId: string | null;
  venueProviderId: string | null;
  venueName: string | null;
  venueCity: string | null;
  kickoffAt: Date | null;
  status: "scheduled" | "live" | "finished";
  statusLabel: string | null;
  elapsedMinutes: number | null;
  homeScore: number | null;
  awayScore: number | null;
  rawReferee: string | null;
};

export function mapApiFootballLeague(
  payload: ApiFootballLeaguePayload,
  context: ApiFootballAdapterContext,
): NormalizedProviderCompetition {
  const league = payload.league ?? {};

  return {
    provider: context.provider,
    providerType: "competition",
    providerId: String(league.id ?? ""),
    sportSlug: context.sportSlug,
    name: league.name ?? "",
    slug: slugify(league.name ?? ""),
    countryName: payload.country?.name ?? league.country ?? null,
    logoUrl: league.logo ?? null,
    rawType: league.type ?? null,
  };
}

export function mapApiFootballFixture(
  payload: ApiFootballFixturePayload,
  context: ApiFootballAdapterContext,
): NormalizedProviderFixture {
  const fixture = payload.fixture ?? {};

  return {
    provider: context.provider,
    providerType: "fixture",
    providerId: String(fixture.id ?? ""),
    sportSlug: context.sportSlug,
    competitionProviderId: payload.league?.id != null ? String(payload.league.id) : null,
    homeTeamProviderId: payload.teams?.home?.id != null ? String(payload.teams.home.id) : null,
    awayTeamProviderId: payload.teams?.away?.id != null ? String(payload.teams.away.id) : null,
    venueProviderId: fixture.venue?.id != null ? String(fixture.venue.id) : null,
    venueName: fixture.venue?.name ?? null,
    venueCity: fixture.venue?.city ?? null,
    kickoffAt: fixture.date ? new Date(fixture.date) : null,
    status: mapApiFootballFixtureStatus(fixture.status?.long),
    statusLabel: fixture.status?.long ?? null,
    elapsedMinutes: fixture.status?.elapsed ?? null,
    homeScore: payload.goals?.home ?? null,
    awayScore: payload.goals?.away ?? null,
    rawReferee: fixture.referee ?? null,
  };
}

export function buildApiFootballSnapshot(
  payload: unknown,
  endpoint: string,
  providerId: string | null,
  fetchedAt: Date,
): ProviderSnapshot {
  return {
    provider: "api-football",
    endpoint,
    providerId,
    payload,
    fetchedAt,
  };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapApiFootballFixtureStatus(value?: string): NormalizedProviderFixture["status"] {
  const normalized = value?.toLowerCase() ?? "";

  if (normalized.includes("finished")) {
    return "finished";
  }

  if (normalized.includes("live")) {
    return "live";
  }

  return "scheduled";
}
