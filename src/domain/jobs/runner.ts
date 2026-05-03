import type { Job } from "@prisma/client";

import { canRetryJob, getNextRetryRunAfter } from "./queue";
import {
  claimDueJobs,
  markJobCompleted,
  markJobFailed,
  markJobForRetry,
  type JobStorePrismaClient,
} from "./store";
import { JOB_TYPES, type JobPayload, type JobType } from "./types";

export type JobHandlerContext = {
  now: Date;
};

export type JobHandler<TType extends JobType> = (
  payload: JobPayload<TType>,
  context: JobHandlerContext,
) => Promise<void>;

export type JobHandlerRegistry = {
  [K in JobType]: JobHandler<K>;
};

export type RunJobsTickInput = {
  limit: number;
  now?: Date;
  handlers?: Partial<JobHandlerRegistry>;
};

export type RunJobsTickResult = {
  claimed: number;
  completed: number;
  retried: number;
  failed: number;
};

export async function runJobsTick(
  prisma: JobStorePrismaClient,
  input: RunJobsTickInput,
): Promise<RunJobsTickResult> {
  const now = input.now ?? new Date();
  const handlers = buildHandlers(input.handlers);
  const claimedJobs = await claimDueJobs(prisma, {
    limit: input.limit,
    now,
  });

  let completed = 0;
  let retried = 0;
  let failed = 0;

  for (const job of claimedJobs) {
    const handler = handlers[job.type as JobType];
    try {
      await handler(job.payload as never, { now });
      await markJobCompleted(prisma, job.id);
      completed += 1;
    } catch (error) {
      const errorMessage = toErrorMessage(error);
      if (canRetryJob(job)) {
        await markJobForRetry(
          prisma,
          job.id,
          getNextRetryRunAfter(now, job.attempts),
          errorMessage,
        );
        retried += 1;
      } else {
        await markJobFailed(prisma, job.id, errorMessage);
        failed += 1;
      }
    }
  }

  return {
    claimed: claimedJobs.length,
    completed,
    retried,
    failed,
  };
}

function buildHandlers(handlers?: Partial<JobHandlerRegistry>): JobHandlerRegistry {
  const fallback = async () => {};

  return {
    "fixtures.sync": handlers?.["fixtures.sync"] ?? fallback,
    "live-scores.sync": handlers?.["live-scores.sync"] ?? fallback,
    "results.finalize": handlers?.["results.finalize"] ?? fallback,
    "standings.sync": handlers?.["standings.sync"] ?? fallback,
    "provider-snapshots.cleanup": handlers?.["provider-snapshots.cleanup"] ?? fallback,
    "ai-drafts.generate": handlers?.["ai-drafts.generate"] ?? fallback,
    "sanity-drafts.create": handlers?.["sanity-drafts.create"] ?? fallback,
    "algolia.index": handlers?.["algolia.index"] ?? fallback,
    "trends.refresh": handlers?.["trends.refresh"] ?? fallback,
    "feedback.notify": handlers?.["feedback.notify"] ?? fallback,
    "cache.revalidate": handlers?.["cache.revalidate"] ?? fallback,
  };
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

export function assertKnownJobType(type: string): type is JobType {
  return JOB_TYPES.includes(type as JobType);
}
