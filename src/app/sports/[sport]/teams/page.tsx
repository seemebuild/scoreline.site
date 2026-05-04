import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteShell } from "../../../components/site-shell";
import { launchSports } from "../../../../domain/sports/public-catalog";
import { buildSportPath } from "../../../../domain/sports/routing";
import { createJobsPrismaClient } from "../../../../domain/jobs/client";
import { getSoccerTeamRows } from "../../../../domain/sports/public-data-more";
import { buildPageMetadata } from "../../../../domain/seo/metadata";

type SportPageParams = {
  sport: string;
};

export function generateStaticParams(): SportPageParams[] {
  return launchSports.map((sport: (typeof launchSports)[number]) => ({ sport: sport.slug }));
}

export function generateMetadata({ params }: { params: SportPageParams }): Metadata {
  const sport = launchSports.find((item: (typeof launchSports)[number]) => item.slug === params.sport);
  if (!sport) return {};

  return buildPageMetadata({
    title: `${sport.name} teams`,
    description: `Teams and clubs for ${sport.name}.`,
    canonicalPath: `${buildSportPath(sport.slug)}/teams`,
  });
}

export default async function SportTeamsPage({ params }: { params: SportPageParams }) {
  const sport = launchSports.find((item: (typeof launchSports)[number]) => item.slug === params.sport);
  if (!sport) notFound();

  if (sport.slug !== "soccer") {
    return (
      <SiteShell>
        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <h1 className="text-4xl font-black">{sport.name} teams</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
            Team pages for this sport will land after the soccer public data path is complete.
          </p>
        </section>
      </SiteShell>
    );
  }

  const prisma = createJobsPrismaClient();
  const teams = await getSoccerTeamRows(prisma);

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <h1 className="text-4xl font-black">{sport.name} teams</h1>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {teams.length === 0 ? (
            <p className="text-[color:var(--muted)]">No soccer teams are stored yet.</p>
          ) : (
            teams.map((team) => (
              <article className="border border-[color:var(--line)] bg-[color:var(--surface)] p-4" key={team.id}>
                <p className="text-sm font-bold text-[color:var(--accent-strong)]">{team.countryCode}</p>
                <h2 className="mt-1 text-xl font-black">{team.name}</h2>
                <p className="mt-1 text-sm text-[color:var(--muted)]">
                  {team.shortName ?? team.slug} · {team.eventCount} events
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </SiteShell>
  );
}
