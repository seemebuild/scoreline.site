import { describe, expect, it, vi } from "vitest";

import { sanityWebhookSecretHeader } from "../../../../domain/editorial/webhook";
import { processSanityWebhookRequest } from "./route";

describe("processSanityWebhookRequest", () => {
  it("rejects unauthorized requests", async () => {
    const response = await processSanityWebhookRequest(
      new Request("http://localhost/api/sanity/webhook", { method: "POST" }),
      {
        env: { SANITY_WEBHOOK_SECRET: "webhook-secret" },
        revalidatePath: vi.fn(),
      },
    );

    expect(response.status).toBe(401);
  });

  it("revalidates article paths", async () => {
    const revalidatePath = vi.fn();
    const response = await processSanityWebhookRequest(
      new Request("http://localhost/api/sanity/webhook", {
        method: "POST",
        headers: { [sanityWebhookSecretHeader]: "webhook-secret" },
        body: JSON.stringify({ type: "article", slug: "hello-world" }),
      }),
      {
        env: { SANITY_WEBHOOK_SECRET: "webhook-secret" },
        revalidatePath,
      },
    );

    expect(response.status).toBe(202);
    expect(revalidatePath).toHaveBeenCalledWith("/news");
    expect(revalidatePath).toHaveBeenCalledWith("/news/hello-world");
  });
});
