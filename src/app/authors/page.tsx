import type { Metadata } from "next";
import Link from "next/link";

import { SiteShell } from "../components/site-shell";
import { createSanityClient } from "../../domain/editorial/client";
import { getEditorialAuthors } from "../../domain/editorial/content";
import { buildPageMetadata } from "../../domain/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Authors",
  description: "Meet the Scoreline editorial team.",
  canonicalPath: "/authors",
});

export default async function AuthorsPage() {
  const authors = await getEditorialAuthors(createSanityClient() ?? undefined);

  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <p className="text-sm font-bold uppercase text-[color:var(--accent-strong)]">Authors</p>
        <h1 className="mt-2 text-4xl font-black">Editorial team</h1>
        <div className="mt-8 grid gap-4">
          {authors.map((author) => (
            <Link
              className="border border-[color:var(--line)] bg-[color:var(--surface)] p-4 shadow-[var(--shadow)]"
              href={`/authors/${author.slug}`}
              key={author.slug}
            >
              <h2 className="text-2xl font-black">{author.name}</h2>
              <p className="mt-2 text-[color:var(--muted)]">{author.bio}</p>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
