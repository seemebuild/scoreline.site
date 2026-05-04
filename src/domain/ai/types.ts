export const AI_DRAFT_VARIANTS = ["preview", "recap", "explainer", "update"] as const;

export type AiDraftVariant = (typeof AI_DRAFT_VARIANTS)[number];

export type AiDraftSource = {
  label: string;
  url: string;
};

export type AiDraftInput = {
  topic: string;
  sportSlug?: string;
  category: string;
  variant: AiDraftVariant;
  sourceUrls: AiDraftSource[];
  notes?: string;
  rewriteMode?: boolean;
};

export type AiDraftOutput = {
  title: string;
  summary: string;
  body: string;
  category: string;
  sourceUrls: AiDraftSource[];
};

export type AiDraftProvider = {
  generateDraft: (input: AiDraftInput) => Promise<AiDraftOutput>;
};
