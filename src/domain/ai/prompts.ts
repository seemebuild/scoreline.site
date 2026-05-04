import type { AiDraftInput } from "./types";

export function buildAiDraftPrompt(input: AiDraftInput): string {
  const sources = input.sourceUrls.map((source) => `- ${source.label}: ${source.url}`).join("\n");

  return [
    `Variant: ${input.variant}`,
    `Topic: ${input.topic}`,
    `Category: ${input.category}`,
    input.sportSlug ? `Sport: ${input.sportSlug}` : null,
    input.notes ? `Notes: ${input.notes}` : null,
    `Rewrite mode: ${input.rewriteMode ? "yes" : "no"}`,
    "Sources:",
    sources,
    "Rules:",
    "- Use only the provided sources.",
    "- Do not rewrite publisher copy.",
    "- Do not mention betting.",
    "- Return a title, summary, and body.",
  ]
    .filter(Boolean)
    .join("\n");
}
