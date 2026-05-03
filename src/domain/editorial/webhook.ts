export const sanityWebhookSecretHeader = "x-sanity-webhook-secret";

export function getSanityWebhookSecretFromHeaders(headers: Headers): string | null {
  return headers.get(sanityWebhookSecretHeader) ?? headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() ?? null;
}

export function isSanityWebhookAuthorized(headers: Headers, expectedSecret: string): boolean {
  const providedSecret = getSanityWebhookSecretFromHeaders(headers);
  return Boolean(providedSecret && providedSecret === expectedSecret);
}

export type SanityWebhookPayload = {
  type?: string;
  slug?: string;
  authorSlug?: string;
};
