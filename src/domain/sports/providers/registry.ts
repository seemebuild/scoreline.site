import { createApiFootballClient } from "./client";
import {
  createAmericanFootballProviderShell,
  createBaseballProviderShell,
  createGolfProviderShell,
  createMmaProviderShell,
  createNbaProviderShell,
  createTennisProviderShell,
} from "./shells";
import { isProviderSportType, type ProviderSportType } from "./types";

export type ProviderAdapter =
  | {
      kind: "api-football";
      sportSlug: "soccer";
      client: ReturnType<typeof createApiFootballClient>;
    }
  | {
      kind: "shell";
      sportSlug: Exclude<ProviderSportType, "soccer">;
      adapter: ReturnType<
        | typeof createNbaProviderShell
        | typeof createAmericanFootballProviderShell
        | typeof createBaseballProviderShell
        | typeof createMmaProviderShell
        | typeof createTennisProviderShell
        | typeof createGolfProviderShell
      >;
    };

export function isSupportedProviderSport(value: string): value is ProviderSportType {
  return isProviderSportType(value);
}

export function getProviderAdapter(sportSlug: string): ProviderAdapter {
  if (!isProviderSportType(sportSlug)) {
    throw new Error(`Unsupported provider sport: ${sportSlug}`);
  }

  if (sportSlug === "soccer") {
    return {
      kind: "api-football",
      sportSlug,
      client: createApiFootballClient({
        apiKey: "placeholder",
        baseUrl: "https://v3.football.api-sports.io",
      }),
    };
  }

  return {
    kind: "shell",
    sportSlug,
    adapter: getShellAdapter(sportSlug),
  };
}

function getShellAdapter(sportSlug: Exclude<ProviderSportType, "soccer">) {
  switch (sportSlug) {
    case "nba":
      return createNbaProviderShell();
    case "american-football":
      return createAmericanFootballProviderShell();
    case "baseball":
      return createBaseballProviderShell();
    case "mma":
      return createMmaProviderShell();
    case "tennis":
      return createTennisProviderShell();
    case "golf":
      return createGolfProviderShell();
  }
}
