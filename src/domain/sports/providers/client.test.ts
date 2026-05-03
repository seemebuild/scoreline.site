import { describe, expect, it, vi } from "vitest";

import { createApiFootballClient } from "./client";

describe("createApiFootballClient", () => {
  it("fetches JSON with the expected headers", async () => {
    const fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ response: [] }),
    });

    const client = createApiFootballClient({
      apiKey: "test-key",
      baseUrl: "https://v3.football.api-sports.io",
      fetch,
    });

    const result = await client.get("fixtures", { season: 2025 });
    const [url, init] = fetch.mock.calls[0] ?? [];

    expect(result).toEqual({ response: [] });
    expect(url).toBeInstanceOf(URL);
    expect((url as URL).href).toBe("https://v3.football.api-sports.io/fixtures?season=2025");
    expect(init).toEqual(
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          "x-apisports-key": "test-key",
        }),
      }),
    );
  });

  it("retries transient failures before succeeding", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 500, text: async () => "server error" })
      .mockResolvedValueOnce({ ok: false, status: 502, text: async () => "bad gateway" })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ response: [{ id: 1 }] }),
      });

    const client = createApiFootballClient({
      apiKey: "test-key",
      baseUrl: "https://v3.football.api-sports.io",
      fetch,
      retry: { attempts: 3, delayMs: 0 },
    });

    const result = await client.get("fixtures");

    expect(result).toEqual({ response: [{ id: 1 }] });
    expect(fetch).toHaveBeenCalledTimes(3);
  });
});
