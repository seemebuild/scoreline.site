import { describe, expect, it } from "vitest";

import { jobAdminSecretHeader } from "../../../../domain/jobs/admin-auth";

import { processJobLogsRequest } from "./route";

function createRequest(url = "http://localhost:3000/api/jobs/logs", headers?: HeadersInit): Request {
  return new Request(url, {
    method: "GET",
    headers,
  });
}

describe("GET /api/jobs/logs", () => {
  it("rejects requests without a valid admin secret", async () => {
    const response = await processJobLogsRequest(createRequest(), {
      env: { ADMIN_SECRET: "admin-secret" },
      loadLogs: async () => [],
    });
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ error: "Unauthorized" });
  });

  it("returns recent logs for authorized requests", async () => {
    const response = await processJobLogsRequest(
      createRequest("http://localhost:3000/api/jobs/logs?limit=2", {
        [jobAdminSecretHeader]: "admin-secret",
      }),
      {
        env: { ADMIN_SECRET: "admin-secret" },
        loadLogs: async (limit) => {
          expect(limit).toBe(2);
          return [
            {
              id: "log_1",
              jobId: "job_1",
              jobType: "fixtures.sync",
              status: "completed",
              message: null,
              attempts: 1,
              createdAt: new Date("2026-05-03T10:00:00.000Z"),
            },
          ];
        },
      },
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.status).toBe("ok");
    expect(body.limit).toBe(2);
    expect(body.logs).toEqual([
      {
        id: "log_1",
        jobId: "job_1",
        jobType: "fixtures.sync",
        status: "completed",
        message: null,
        attempts: 1,
        createdAt: "2026-05-03T10:00:00.000Z",
      },
    ]);
  });
});
