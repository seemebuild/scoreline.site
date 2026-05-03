import { describe, expect, it } from "vitest";

import {
  getJobRunnerSecretFromHeaders,
  isJobRunnerAuthorized,
  jobRunnerSecretHeader,
} from "./auth";

describe("getJobRunnerSecretFromHeaders", () => {
  it("reads the explicit job runner header first", () => {
    const headers = new Headers({
      [jobRunnerSecretHeader]: "header-secret",
      authorization: "Bearer bearer-secret",
    });

    expect(getJobRunnerSecretFromHeaders(headers)).toBe("header-secret");
  });

  it("falls back to bearer auth tokens", () => {
    const headers = new Headers({
      authorization: "Bearer bearer-secret",
    });

    expect(getJobRunnerSecretFromHeaders(headers)).toBe("bearer-secret");
  });

  it("returns null for malformed auth headers", () => {
    const headers = new Headers({
      authorization: "Basic abc123",
    });

    expect(getJobRunnerSecretFromHeaders(headers)).toBeNull();
  });
});

describe("isJobRunnerAuthorized", () => {
  it("accepts matching secrets", () => {
    const headers = new Headers({
      [jobRunnerSecretHeader]: "job-secret",
    });

    expect(isJobRunnerAuthorized(headers, "job-secret")).toBe(true);
  });

  it("rejects missing or incorrect secrets", () => {
    expect(isJobRunnerAuthorized(new Headers(), "job-secret")).toBe(false);
    expect(
      isJobRunnerAuthorized(
        new Headers({
          [jobRunnerSecretHeader]: "wrong-secret",
        }),
        "job-secret",
      ),
    ).toBe(false);
  });
});
