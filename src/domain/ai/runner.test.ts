import { describe, expect, it, vi } from "vitest";

import { runAiDraftGeneration } from "./runner";

describe("runAiDraftGeneration", () => {
  it("generates and stores a review draft", async () => {
    const provider = {
      generateDraft: vi.fn().mockResolvedValue({
        title: "A title",
        summary: "A summary",
        body: "A body",
        category: "analysis",
        sourceUrls: [
          { label: "Source", url: "https://example.com/source" },
        ],
      }),
    };
    const saveAiDraftReviewItem = vi.fn().mockResolvedValue({ id: "draft_1" });

    await runAiDraftGeneration({
      provider: provider as never,
      saveAiDraftReviewItem,
      input: {
        topic: "A topic",
        category: "analysis",
        variant: "preview",
        sourceUrls: [
          { label: "Source", url: "https://example.com/source" },
        ],
      },
      sourceRecordIds: ["source_1"],
    });

    expect(provider.generateDraft).toHaveBeenCalledWith({
      topic: "A topic",
      category: "analysis",
      variant: "preview",
      sourceUrls: [
        { label: "Source", url: "https://example.com/source" },
      ],
    });
    expect(saveAiDraftReviewItem).toHaveBeenCalledWith({
      title: "A title",
      summary: "A summary",
      body: "A body",
      category: "analysis",
      sourceUrls: [
        { label: "Source", url: "https://example.com/source" },
      ],
      provider: "gemini",
      providerVariant: "preview",
      sourceRecordIds: ["source_1"],
    });
  });
});
