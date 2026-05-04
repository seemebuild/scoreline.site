import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteShell } from "../../../components/site-shell";
import { launchSports } from "../../../../domain/sports/public-catalog";
import { buildSportPath } from "../../../../domain/sports/routing";
import { createJobsPrismaClient } from "../../../../domain/jobs/client";
import { getSoccerFixtureRows } from "../../../../domain/sports/public-data";
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
    title: `${sport.name} fixtures`,
    description: `Upcoming fixtures for ${sport.name}.`,
    canonicalPath: `${buildSportPath(sport.slug)}/fixtures`,
  });
}

export default async function SportFixturesPage({ params }: { params: SportPageParams }) {
  const sport = launchSports.find((item: (typeof launchSports)[number]) => item.slug === params.sport);
  if (!sport) notFound();

  if (sport.slug !== "soccer") {
    return (
      <SiteShell>
        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <h1 className="text-4xl font-black">{sport.name} fixtures</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
            Fixtures for this sport are coming after the launch soccer flow is fully settled.
          </p>
        </section>
      </SiteShell>
    );
  }

  const prisma = createJobsPrismaClient();
  const fixtures = await getSoccerFixtureRows(prisma);

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <h1 className="text-4xl font-black">{sport.name} fixtures</h1>
        <div className="mt-6 grid gap-3">
          {fixtures.length === 0 ? (
            <p className="text-[color:var(--muted)]">No upcoming soccer fixtures are stored yet.</p>
          ) : (
            fixtures.map((fixture) => (
              <article className="border border-[color:var(--line)] bg-[color:var(--surface)] p-4" key={fixture.id}>
                <p className="text-sm font-bold text-[color:var(--accent-strong)]">{fixture.competitionName}</p>
                <h2 className="mt-1 text-xl font-black">{fixture.title}</h2>
                <p className="mt-1 text-sm text-[color:var(--muted)]">
                  {fixture.kickoffAt.toISOString()}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </SiteShell>
  );
}
