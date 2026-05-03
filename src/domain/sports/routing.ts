const slugSeparator = "-";

export type EventPathInput = {
  sport: string;
  kickoff: Date;
  homeTeam: string;
  awayTeam: string;
  eventId: string;
};

export function createSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, slugSeparator)
    .replace(/^-+|-+$/g, "");
}

export function buildSportPath(sport: string): string {
  return `/sports/${createSlug(sport)}`;
}

export function buildCompetitionPath(sport: string, competition: string): string {
  return `${buildSportPath(sport)}/competitions/${createSlug(competition)}`;
}

export function buildEventPath(input: EventPathInput): string {
  const kickoffDate = input.kickoff.toISOString().slice(0, 10);
  const fixtureSlug = createSlug(`${input.homeTeam} v ${input.awayTeam}`);

  return `${buildSportPath(input.sport)}/events/${kickoffDate}-${fixtureSlug}-${input.eventId}`;
}
