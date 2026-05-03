import { describe, expect, it } from "vitest";

import { jobAdminSecretHeader, getJobAdminSecretFromHeaders, isJobAdminAuthorized } from "./admin-auth";

describe("getJobAdminSecretFromHeaders", () => {
  it("prefers the dedicated admin secret header", () => {
    const headers = new Headers({
      [jobAdminSecretHeader]: "admin-secret",
      authorization: "Bearer runner-secret",
    });

    expect(getJobAdminSecretFromHeaders(headers)).toBe("admin-secret");
  });

  it("supports bearer auth fallback", () => {
    const headers = new Headers({
      authorization: "Bearer admin-secret",
    });

    expect(getJobAdminSecretFromHeaders(headers)).toBe("admin-secret");
  });
});

describe("isJobAdminAuthorized", () => {
  it("accepts a matching secret", () => {
    const headers = new Headers({
      [jobAdminSecretHeader]: "admin-secret",
    });

    expect(isJobAdminAuthorized(headers, "admin-secret")).toBe(true);
  });

  it("rejects a missing or mismatched secret", () => {
    expect(isJobAdminAuthorized(new Headers(), "admin-secret")).toBe(false);
    expect(
      isJobAdminAuthorized(
        new Headers({
          [jobAdminSecretHeader]: "wrong-secret",
        }),
        "admin-secret",
      ),
    ).toBe(false);
  });
});
