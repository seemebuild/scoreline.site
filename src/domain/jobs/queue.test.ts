import { describe, expect, it } from "vitest";

import {
  JOB_STATUSES,
  buildJobIdempotencyKey,
  canRetryJob,
  getNextRetryRunAfter,
  getRetryDelayMs,
} from "./queue";

describe("JOB_STATUSES", () => {
  it("matches the Prisma job status lifecycle", () => {
    expect(JOB_STATUSES).toEqual(["pending", "running", "completed", "failed"]);
  });
});

describe("buildJobIdempotencyKey", () => {
  it("returns the same key for equivalent payloads with different object key order", () => {
    const keyOne = buildJobIdempotencyKey("fixture.sync", {
      competitionId: "wc-2026",
      window: { from: "2026-06-01", to: "2026-06-30" },
    });
    const keyTwo = buildJobIdempotencyKey("fixture.sync", {
      window: { to: "2026-06-30", from: "2026-06-01" },
      competitionId: "wc-2026",
    });

    expect(keyOne).toBe(keyTwo);
  });

  it("returns a different key when the job type changes", () => {
    const payload = { competitionId: "wc-2026" };

    expect(buildJobIdempotencyKey("fixture.sync", payload)).not.toBe(
      buildJobIdempotencyKey("standings.sync", payload),
    );
  });
});

describe("retry helpers", () => {
  it("supports exponential backoff timing", () => {
    expect(getRetryDelayMs(1)).toBe(30_000);
    expect(getRetryDelayMs(2)).toBe(60_000);
    expect(getRetryDelayMs(3)).toBe(120_000);
  });

  it("computes the next retry date from now and attempt number", () => {
    const now = new Date("2026-05-03T10:00:00.000Z");

    expect(getNextRetryRunAfter(now, 2).toISOString()).toBe(
      "2026-05-03T10:01:00.000Z",
    );
  });

  it("checks attempt budgets before retrying", () => {
    expect(canRetryJob({ attempts: 0, maxAttempts: 3 })).toBe(true);
    expect(canRetryJob({ attempts: 2, maxAttempts: 3 })).toBe(true);
    expect(canRetryJob({ attempts: 3, maxAttempts: 3 })).toBe(false);
  });
});
