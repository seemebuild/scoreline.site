import { describe, expect, it } from "vitest";

import { createEnv } from "./env";

describe("createEnv", () => {
  it("returns typed configuration when required values are present", () => {
    const env = createEnv({
      DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/scoreline",
      APP_BASE_URL: "http://localhost:3000",
      JOB_RUNNER_SECRET: "job-secret",
      ADMIN_SECRET: "admin-secret",
    });

    expect(env.APP_BASE_URL).toBe("http://localhost:3000");
    expect(env.DATABASE_URL).toContain("scoreline");
  });

  it("fails when a required value is missing", () => {
    expect(() =>
      createEnv({
        DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/scoreline",
        APP_BASE_URL: "http://localhost:3000",
        JOB_RUNNER_SECRET: "job-secret",
      }),
    ).toThrow("ADMIN_SECRET");
  });
});
