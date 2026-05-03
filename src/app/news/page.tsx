import type { Metadata } from "next";
import Link from "next/link";

import { SiteShell } from "../components/site-shell";

export const metadata: Metadata = {
  title: "News",
  description: "Editorial coverage and sports reporting from Scoreline.",
  alternates: {
    canonical: "/news",
  },
};

const stories = [
  {
    slug: "launching-scoreline-editorial",
    title: "Scoreline editorial coverage is coming online",
    summary: "A public editorial shell is now in place while the Sanity workflow is wired up behind it.",
  },
] as const;

export default function NewsPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <p className="text-sm font-bold uppercase text-[color:var(--accent-strong)]">News</p>
        <h1 className="mt-2 text-4xl font-black">Editorial coverage</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
          This shell will host Sanity-backed articles and editor picks. For now it gives the newsroom a public, crawlable home.
        </p>

        <div className="mt-8 grid gap-4">
          {stories.map((story) => (
            <Link
              className="border border-[color:var(--line)] bg-[color:var(--surface)] p-4 shadow-[var(--shadow)]"
              href={`/news/${story.slug}`}
              key={story.slug}
            >
              <h2 className="text-2xl font-black">{story.title}</h2>
              <p className="mt-2 text-[color:var(--muted)]">{story.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
