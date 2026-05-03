import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteShell } from "../../../components/site-shell";
import { launchSports } from "../../../../domain/sports/public-catalog";
import { buildSportPath } from "../../../../domain/sports/routing";

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
    title: `${sport.name} fixtures`,
    description: `Upcoming fixtures for ${sport.name}.`,
    alternates: {
      canonical: `${buildSportPath(sport.slug)}/fixtures`,
    },
  };
}

export default function SportFixturesPage({ params }: { params: SportPageParams }) {
  const sport = launchSports.find((item: (typeof launchSports)[number]) => item.slug === params.sport);
  if (!sport) notFound();

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <h1 className="text-4xl font-black">{sport.name} fixtures</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
          Fixture listings will appear here with kickoff times, venues, and competition context.
        </p>
      </section>
    </SiteShell>
  );
}
