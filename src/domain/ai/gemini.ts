import { buildAiDraftPrompt } from "./prompts";
import type { AiDraftInput, AiDraftOutput, AiDraftProvider } from "./types";
import { validateAiDraftInput, validateAiDraftOutput } from "./validate";

type GeminiClient = {
  fetch: (url: string, init: RequestInit) => Promise<Response>;
};

type GeminiEnv = {
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
} & NodeJS.ProcessEnv;

export function createGeminiDraftProvider(env: GeminiEnv = process.env, client: GeminiClient = globalThis): AiDraftProvider | null {
  if (!env.GEMINI_API_KEY) {
    return null;
  }

  return {
    async generateDraft(input: AiDraftInput): Promise<AiDraftOutput> {
      const issues = validateAiDraftInput(input);
      if (issues.length > 0) {
        throw new Error(issues.join(", "));
      }

      const response = await client.fetch(`https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_MODEL ?? "gemini-2.0-flash"}:generateContent?key=${env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: buildAiDraftPrompt(input) }],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini request failed with ${response.status}`);
      }

      const payload = (await response.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };

      const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("\n") ?? "";
      const draft = parseDraftText(text, input.category, input.sourceUrls);
      const outputIssues = validateAiDraftOutput(draft);

      if (outputIssues.length > 0) {
        throw new Error(outputIssues.join(", "));
      }

      return draft;
    },
  };
}

function parseDraftText(text: string, category: string, sourceUrls: AiDraftInput["sourceUrls"]): AiDraftOutput {
  const [title = "", summary = "", ...bodyParts] = text.split("\n").filter(Boolean);

  return {
    title,
    summary,
    body: bodyParts.join("\n") || text,
    category,
    sourceUrls,
  };
}
