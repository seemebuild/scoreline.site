import type { Metadata } from "next";

import { SiteShell } from "../components/site-shell";
import { createJobsPrismaClient } from "../../domain/jobs/client";
import { getSoccerResultRows } from "../../domain/sports/public-data";

export const metadata: Metadata = {
  title: "Results",
  description: "Recent results across the launch sports, with soccer results available first.",
  alternates: {
    canonical: "/results",
  },
};

export default async function ResultsPage() {
  const prisma = createJobsPrismaClient();
  const rows = await getSoccerResultRows(prisma);

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <p className="text-sm font-bold uppercase text-[color:var(--accent-strong)]">Results</p>
        <h1 className="mt-2 text-4xl font-black">Recent finished matches</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
          Soccer results are available first, with other launch sports set to share the same page pattern.
        </p>

        <div className="mt-8 grid gap-4">
          {rows.length === 0 ? (
            <p className="text-[color:var(--muted)]">No completed soccer matches are stored yet.</p>
          ) : (
            rows.map((result) => (
              <article className="border border-[color:var(--line)] bg-[color:var(--surface)] p-4 shadow-[var(--shadow)]" key={result.id}>
                <p className="text-sm font-bold text-[color:var(--accent-strong)]">{result.competitionName}</p>
                <h2 className="mt-1 text-xl font-black">{result.title}</h2>
                <p className="mt-1 text-sm text-[color:var(--muted)]">
                  {result.homeScore ?? "-"} - {result.awayScore ?? "-"} · {result.status}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </SiteShell>
  );
}
