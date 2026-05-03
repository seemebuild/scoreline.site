import type { Metadata } from "next";
import Link from "next/link";

import { SiteShell } from "../components/site-shell";

export const metadata: Metadata = {
  title: "Policy",
  description: "Read Scoreline editorial and trust policies.",
  alternates: {
    canonical: "/policy",
  },
};

const policyLinks = [
  { href: "/policy/editorial", title: "Editorial policy" },
  { href: "/policy/privacy", title: "Privacy policy" },
  { href: "/policy/terms", title: "Terms of use" },
] as const;

export default function PolicyPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <p className="text-sm font-bold uppercase text-[color:var(--accent-strong)]">Policy</p>
        <h1 className="mt-2 text-4xl font-black">Trust and policy pages</h1>
        <div className="mt-6 grid gap-3">
          {policyLinks.map((policy) => (
            <Link
              className="border border-[color:var(--line)] bg-[color:var(--surface)] p-4 shadow-[var(--shadow)]"
              href={policy.href}
              key={policy.href}
            >
              <span className="text-lg font-black">{policy.title}</span>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
