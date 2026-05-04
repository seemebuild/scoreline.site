import type { Metadata } from "next";
import Link from "next/link";

import { SiteShell } from "../components/site-shell";
import { getSeedDrafts } from "../../../sanity/seedDrafts";
import { buildPageMetadata } from "../../domain/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Studio",
  description: "Scoreline Sanity studio entry and starter drafts.",
  canonicalPath: "/studio",
  noindex: true,
});

export default function StudioPage() {
  const drafts = getSeedDrafts();

  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <p className="text-sm font-bold uppercase text-[color:var(--accent-strong)]">Studio</p>
        <h1 className="mt-2 text-4xl font-black">Sanity editorial workspace</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
          The studio boundary is ready for article, author, and policy drafting. These starter drafts seed the first editorial workflow.
        </p>

        <div className="mt-8 grid gap-4">
          {drafts.map((draft) => (
            <article className="border border-[color:var(--line)] bg-[color:var(--surface)] p-4 shadow-[var(--shadow)]" key={draft.slug}>
              <p className="text-sm font-bold text-[color:var(--accent-strong)]">{draft._type}</p>
              <h2 className="mt-1 text-2xl font-black">{draft.title}</h2>
              <p className="mt-2 text-[color:var(--muted)]">{draft.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-8">
          <Link className="text-sm font-bold underline underline-offset-4" href="/policy/editorial">
            Review editorial policy before publishing
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
