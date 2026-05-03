import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteShell } from "../../components/site-shell";

type NewsPageParams = {
  slug: string;
};

export function generateMetadata({ params }: { params: NewsPageParams }): Metadata {
  if (params.slug !== "launching-scoreline-editorial") {
    return {};
  }

  return {
    title: "Scoreline editorial coverage is coming online",
    description: "A public editorial shell is now in place while the Sanity workflow is wired up behind it.",
    alternates: {
      canonical: `/news/${params.slug}`,
    },
  };
}

export default function NewsArticlePage({ params }: { params: NewsPageParams }) {
  if (params.slug !== "launching-scoreline-editorial") {
    notFound();
  }

  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <p className="text-sm font-bold uppercase text-[color:var(--accent-strong)]">News</p>
        <h1 className="mt-2 text-4xl font-black">Scoreline editorial coverage is coming online</h1>
        <p className="mt-4 text-lg leading-8 text-[color:var(--muted)]">
          This placeholder article exists so the editorial route structure is ready before Sanity content lands.
        </p>
      </article>
    </SiteShell>
  );
}
