export type LaunchSport = {
  name: string;
  slug: string;
};

export type LaunchCompetition = {
  name: string;
  slug: string;
  sportSlug: string;
  region: string;
};

export const LAUNCH_SPORTS = [
  { name: "Soccer", slug: "soccer" },
  { name: "NBA", slug: "nba" },
  { name: "American Football", slug: "american-football" },
  { name: "Baseball", slug: "baseball" },
  { name: "MMA", slug: "mma" },
  { name: "Tennis", slug: "tennis" },
  { name: "Golf", slug: "golf" },
] as const satisfies readonly LaunchSport[];

export const LAUNCH_SOCCER_COMPETITIONS = [
  {
    name: "FIFA World Cup",
    slug: "fifa-world-cup",
    sportSlug: "soccer",
    region: "Global",
  },
  {
    name: "World Cup Qualifiers",
    slug: "world-cup-qualifiers",
    sportSlug: "soccer",
    region: "Global",
  },
  {
    name: "UEFA Champions League",
    slug: "uefa-champions-league",
    sportSlug: "soccer",
    region: "Europe",
  },
  {
    name: "Premier League",
    slug: "premier-league",
    sportSlug: "soccer",
    region: "England",
  },
  {
    name: "La Liga",
    slug: "la-liga",
    sportSlug: "soccer",
    region: "Spain",
  },
  {
    name: "Serie A",
    slug: "serie-a",
    sportSlug: "soccer",
    region: "Italy",
  },
  {
    name: "Bundesliga",
    slug: "bundesliga",
    sportSlug: "soccer",
    region: "Germany",
  },
  {
    name: "Ligue 1",
    slug: "ligue-1",
    sportSlug: "soccer",
    region: "France",
  },
  {
    name: "MLS",
    slug: "mls",
    sportSlug: "soccer",
    region: "United States and Canada",
  },
  {
    name: "AFCON",
    slug: "afcon",
    sportSlug: "soccer",
    region: "Africa",
  },
] as const satisfies readonly LaunchCompetition[];

export function getLaunchSport(slug: string): LaunchSport | undefined {
  return LAUNCH_SPORTS.find((sport) => sport.slug === slug);
}
