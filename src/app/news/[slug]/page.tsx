import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteShell } from "../../components/site-shell";
import { createSanityClient } from "../../../domain/editorial/client";
import { getEditorialArticleBySlug } from "../../../domain/editorial/content";

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

export default async function NewsArticlePage({ params }: { params: NewsPageParams }) {
  const article = await getEditorialArticleBySlug(params.slug, createSanityClient() ?? undefined);

  if (!article) {
    notFound();
  }

  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <p className="text-sm font-bold uppercase text-[color:var(--accent-strong)]">News</p>
        <h1 className="mt-2 text-4xl font-black">{article.title}</h1>
        <p className="mt-4 text-lg leading-8 text-[color:var(--muted)]">{article.summary}</p>
      </article>
    </SiteShell>
  );
}
