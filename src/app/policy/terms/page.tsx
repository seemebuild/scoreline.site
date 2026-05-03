import type { Metadata } from "next";

import { SiteShell } from "../../components/site-shell";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "Terms for using Scoreline.",
  alternates: {
    canonical: "/policy/terms",
  },
};

export default function TermsPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <p className="text-sm font-bold uppercase text-[color:var(--accent-strong)]">Policy</p>
        <h1 className="mt-2 text-4xl font-black">Terms of use</h1>
        <div className="mt-6 grid gap-4 text-lg leading-8 text-[color:var(--muted)]">
          <p>Scoreline is provided for informational sports coverage and may change as we add more editorial and data features.</p>
          <p>Additional terms will be added here as the Sanity editorial system and public forms come online.</p>
        </div>
      </section>
    </SiteShell>
  );
}
