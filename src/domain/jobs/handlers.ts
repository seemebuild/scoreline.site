import type { JobPayload, JobType } from "./types";

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

export const defaultJobHandlers: JobHandlerRegistry = {
  "fixtures.sync": async () => {},
  "live-scores.sync": async () => {},
  "results.finalize": async () => {},
  "standings.sync": async () => {},
  "provider-snapshots.cleanup": async () => {},
  "ai-drafts.generate": async () => {},
  "sanity-drafts.create": async () => {},
  "algolia.index": async () => {},
  "trends.refresh": async () => {},
  "feedback.notify": async () => {},
  "cache.revalidate": async () => {},
};
