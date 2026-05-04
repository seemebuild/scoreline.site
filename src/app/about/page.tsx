import type { Metadata } from "next";

import { SiteShell } from "../components/site-shell";

export const metadata: Metadata = {
  title: "About",
  description: "Learn what Scoreline covers and how the site is put together.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <p className="text-sm font-bold uppercase text-[color:var(--accent-strong)]">About</p>
        <h1 className="mt-2 text-4xl font-black">A sports desk built for updates and context</h1>
        <div className="mt-6 grid gap-4 text-lg leading-8 text-[color:var(--muted)]">
          <p>Scoreline covers live sports, fixtures, results, standings, and editorial reporting in one place.</p>
          <p>The site is designed to stay fast, useful, and crawlable while keeping the core sports surfaces public and account-free.</p>
        </div>
      </section>
    </SiteShell>
  );
}
