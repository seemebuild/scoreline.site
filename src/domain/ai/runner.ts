import type { AiDraftInput, AiDraftProvider } from "./types";

type SaveAiDraftReviewItem = (input: {
  title: string;
  summary: string;
  body: string;
  category: string;
  sourceUrls: AiDraftInput["sourceUrls"];
  provider: string;
  providerVariant: AiDraftInput["variant"];
  sourceRecordIds: string[];
}) => Promise<unknown>;

export async function runAiDraftGeneration(input: {
  provider: AiDraftProvider;
  saveAiDraftReviewItem: SaveAiDraftReviewItem;
  input: AiDraftInput;
  sourceRecordIds: string[];
}): Promise<unknown> {
  const draft = await input.provider.generateDraft(input.input);

  return input.saveAiDraftReviewItem({
    title: draft.title,
    summary: draft.summary,
    body: draft.body,
    category: draft.category,
    sourceUrls: draft.sourceUrls,
    provider: "gemini",
    providerVariant: input.input.variant,
    sourceRecordIds: input.sourceRecordIds,
  });
}
