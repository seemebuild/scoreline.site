import { describe, expect, it, vi } from "vitest";

import worker, { triggerJobsTick } from "./worker";

describe("triggerJobsTick", () => {
  it("calls the jobs tick endpoint with the runner secret header", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));

    await triggerJobsTick(
      {
        SCORELINE_BASE_URL: "https://scoreline.site/",
        JOB_RUNNER_SECRET: "job-secret",
      },
      fetchMock,
    );

    expect(fetchMock).toHaveBeenCalledWith("https://scoreline.site/api/jobs/tick", {
      method: "POST",
      headers: {
        "x-job-runner-secret": "job-secret",
      },
    });
  });
});

describe("Cloudflare cron worker", () => {
  it("throws when the tick endpoint responds with a non-ok status", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 401 }));

    await expect(
      worker.scheduled?.(
        {},
        {
          SCORELINE_BASE_URL: "https://scoreline.site",
          JOB_RUNNER_SECRET: "job-secret",
        },
        {},
      ),
    ).rejects.toThrow("Tick request failed with status 401");

    fetchMock.mockRestore();
  });
});
