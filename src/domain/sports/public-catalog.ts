import { buildCompetitionPath, buildSportPath } from "./routing";

export const launchSports = [
  { name: "Soccer", slug: "soccer" },
  { name: "NBA", slug: "nba" },
  { name: "American football", slug: "american-football" },
  { name: "Baseball", slug: "baseball" },
  { name: "MMA", slug: "mma" },
  { name: "Tennis", slug: "tennis" },
  { name: "Golf", slug: "golf" },
] as const;

export const featuredCompetitions = [
  {
    sportSlug: "soccer",
    sportName: "Soccer",
    name: "FIFA World Cup",
  },
  {
    sportSlug: "soccer",
    sportName: "Soccer",
    name: "UEFA Champions League",
  },
  {
    sportSlug: "nba",
    sportName: "NBA",
    name: "NBA Playoffs",
  },
] as const;

export function getSportPath(sportSlug: string): string {
  return buildSportPath(sportSlug);
}

export function getCompetitionPath(sportSlug: string, competitionName: string): string {
  return buildCompetitionPath(sportSlug, competitionName);
}
