import { describe, expect, it } from "vitest";

import { validateAiDraftInput, validateAiDraftOutput } from "./validate";

describe("validateAiDraftInput", () => {
  it("requires sources and rejects rewrite mode", () => {
    const issues = validateAiDraftInput({
      topic: "Preview",
      category: "preview",
      variant: "preview",
      sourceUrls: [],
      rewriteMode: true,
    });

    expect(issues).toContain("at least one source is required");
    expect(issues).toContain("rewrite mode is not allowed");
  });
});

describe("validateAiDraftOutput", () => {
  it("requires core output fields", () => {
    const issues = validateAiDraftOutput({
      title: "",
      summary: "",
      body: "",
      category: "preview",
      sourceUrls: [],
    });

    expect(issues).toContain("title is required");
    expect(issues).toContain("summary is required");
    expect(issues).toContain("body is required");
    expect(issues).toContain("at least one source is required");
  });
});
