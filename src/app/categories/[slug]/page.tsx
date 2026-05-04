import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteShell } from "../../components/site-shell";
import { createSanityClient } from "../../../domain/editorial/client";
import { getEditorialCategoryBySlug } from "../../../domain/editorial/content";
import { buildPageMetadata } from "../../../domain/seo/metadata";

type CategoryPageParams = {
  slug: string;
};

export function generateMetadata({ params }: { params: CategoryPageParams }): Metadata {
  return buildPageMetadata({
    title: "Category",
    description: "Editorial category page.",
    canonicalPath: `/categories/${params.slug}`,
  });
}

export default async function CategoryPage({ params }: { params: CategoryPageParams }) {
  const category = await getEditorialCategoryBySlug(params.slug, createSanityClient() ?? undefined);
  if (!category) {
    notFound();
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <p className="text-sm font-bold uppercase text-[color:var(--accent-strong)]">Category</p>
        <h1 className="mt-2 text-4xl font-black">{category.name}</h1>
        <p className="mt-4 text-lg leading-8 text-[color:var(--muted)]">{category.description}</p>
      </section>
    </SiteShell>
  );
}
