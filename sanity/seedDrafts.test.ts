import { describe, expect, it } from "vitest";

import { getSeedDrafts, policyDrafts, starterArticleDrafts } from "./seedDrafts";

describe("getSeedDrafts", () => {
  it("returns the policy and starter article drafts", () => {
    const drafts = getSeedDrafts();

    expect(drafts).toHaveLength(policyDrafts.length + starterArticleDrafts.length + 2);
    expect(drafts.some((draft) => draft._type === "category" && draft.slug === "editorial")).toBe(true);
    expect(drafts.some((draft) => draft._type === "source" && draft.slug === "scoreline-editorial-desk")).toBe(true);
    expect(drafts.some((draft) => draft.slug === "scoreline-editorial-policy")).toBe(true);
    expect(drafts.some((draft) => draft.slug === "scoreline-editorial-coverage-is-coming-online")).toBe(true);
  });
});
