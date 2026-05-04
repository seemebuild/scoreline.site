import type { Metadata } from "next";

import { SiteShell } from "../../components/site-shell";
import { buildFaqSchema } from "../../../domain/seo/schema";

export const metadata: Metadata = {
  title: "Editorial policy",
  description: "How Scoreline handles sports reporting and editorial standards.",
  alternates: {
    canonical: "/policy/editorial",
  },
};

export default function EditorialPolicyPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              buildFaqSchema([
                {
                  question: "How does Scoreline verify editorial coverage?",
                  answer: "Scoreline uses official announcements, sourced sports data, and human review before publication.",
                },
                {
                  question: "Can AI publish to Scoreline automatically?",
                  answer: "No. All editorial drafts require human approval before publishing.",
                },
              ]),
            ),
          }}
          type="application/ld+json"
        />
        <p className="text-sm font-bold uppercase text-[color:var(--accent-strong)]">Policy</p>
        <h1 className="mt-2 text-4xl font-black">Editorial policy</h1>
        <div className="mt-6 grid gap-4 text-lg leading-8 text-[color:var(--muted)]">
          <p>Scoreline prioritizes sourced sports data, official announcements, and human-reviewed editorial coverage.</p>
          <p>We avoid comments, betting calls, and unsupported claims, and we keep corrections visible through the editorial workflow.</p>
        </div>
      </section>
    </SiteShell>
  );
}
