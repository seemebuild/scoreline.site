import type { Metadata } from "next";

import { SiteShell } from "../components/site-shell";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Scoreline team.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <p className="text-sm font-bold uppercase text-[color:var(--accent-strong)]">Contact</p>
        <h1 className="mt-2 text-4xl font-black">Reach the team</h1>
        <div className="mt-6 grid gap-4 text-lg leading-8 text-[color:var(--muted)]">
          <p>For editorial feedback, corrections, or partnership questions, use the contact route for now.</p>
          <p>We’ll wire this into a proper form once the editorial system is in place.</p>
        </div>
      </section>
    </SiteShell>
  );
}
