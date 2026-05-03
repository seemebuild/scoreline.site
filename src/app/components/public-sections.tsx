import Link from "next/link";

import { featuredCompetitions, launchSports } from "../../domain/sports/public-catalog";
import { getCompetitionPath, getSportPath } from "../../domain/sports/public-catalog";

export function LaunchSportsSection() {
  return (
    <div className="mt-8 flex flex-wrap gap-2" aria-label="Launch sports">
      {launchSports.map((sport) => (
        <Link
          className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-4 py-2 text-sm font-bold shadow-sm"
          href={getSportPath(sport.slug)}
          key={sport.slug}
        >
          {sport.name}
        </Link>
      ))}
    </div>
  );
}

export function FeaturedCompetitionsSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-14 sm:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase text-[color:var(--accent-strong)]">Featured competitions</p>
          <h2 className="mt-2 text-2xl font-black">World Cup and launch tournaments</h2>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {featuredCompetitions.map((competition) => (
          <Link
            className="border border-[color:var(--line)] bg-[color:var(--surface)] p-4 shadow-[var(--shadow)]"
            href={getCompetitionPath(competition.sportSlug, competition.name)}
            key={`${competition.sportSlug}-${competition.name}`}
          >
            <p className="text-sm font-bold text-[color:var(--accent-strong)]">{competition.sportName}</p>
            <h3 className="mt-2 text-xl font-black">{competition.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
