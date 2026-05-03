type ProviderShell = {
  sportSlug: string;
  fetchCompetitions: () => Promise<never>;
  fetchFixtures: () => Promise<never>;
  fetchStandings: () => Promise<never>;
};

function createProviderShell(sportSlug: string): ProviderShell {
  return {
    sportSlug,
    fetchCompetitions: unsupported,
    fetchFixtures: unsupported,
    fetchStandings: unsupported,
  };
}

export function createNbaProviderShell(): ProviderShell {
  return createProviderShell("nba");
}

export function createAmericanFootballProviderShell(): ProviderShell {
  return createProviderShell("american-football");
}

export function createBaseballProviderShell(): ProviderShell {
  return createProviderShell("baseball");
}

export function createMmaProviderShell(): ProviderShell {
  return createProviderShell("mma");
}

export function createTennisProviderShell(): ProviderShell {
  return createProviderShell("tennis");
}

export function createGolfProviderShell(): ProviderShell {
  return createProviderShell("golf");
}

async function unsupported(): Promise<never> {
  throw new Error("Provider shell is not implemented yet");
}
