import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteShell } from "../../../components/site-shell";
import { launchSports } from "../../../../domain/sports/public-catalog";
import { buildSportPath, buildCompetitionPath } from "../../../../domain/sports/routing";
import { createJobsPrismaClient } from "../../../../domain/jobs/client";
import { getSoccerCompetitionRows } from "../../../../domain/sports/public-data-more";

type SportPageParams = {
  sport: string;
};

export function generateStaticParams(): SportPageParams[] {
  return launchSports.map((sport: (typeof launchSports)[number]) => ({ sport: sport.slug }));
}

export function generateMetadata({ params }: { params: SportPageParams }): Metadata {
  const sport = launchSports.find((item: (typeof launchSports)[number]) => item.slug === params.sport);
  if (!sport) return {};

  return {
    title: `${sport.name} competitions`,
    description: `Competitions and tournaments for ${sport.name}.`,
    alternates: {
      canonical: `${buildSportPath(sport.slug)}/competitions`,
    },
  };
}

export default async function SportCompetitionsPage({ params }: { params: SportPageParams }) {
  const sport = launchSports.find((item: (typeof launchSports)[number]) => item.slug === params.sport);
  if (!sport) notFound();

  if (sport.slug !== "soccer") {
    return (
      <SiteShell>
        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <h1 className="text-4xl font-black">{sport.name} competitions</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
            Competition pages for this sport will land after the soccer surface is fully settled.
          </p>
        </section>
      </SiteShell>
    );
  }

  const prisma = createJobsPrismaClient();
  const competitions = await getSoccerCompetitionRows(prisma);

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <h1 className="text-4xl font-black">{sport.name} competitions</h1>
        <div className="mt-6 grid gap-3">
          {competitions.length === 0 ? (
            <p className="text-[color:var(--muted)]">No soccer competitions are stored yet.</p>
          ) : (
            competitions.map((competition) => (
              <Link
                className="border border-[color:var(--line)] bg-[color:var(--surface)] p-4"
                href={buildCompetitionPath(sport.slug, competition.name)}
                key={competition.id}
              >
                <p className="text-sm font-bold text-[color:var(--accent-strong)]">{competition.region}</p>
                <h2 className="mt-1 text-xl font-black">{competition.name}</h2>
                <p className="mt-1 text-sm text-[color:var(--muted)]">
                  {competition.seasonCount} seasons · {competition.eventCount} events
                </p>
              </Link>
            ))
          )}
        </div>
      </section>
    </SiteShell>
  );
}
