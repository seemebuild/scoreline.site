export const JOB_TYPES = [
  "fixtures.sync",
  "live-scores.sync",
  "results.finalize",
  "standings.sync",
  "provider-snapshots.cleanup",
  "ai-drafts.generate",
  "sanity-drafts.create",
  "algolia.index",
  "trends.refresh",
  "feedback.notify",
  "cache.revalidate",
] as const;

export type JobType = (typeof JOB_TYPES)[number];

export type JobPayloadMap = {
  "fixtures.sync": {
    sportSlug: string;
    competitionSlug?: string;
    seasonSlug?: string;
  };
  "live-scores.sync": {
    sportSlug?: string;
    eventId?: string;
  };
  "results.finalize": {
    eventId: string;
  };
  "standings.sync": {
    competitionSlug: string;
    seasonSlug?: string;
  };
  "provider-snapshots.cleanup": {
    provider: string;
    retainDays: number;
  };
  "ai-drafts.generate": {
    topic: string;
    sportSlug?: string;
  };
  "sanity-drafts.create": {
    draftId: string;
  };
  "algolia.index": {
    scope: "sports" | "editorial" | "all";
  };
  "trends.refresh": {
    sportSlug?: string;
  };
  "feedback.notify": {
    feedbackSubmissionId: string;
  };
  "cache.revalidate": {
    path: string;
  };
};

export type JobPayload<TType extends JobType> = JobPayloadMap[TType];

export function isJobType(value: string): value is JobType {
  return JOB_TYPES.includes(value as JobType);
}
