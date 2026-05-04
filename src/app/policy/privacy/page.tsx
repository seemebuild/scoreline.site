import type { Metadata } from "next";

import { SiteShell } from "../../components/site-shell";
import { buildFaqSchema } from "../../../domain/seo/schema";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Scoreline handles data and privacy.",
  alternates: {
    canonical: "/policy/privacy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              buildFaqSchema([
                {
                  question: "Does Scoreline require accounts?",
                  answer: "No. The public experience is account-free for readers.",
                },
                {
                  question: "What data does Scoreline collect?",
                  answer: "Only the minimal data needed to operate the public site and related editorial workflows.",
                },
              ]),
            ),
          }}
          type="application/ld+json"
        />
        <p className="text-sm font-bold uppercase text-[color:var(--accent-strong)]">Policy</p>
        <h1 className="mt-2 text-4xl font-black">Privacy policy</h1>
        <div className="mt-6 grid gap-4 text-lg leading-8 text-[color:var(--muted)]">
          <p>Scoreline keeps the public experience account-free and only uses minimal data needed to run the site.</p>
          <p>More detailed privacy language will live here before launch as the editorial workflow is finalized.</p>
        </div>
      </section>
    </SiteShell>
  );
}
