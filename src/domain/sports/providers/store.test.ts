import { describe, expect, it, vi } from "vitest";

import { saveProviderSnapshot } from "./store";

describe("saveProviderSnapshot", () => {
  it("writes the provider payload and metadata to the database", async () => {
    const create = vi.fn().mockResolvedValue({ id: "snapshot_1" });
    const prisma = {
      providerSnapshot: {
        create,
      },
    };

    const result = await saveProviderSnapshot(prisma, {
      provider: "api-football",
      endpoint: "fixtures",
      providerId: "1001",
      payload: { response: [{ id: 1001 }] },
      fetchedAt: new Date("2026-05-03T10:00:00.000Z"),
    });

    expect(result).toEqual({ id: "snapshot_1" });
    expect(create).toHaveBeenCalledWith({
      data: {
        provider: "api-football",
        endpoint: "fixtures",
        providerId: "1001",
        responseJson: { response: [{ id: 1001 }] },
        fetchedAt: new Date("2026-05-03T10:00:00.000Z"),
      },
    });
  });
});
