import type { Job, Prisma } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";

import { claimDueJobs, enqueueJob, type JobStorePrismaClient } from "./store";

function buildJob(overrides?: Partial<Job>): Job {
  const now = new Date("2026-05-03T10:00:00.000Z");

  return {
    id: "job_1",
    type: "fixtures.sync",
    status: "pending",
    payload: { sportSlug: "soccer" },
    idempotencyKey: "idem_1",
    attempts: 0,
    maxAttempts: 3,
    runAfter: now,
    lockedAt: null,
    lastError: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe("enqueueJob", () => {
  it("returns existing job when idempotency key already exists", async () => {
    const existingJob = buildJob();
    const prisma = {
      job: {
        findUnique: vi.fn().mockResolvedValue(existingJob),
        create: vi.fn(),
      },
      $queryRaw: vi.fn(),
    } satisfies JobStorePrismaClient;

    const result = await enqueueJob(prisma, {
      type: "fixtures.sync",
      payload: { sportSlug: "soccer" },
    });

    expect(result).toEqual({ created: false, job: existingJob });
    expect(prisma.job.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.job.create).not.toHaveBeenCalled();
  });

  it("creates a new job when idempotency key is not found", async () => {
    const createdJob = buildJob({ id: "job_2", status: "pending" });
    const prisma = {
      job: {
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue(createdJob),
      },
      $queryRaw: vi.fn(),
    } satisfies JobStorePrismaClient;

    const result = await enqueueJob(prisma, {
      type: "fixtures.sync",
      payload: { sportSlug: "soccer", seasonSlug: "2026" },
      maxAttempts: 5,
    });

    expect(result).toEqual({ created: true, job: createdJob });
    expect(prisma.job.create).toHaveBeenCalledTimes(1);
    expect(prisma.job.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        type: "fixtures.sync",
        payload: { sportSlug: "soccer", seasonSlug: "2026" },
        maxAttempts: 5,
      }),
    });
  });
});

describe("claimDueJobs", () => {
  it("claims due jobs and returns updated running records", async () => {
    const claimedJob = buildJob({
      id: "job_3",
      status: "running",
      attempts: 1,
      lockedAt: new Date("2026-05-03T10:01:00.000Z"),
    });

    const queryRaw = vi.fn().mockResolvedValue([claimedJob]);
    const prisma = {
      job: {
        findUnique: vi.fn(),
        create: vi.fn(),
      },
      $queryRaw: queryRaw,
    } satisfies JobStorePrismaClient;

    const claimed = await claimDueJobs(prisma, {
      limit: 10,
      now: new Date("2026-05-03T10:01:00.000Z"),
      types: ["fixtures.sync"],
    });

    expect(claimed).toEqual([claimedJob]);
    expect(queryRaw).toHaveBeenCalledTimes(1);
    const [sqlArg] = queryRaw.mock.calls[0] as [Prisma.Sql];
    expect(sqlArg.strings.join(" ")).toContain("FOR UPDATE SKIP LOCKED");
    expect(sqlArg.strings.join(" ")).toContain("UPDATE \"Job\" AS job");
  });
});
