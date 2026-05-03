import { describe, expect, it } from "vitest";

import { jobRunnerSecretHeader } from "../../../../domain/jobs/auth";

import { processJobsTickRequest } from "./route";

function createRequest(headers?: HeadersInit): Request {
  return new Request("http://localhost:3000/api/jobs/tick", {
    method: "POST",
    headers,
  });
}

describe("POST /api/jobs/tick", () => {
  it("rejects requests without a valid runner secret", async () => {
    const response = await processJobsTickRequest(createRequest(), {
      env: { JOB_RUNNER_SECRET: "job-secret" },
      runTick: async () => ({ claimed: 0, completed: 0, retried: 0, failed: 0 }),
    });
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ error: "Unauthorized" });
  });

  it("accepts requests with a valid runner secret", async () => {
    const response = await processJobsTickRequest(
      createRequest({
        [jobRunnerSecretHeader]: "job-secret",
      }),
      {
        env: { JOB_RUNNER_SECRET: "job-secret" },
        runTick: async () => ({ claimed: 3, completed: 2, retried: 1, failed: 0 }),
      },
    );
    const body = await response.json();

    expect(response.status).toBe(202);
    expect(body.ok).toBe(true);
    expect(body.status).toBe("processed");
    expect(body.summary).toEqual({ claimed: 3, completed: 2, retried: 1, failed: 0 });
    expect(typeof body.acceptedAt).toBe("string");
  });
});
