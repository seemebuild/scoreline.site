import type { Job } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";

import { runJobsTick } from "./runner";
import type { JobStorePrismaClient } from "./store";

function buildJob(overrides?: Partial<Job>): Job {
  const now = new Date("2026-05-03T10:00:00.000Z");

  return {
    id: "job_1",
    type: "fixtures.sync",
    status: "running",
    payload: { sportSlug: "soccer" },
    idempotencyKey: "idem_1",
    attempts: 1,
    maxAttempts: 3,
    runAfter: now,
    lockedAt: now,
    lastError: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function createPrisma(claimedJobs: Job[]): JobStorePrismaClient {
  return {
    job: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn().mockImplementation(async ({ where, data }) =>
        buildJob({
          id: where.id,
          ...data,
        }),
      ),
    },
    $queryRaw: vi.fn().mockResolvedValue(claimedJobs),
  };
}

describe("runJobsTick", () => {
  it("marks successful jobs as completed", async () => {
    const prisma = createPrisma([buildJob()]);

    const result = await runJobsTick(prisma, {
      limit: 10,
    });

    expect(result).toEqual({
      claimed: 1,
      completed: 1,
      retried: 0,
      failed: 0,
    });
    expect(prisma.job.update).toHaveBeenCalledWith({
      where: { id: "job_1" },
      data: {
        status: "completed",
        lockedAt: null,
        lastError: null,
      },
    });
  });

  it("requeues failed jobs when attempts remain", async () => {
    const now = new Date("2026-05-03T10:00:00.000Z");
    const prisma = createPrisma([
      buildJob({
        attempts: 2,
        maxAttempts: 3,
      }),
    ]);

    const result = await runJobsTick(prisma, {
      limit: 10,
      now,
      handlers: {
        "fixtures.sync": async () => {
          throw new Error("provider timeout");
        },
      },
    });

    expect(result).toEqual({
      claimed: 1,
      completed: 0,
      retried: 1,
      failed: 0,
    });
    expect(prisma.job.update).toHaveBeenCalledWith({
      where: { id: "job_1" },
      data: {
        status: "pending",
        runAfter: new Date("2026-05-03T10:01:00.000Z"),
        lockedAt: null,
        lastError: "provider timeout",
      },
    });
  });

  it("marks jobs as failed when max attempts are reached", async () => {
    const prisma = createPrisma([
      buildJob({
        attempts: 3,
        maxAttempts: 3,
      }),
    ]);

    const result = await runJobsTick(prisma, {
      limit: 10,
      handlers: {
        "fixtures.sync": async () => {
          throw new Error("provider timeout");
        },
      },
    });

    expect(result).toEqual({
      claimed: 1,
      completed: 0,
      retried: 0,
      failed: 1,
    });
    expect(prisma.job.update).toHaveBeenCalledWith({
      where: { id: "job_1" },
      data: {
        status: "failed",
        lockedAt: null,
        lastError: "provider timeout",
      },
    });
  });

  it("marks unknown job types as failed when max attempts are reached", async () => {
    const prisma = createPrisma([
      buildJob({
        type: "unknown.job",
        attempts: 3,
        maxAttempts: 3,
      }),
    ]);

    const result = await runJobsTick(prisma, {
      limit: 10,
    });

    expect(result).toEqual({
      claimed: 1,
      completed: 0,
      retried: 0,
      failed: 1,
    });
    expect(prisma.job.update).toHaveBeenCalledWith({
      where: { id: "job_1" },
      data: {
        status: "failed",
        lockedAt: null,
        lastError: "Unknown job type: unknown.job",
      },
    });
  });
});
