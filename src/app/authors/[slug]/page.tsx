import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteShell } from "../../components/site-shell";
import { createSanityClient } from "../../../domain/editorial/client";
import { getEditorialAuthorBySlug, getEditorialArticles } from "../../../domain/editorial/content";
import { buildBreadcrumbSchema } from "../../../domain/seo/schema";
import { buildPageMetadata } from "../../../domain/seo/metadata";

type AuthorPageParams = {
  slug: string;
};

export function generateMetadata({ params }: { params: AuthorPageParams }): Metadata {
  return buildPageMetadata({
    title: "Author",
    description: "Scoreline editorial author page.",
    canonicalPath: `/authors/${params.slug}`,
  });
}

export default async function AuthorPage({ params }: { params: AuthorPageParams }) {
  const client = createSanityClient() ?? undefined;
  const author = await getEditorialAuthorBySlug(params.slug, client);
  if (!author) {
    notFound();
  }

  const articles = (await getEditorialArticles(client)).filter((article) => article.author?.slug === author.slug);

  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              buildBreadcrumbSchema([
                { name: "Home", url: "https://scoreline.site" },
                { name: "Authors", url: "https://scoreline.site/authors" },
                { name: author.name, url: `https://scoreline.site/authors/${params.slug}` },
              ]),
            ),
          }}
          type="application/ld+json"
        />
        <p className="text-sm font-bold uppercase text-[color:var(--accent-strong)]">Author</p>
        <h1 className="mt-2 text-4xl font-black">{author.name}</h1>
        <p className="mt-4 text-lg leading-8 text-[color:var(--muted)]">{author.bio}</p>
        <p className="mt-4 text-sm text-[color:var(--muted)]">{author.articleCount} articles</p>
        <div className="mt-8 grid gap-4">
          {articles.map((article) => (
            <article className="border border-[color:var(--line)] bg-[color:var(--surface)] p-4 shadow-[var(--shadow)]" key={article.slug}>
              <h2 className="text-2xl font-black">{article.title}</h2>
              <p className="mt-2 text-[color:var(--muted)]">{article.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
