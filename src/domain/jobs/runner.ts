import { canRetryJob, getNextRetryRunAfter } from "./queue";
import {
  claimDueJobs,
  markJobCompleted,
  markJobFailed,
  markJobForRetry,
  type JobStorePrismaClient,
} from "./store";
import {
  defaultJobHandlers,
  type JobHandlerRegistry,
} from "./handlers";
import { isJobType } from "./types";

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
  const handlers = {
    ...defaultJobHandlers,
    ...input.handlers,
  } satisfies JobHandlerRegistry;
  const claimedJobs = await claimDueJobs(prisma, {
    limit: input.limit,
    now,
  });

  let completed = 0;
  let retried = 0;
  let failed = 0;

  for (const job of claimedJobs) {
    try {
      if (!isJobType(job.type)) {
        throw new Error(`Unknown job type: ${job.type}`);
      }

      const handler = handlers[job.type];
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

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
