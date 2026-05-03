import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteShell } from "../../components/site-shell";
import { launchSports, getSportPath } from "../../../domain/sports/public-catalog";
import { buildSportPath } from "../../../domain/sports/routing";

type SportPageParams = {
  sport: string;
};

export function generateStaticParams(): SportPageParams[] {
  return launchSports.map((sport: (typeof launchSports)[number]) => ({ sport: sport.slug }));
}

export function generateMetadata({ params }: { params: SportPageParams }): Metadata {
  const sport = launchSports.find((item: (typeof launchSports)[number]) => item.slug === params.sport);

  if (!sport) {
    return {};
  }

  return {
    title: `${sport.name}`,
    description: `Live scores, fixtures, standings, and editorial coverage for ${sport.name}.`,
    alternates: {
      canonical: buildSportPath(sport.slug),
    },
  };
}

export default function SportPage({ params }: { params: SportPageParams }) {
  const sport = launchSports.find((item: (typeof launchSports)[number]) => item.slug === params.sport);

  if (!sport) {
    notFound();
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <p className="text-sm font-bold uppercase text-[color:var(--accent-strong)]">{sport.name}</p>
        <h1 className="mt-2 text-4xl font-black">Live {sport.name.toLowerCase()} coverage</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
          Scores, fixtures, standings, and event coverage for the launch version of Scoreline.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Card title="Live scores" href={`${getSportPath(sport.slug)}/scores`} />
          <Card title="Fixtures" href={`${getSportPath(sport.slug)}/fixtures`} />
          <Card title="Standings" href={`${getSportPath(sport.slug)}/standings`} />
        </div>
      </section>
    </SiteShell>
  );
}

function Card({
  title,
  href,
}: Readonly<{
  title: string;
  href: string;
}>) {
  return (
    <Link className="border border-[color:var(--line)] bg-[color:var(--surface)] p-4 shadow-[var(--shadow)]" href={href}>
      <p className="text-sm font-bold text-[color:var(--accent-strong)]">Browse</p>
      <h2 className="mt-2 text-xl font-black">{title}</h2>
    </Link>
  );
}
