import { createHash } from "node:crypto";

export const JOB_STATUSES = ["pending", "running", "completed", "failed"] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export type JobRecord = {
  attempts: number;
  maxAttempts: number;
};

const retryBaseDelayMs = 30_000;

export function buildJobIdempotencyKey(type: string, payload: unknown): string {
  const normalizedPayload = stableJsonStringify(payload);

  return createHash("sha256")
    .update(`${type}:${normalizedPayload}`)
    .digest("hex");
}

export function canRetryJob(job: JobRecord): boolean {
  return job.attempts < job.maxAttempts;
}

export function getRetryDelayMs(attempt: number): number {
  return retryBaseDelayMs * 2 ** Math.max(0, attempt - 1);
}

export function getNextRetryRunAfter(now: Date, attempt: number): Date {
  return new Date(now.getTime() + getRetryDelayMs(attempt));
}

function stableJsonStringify(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, entryValue]) => [key, sortValue(entryValue)]),
  );
}
