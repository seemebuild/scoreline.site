import { describe, expect, it, vi } from "vitest";

import { saveAiDraftReviewItem } from "./store";

describe("saveAiDraftReviewItem", () => {
  it("stores a generated draft with review metadata", async () => {
    const create = vi.fn().mockResolvedValue({ id: "draft_1" });
    const prisma = {
      aiDraft: {
        create,
      },
    };

    await saveAiDraftReviewItem(prisma as never, {
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

    expect(create).toHaveBeenCalledWith({
      data: {
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
        status: "review",
      },
    });
  });
});
