import Link from "next/link";

import { featuredCompetitions, launchSports } from "../../domain/sports/public-catalog";
import { getCompetitionPath, getSportPath } from "../../domain/sports/public-catalog";

export function SiteShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen">
      <header className="border-b border-[color:var(--line)] bg-[color:var(--surface)]/82">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
          <Link className="text-xl font-black tracking-normal" href="/">
            Scoreline
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-5 text-sm font-semibold text-[color:var(--muted)] md:flex">
            <Link href="/sports/soccer">Soccer</Link>
            <Link href="/scores">Scores</Link>
            <Link href="/fixtures">Fixtures</Link>
            <Link href="/search">Search</Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className="border-t border-[color:var(--line)] px-5 py-8 text-sm text-[color:var(--muted)] sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-bold text-[color:var(--foreground)]">Scoreline</p>
            <p className="mt-2 max-w-xl">
              A clean sports desk for live scores, fixtures, standings, and editorial coverage.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="font-bold text-[color:var(--foreground)]">Launch sports</p>
              <ul className="mt-2 grid gap-1">
                {launchSports.map((sport) => (
                  <li key={sport.slug}>
                    <Link href={getSportPath(sport.slug)}>{sport.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-bold text-[color:var(--foreground)]">Featured competitions</p>
              <ul className="mt-2 grid gap-1">
                {featuredCompetitions.map((competition) => (
                  <li key={`${competition.sportSlug}-${competition.name}`}>
                    <Link href={getCompetitionPath(competition.sportSlug, competition.name)}>
                      {competition.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
