import type { AiDraftInput, AiDraftOutput } from "./types";

type AiDraftStorePrismaClient = {
  aiDraft: {
    create: (args: {
      data: {
        title: string;
        summary: string;
        body: string;
        category: string;
        sourceUrls: AiDraftOutput["sourceUrls"];
        provider: string;
        providerVariant: AiDraftInput["variant"];
        sourceRecordIds: string[];
        status: string;
      };
    }) => Promise<unknown>;
  };
};

export type SaveAiDraftReviewItemInput = {
  title: string;
  summary: string;
  body: string;
  category: string;
  sourceUrls: AiDraftOutput["sourceUrls"];
  provider: string;
  providerVariant: AiDraftInput["variant"];
  sourceRecordIds: string[];
};

export async function saveAiDraftReviewItem(
  prisma: AiDraftStorePrismaClient,
  input: SaveAiDraftReviewItemInput,
): Promise<unknown> {
  return prisma.aiDraft.create({
    data: {
      title: input.title,
      summary: input.summary,
      body: input.body,
      category: input.category,
      sourceUrls: input.sourceUrls,
      provider: input.provider,
      providerVariant: input.providerVariant,
      sourceRecordIds: input.sourceRecordIds,
      status: "review",
    },
  });
}
