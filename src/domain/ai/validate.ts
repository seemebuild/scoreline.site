import type { AiDraftInput, AiDraftOutput } from "./types";

const bettingTerms = ["bet", "betting", "odds", "wager", "gambling", "bookmaker"];

export function validateAiDraftInput(input: AiDraftInput): string[] {
  const issues: string[] = [];

  if (!input.topic.trim()) issues.push("topic is required");
  if (!input.category.trim()) issues.push("category is required");
  if (input.sourceUrls.length === 0) issues.push("at least one source is required");
  if (input.rewriteMode) issues.push("rewrite mode is not allowed");
  if (containsBettingLanguage(input.topic)) issues.push("topic contains betting language");

  return issues;
}

export function validateAiDraftOutput(output: AiDraftOutput): string[] {
  const issues: string[] = [];

  if (!output.title.trim()) issues.push("title is required");
  if (!output.summary.trim()) issues.push("summary is required");
  if (!output.body.trim()) issues.push("body is required");
  if (output.sourceUrls.length === 0) issues.push("at least one source is required");
  if (containsBettingLanguage(`${output.title} ${output.summary} ${output.body}`)) issues.push("output contains betting language");

  return issues;
}

function containsBettingLanguage(value: string): boolean {
  const normalized = value.toLowerCase();
  return bettingTerms.some((term) => normalized.includes(term));
}
