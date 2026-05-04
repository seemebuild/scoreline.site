import type { JobType } from "../../jobs/types";
import type { ProviderSportType } from "./types";

export type ProviderCapabilities = {
  sportSlug: ProviderSportType;
  competitions: boolean;
  fixtures: boolean;
  standings: boolean;
  results: boolean;
};

const providerCapabilities: Record<ProviderSportType, Omit<ProviderCapabilities, "sportSlug">> = {
  soccer: {
    competitions: true,
    fixtures: true,
    standings: true,
    results: true,
  },
  nba: {
    competitions: false,
    fixtures: false,
    standings: false,
    results: false,
  },
  "american-football": {
    competitions: false,
    fixtures: false,
    standings: false,
    results: false,
  },
  baseball: {
    competitions: false,
    fixtures: false,
    standings: false,
    results: false,
  },
  mma: {
    competitions: false,
    fixtures: false,
    standings: false,
    results: false,
  },
  tennis: {
    competitions: false,
    fixtures: false,
    standings: false,
    results: false,
  },
  golf: {
    competitions: false,
    fixtures: false,
    standings: false,
    results: false,
  },
};

export function getProviderCapabilities(sportSlug: ProviderSportType): ProviderCapabilities {
  return {
    sportSlug,
    ...providerCapabilities[sportSlug],
  };
}

export function supportsProviderJobType(sportSlug: ProviderSportType, jobType: JobType): boolean {
  const capabilities = getProviderCapabilities(sportSlug);

  switch (jobType) {
    case "fixtures.sync":
      return capabilities.fixtures;
    case "standings.sync":
      return capabilities.standings;
    case "results.finalize":
      return capabilities.results;
    case "live-scores.sync":
      return capabilities.fixtures || capabilities.results;
    default:
      return true;
  }
}
