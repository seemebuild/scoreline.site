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
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-[color:var(--muted)]">
          <span>{article.author?.name ?? "Scoreline Editorial"}</span>
          <span>{article.publishedAt ?? "Unpublished"}</span>
        </div>
        <div className="mt-8 space-y-4 text-lg leading-8">
          <p>{article.body}</p>
          {article.sources.length > 0 ? (
            <div>
              <p className="text-sm font-bold uppercase text-[color:var(--accent-strong)]">Sources</p>
              <ul className="mt-3 grid gap-2 text-base">
                {article.sources.map((source) => (
                  <li key={`${source.label}-${source.url}`}>
                    <a className="underline decoration-[color:var(--line)] underline-offset-4" href={source.url}>
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </article>
    </SiteShell>
  );
}
