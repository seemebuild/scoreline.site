import type { Metadata } from "next";

const baseUrl = "https://scoreline.site";

export function canonicalUrl(path: string): string {
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildPageMetadata(input: {
  title: string;
  description: string;
  canonicalPath: string;
  noindex?: boolean;
}): Metadata {
  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: input.canonicalPath,
    },
    robots: input.noindex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}

export function buildSportMetadata(input: {
  sportName: string;
  path: string;
  pageName: string;
  description: string;
}): Metadata {
  return buildPageMetadata({
    title: `${input.sportName} ${input.pageName}`,
    description: input.description,
    canonicalPath: input.path,
  });
}
