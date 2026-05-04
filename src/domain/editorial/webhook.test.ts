import { describe, expect, it } from "vitest";

import { getSanityWebhookSecretFromHeaders, isSanityWebhookAuthorized, sanityWebhookSecretHeader } from "./webhook";

describe("getSanityWebhookSecretFromHeaders", () => {
  it("prefers the dedicated webhook secret header", () => {
    const headers = new Headers({
      [sanityWebhookSecretHeader]: "webhook-secret",
      authorization: "Bearer other-secret",
    });

    expect(getSanityWebhookSecretFromHeaders(headers)).toBe("webhook-secret");
  });
});

describe("isSanityWebhookAuthorized", () => {
  it("accepts matching secrets", () => {
    const headers = new Headers({ [sanityWebhookSecretHeader]: "webhook-secret" });

    expect(isSanityWebhookAuthorized(headers, "webhook-secret")).toBe(true);
  });
});
