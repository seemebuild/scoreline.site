import { describe, expect, it } from "vitest";

import { createGeminiDraftProvider } from "./gemini";

describe("createGeminiDraftProvider", () => {
  it("returns null without an api key", () => {
    expect(createGeminiDraftProvider({ ...process.env, GEMINI_API_KEY: undefined })).toBeNull();
  });
});
