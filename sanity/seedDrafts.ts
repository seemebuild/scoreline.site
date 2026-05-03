export type SanityDraft = {
  _type: string;
  title: string;
  slug: string;
  status: "draft";
  body: string;
};

export const policyDrafts: SanityDraft[] = [
  {
    _type: "article",
    title: "Scoreline editorial policy",
    slug: "scoreline-editorial-policy",
    status: "draft",
    body: "Define how Scoreline handles sourcing, corrections, and editorial review.",
  },
  {
    _type: "article",
    title: "Scoreline privacy policy",
    slug: "scoreline-privacy-policy",
    status: "draft",
    body: "Explain how Scoreline handles minimal public-site data.",
  },
  {
    _type: "article",
    title: "Scoreline terms of use",
    slug: "scoreline-terms-of-use",
    status: "draft",
    body: "Describe the rules for using the public site.",
  },
];

export const starterArticleDrafts: SanityDraft[] = [
  {
    _type: "article",
    title: "Scoreline editorial coverage is coming online",
    slug: "scoreline-editorial-coverage-is-coming-online",
    status: "draft",
    body: "Use this starter draft to connect the newsroom shell to the Sanity publish flow.",
  },
];

export function getSeedDrafts(): SanityDraft[] {
  return [...policyDrafts, ...starterArticleDrafts];
}
