import { Prisma, type Job } from "@prisma/client";

import { buildJobIdempotencyKey } from "./queue";
import type { JobPayload, JobType } from "./types";

export type JobStorePrismaClient = {
  job: {
    findUnique: (args: { where: { idempotencyKey: string } }) => Promise<Job | null>;
    create: (args: {
      data: {
        type: string;
        payload: Prisma.InputJsonValue;
        idempotencyKey?: string;
        maxAttempts?: number;
        runAfter?: Date;
      };
    }) => Promise<Job>;
  };
  $queryRaw: <TRow>(query: Prisma.Sql) => Promise<TRow>;
};

export type EnqueueJobInput<TType extends JobType> = {
  type: TType;
  payload: JobPayload<TType>;
  idempotencyKey?: string;
  maxAttempts?: number;
  runAfter?: Date;
};

export type EnqueueJobResult = {
  created: boolean;
  job: Job;
};

export async function enqueueJob<TType extends JobType>(
  prisma: JobStorePrismaClient,
  input: EnqueueJobInput<TType>,
): Promise<EnqueueJobResult> {
  const idempotencyKey =
    input.idempotencyKey ?? buildJobIdempotencyKey(input.type, input.payload);

  const existingJob = await prisma.job.findUnique({
    where: { idempotencyKey },
  });

  if (existingJob) {
    return {
      created: false,
      job: existingJob,
    };
  }

  const createdJob = await prisma.job.create({
    data: {
      type: input.type,
      payload: input.payload as Prisma.InputJsonValue,
      idempotencyKey,
      maxAttempts: input.maxAttempts,
      runAfter: input.runAfter,
    },
  });

  return {
    created: true,
    job: createdJob,
  };
}

export type ClaimDueJobsInput = {
  limit: number;
  now?: Date;
  types?: JobType[];
};

type RawClaimedJob = Job;

export async function claimDueJobs(
  prisma: JobStorePrismaClient,
  input: ClaimDueJobsInput,
): Promise<Job[]> {
  const now = input.now ?? new Date();
  const typeFilter =
    input.types && input.types.length > 0
      ? Prisma.sql`AND job."type" IN (${Prisma.join(input.types)})`
      : Prisma.empty;

  return prisma.$queryRaw<RawClaimedJob[]>(
    Prisma.sql`
      WITH due AS (
        SELECT job."id"
        FROM "Job" AS job
        WHERE job."status" = 'pending'
          AND job."runAfter" <= ${now}
          AND job."lockedAt" IS NULL
          ${typeFilter}
        ORDER BY job."runAfter" ASC, job."createdAt" ASC
        LIMIT ${input.limit}
        FOR UPDATE SKIP LOCKED
      )
      UPDATE "Job" AS job
      SET
        "status" = 'running',
        "attempts" = job."attempts" + 1,
        "lockedAt" = ${now},
        "updatedAt" = ${now}
      FROM due
      WHERE job."id" = due."id"
      RETURNING job.*;
    `,
  );
}
