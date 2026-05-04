import type { Metadata } from "next";

import { SiteShell } from "../components/site-shell";
import { createJobsPrismaClient } from "../../domain/jobs/client";
import { getSoccerLiveScoreRows } from "../../domain/sports/public-data";
import { buildBreadcrumbSchema, buildSportsEventSchema } from "../../domain/seo/schema";

export const metadata: Metadata = {
  title: "Live scores",
  description: "Live score updates across the launch sports, with soccer data available first.",
  alternates: {
    canonical: "/scores",
  },
};

export default async function ScoresPage() {
  const prisma = createJobsPrismaClient();
  const rows = await getSoccerLiveScoreRows(prisma);

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              buildBreadcrumbSchema([
                { name: "Home", url: "https://scoreline.site" },
                { name: "Scores", url: "https://scoreline.site/scores" },
              ]),
            ),
          }}
          type="application/ld+json"
        />
        <p className="text-sm font-bold uppercase text-[color:var(--accent-strong)]">Live scores</p>
        <h1 className="mt-2 text-4xl font-black">Current match pulse</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
          Soccer is live-backed first, with other launch sports queued behind the shared score surface.
        </p>

        <div className="mt-8 grid gap-4">
          {rows.length === 0 ? (
            <p className="text-[color:var(--muted)]">No live soccer matches are active right now.</p>
          ) : (
            rows.map((score) => (
              <article className="border border-[color:var(--line)] bg-[color:var(--surface)] p-4 shadow-[var(--shadow)]" key={score.id}>
                <script
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify(
                      buildSportsEventSchema({
                        name: score.title,
                        url: `https://scoreline.site/scores#${score.id}`,
                        startDate: score.kickoffAt.toISOString(),
                        status: "live",
                        competitionName: score.competitionName,
                        homeName: null,
                        awayName: null,
                        homeScore: score.homeScore,
                        awayScore: score.awayScore,
                      }),
                    ),
                  }}
                  type="application/ld+json"
                />
                <p className="text-sm font-bold text-[color:var(--accent-strong)]">{score.competitionName}</p>
                <h2 className="mt-1 text-xl font-black">{score.title}</h2>
                <p className="mt-1 text-sm text-[color:var(--muted)]">
                  {score.homeScore ?? "-"} - {score.awayScore ?? "-"} · {score.status}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </SiteShell>
  );
}
