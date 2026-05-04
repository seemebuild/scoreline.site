import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteShell } from "../../components/site-shell";
import { createSanityClient } from "../../../domain/editorial/client";
import { getEditorialArticleBySlug } from "../../../domain/editorial/content";
import { buildArticleSchema, buildBreadcrumbSchema } from "../../../domain/seo/schema";
import { buildPageMetadata } from "../../../domain/seo/metadata";

type NewsPageParams = {
  slug: string;
};

export function generateMetadata({ params }: { params: NewsPageParams }): Metadata {
  if (params.slug !== "launching-scoreline-editorial") {
    return {};
  }

  return buildPageMetadata({
    title: "Scoreline editorial coverage is coming online",
    description: "A public editorial shell is now in place while the Sanity workflow is wired up behind it.",
    canonicalPath: `/news/${params.slug}`,
  });
}

export default async function NewsArticlePage({ params }: { params: NewsPageParams }) {
  const article = await getEditorialArticleBySlug(params.slug, createSanityClient() ?? undefined);

  if (!article) {
    notFound();
  }

  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              buildBreadcrumbSchema([
                { name: "Home", url: "https://scoreline.site" },
                { name: "News", url: "https://scoreline.site/news" },
                { name: article.title, url: `https://scoreline.site/news/${params.slug}` },
              ]),
            ),
          }}
          type="application/ld+json"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              buildArticleSchema({
                title: article.title,
                description: article.summary,
                url: `https://scoreline.site/news/${params.slug}`,
                publishedAt: article.publishedAt,
                authorName: article.author?.name ?? "Scoreline Editorial",
              }),
            ),
          }}
          type="application/ld+json"
        />
        <p className="text-sm font-bold uppercase text-[color:var(--accent-strong)]">News</p>
        <h1 className="mt-2 text-4xl font-black">{article.title}</h1>
        <p className="mt-4 text-lg leading-8 text-[color:var(--muted)]">{article.summary}</p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-[color:var(--muted)]">
          <span>{article.author?.name ?? "Scoreline Editorial"}</span>
          <span>{article.publishedAt ?? "Unpublished"}</span>
          <span>{article.category?.name ?? "Editorial"}</span>
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
