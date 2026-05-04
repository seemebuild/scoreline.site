import type { Metadata } from "next";

import { SiteShell } from "../components/site-shell";
import { createJobsPrismaClient } from "../../domain/jobs/client";
import { getSoccerFixtureRows } from "../../domain/sports/public-data";
import { buildBreadcrumbSchema, buildSportsEventSchema } from "../../domain/seo/schema";

export const metadata: Metadata = {
  title: "Fixtures",
  description: "Upcoming fixtures across the launch sports, with soccer fixtures available first.",
  alternates: {
    canonical: "/fixtures",
  },
};

export default async function FixturesPage() {
  const prisma = createJobsPrismaClient();
  const rows = await getSoccerFixtureRows(prisma);

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              buildBreadcrumbSchema([
                { name: "Home", url: "https://scoreline.site" },
                { name: "Fixtures", url: "https://scoreline.site/fixtures" },
              ]),
            ),
          }}
          type="application/ld+json"
        />
        <p className="text-sm font-bold uppercase text-[color:var(--accent-strong)]">Fixtures</p>
        <h1 className="mt-2 text-4xl font-black">Upcoming matches</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
          Soccer fixtures are live-backed first, with the rest of the launch sports flowing into the same page shape.
        </p>

        <div className="mt-8 grid gap-4">
          {rows.length === 0 ? (
            <p className="text-[color:var(--muted)]">No upcoming soccer fixtures are stored yet.</p>
          ) : (
            rows.map((fixture) => (
              <article className="border border-[color:var(--line)] bg-[color:var(--surface)] p-4 shadow-[var(--shadow)]" key={fixture.id}>
                <script
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify(
                      buildSportsEventSchema({
                        name: fixture.title,
                        url: `https://scoreline.site/fixtures#${fixture.id}`,
                        startDate: fixture.kickoffAt.toISOString(),
                        status: fixture.status === "scheduled" ? "scheduled" : "scheduled",
                        competitionName: fixture.competitionName,
                        homeName: null,
                        awayName: null,
                        homeScore: null,
                        awayScore: null,
                      }),
                    ),
                  }}
                  type="application/ld+json"
                />
                <p className="text-sm font-bold text-[color:var(--accent-strong)]">{fixture.competitionName}</p>
                <h2 className="mt-1 text-xl font-black">{fixture.title}</h2>
                <p className="mt-1 text-sm text-[color:var(--muted)]">
                  {fixture.kickoffAt.toISOString()} · {fixture.status}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </SiteShell>
  );
}
