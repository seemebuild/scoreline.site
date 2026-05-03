import { describe, expect, it } from "vitest";

import { jobRunnerSecretHeader } from "../../../../domain/jobs/auth";

import { POST } from "./route";

function createRequest(headers?: HeadersInit): Request {
  return new Request("http://localhost:3000/api/jobs/tick", {
    method: "POST",
    headers,
  });
}

describe("POST /api/jobs/tick", () => {
  it("rejects requests without a valid runner secret", async () => {
    process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/scoreline";
    process.env.APP_BASE_URL = "http://localhost:3000";
    process.env.ADMIN_SECRET = "admin-secret";
    process.env.JOB_RUNNER_SECRET = "job-secret";

    const response = await POST(createRequest());
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ error: "Unauthorized" });
  });

  it("accepts requests with a valid runner secret", async () => {
    process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/scoreline";
    process.env.APP_BASE_URL = "http://localhost:3000";
    process.env.ADMIN_SECRET = "admin-secret";
    process.env.JOB_RUNNER_SECRET = "job-secret";

    const response = await POST(
      createRequest({
        [jobRunnerSecretHeader]: "job-secret",
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(202);
    expect(body.ok).toBe(true);
    expect(body.status).toBe("accepted");
    expect(typeof body.acceptedAt).toBe("string");
  });
});
