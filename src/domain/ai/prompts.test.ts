import { describe, expect, it } from "vitest";

import { buildAiDraftPrompt } from "./prompts";

describe("buildAiDraftPrompt", () => {
  it("includes the required source and rule sections", () => {
    const prompt = buildAiDraftPrompt({
      topic: "Premier League preview",
      category: "preview",
      variant: "preview",
      sourceUrls: [{ label: "Official site", url: "https://example.com" }],
      rewriteMode: false,
    });

    expect(prompt).toContain("Sources:");
    expect(prompt).toContain("Do not rewrite publisher copy");
    expect(prompt).toContain("Premier League preview");
  });
});
