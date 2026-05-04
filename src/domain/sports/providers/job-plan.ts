import type { JobType } from "../../jobs/types";
import type { ProviderSportType } from "./types";
import { supportsProviderJobType } from "./capabilities";

const providerSyncJobTypes: JobType[] = [
  "fixtures.sync",
  "standings.sync",
  "results.finalize",
  "live-scores.sync",
];

export function buildProviderSyncJobPlan(sportSlug: ProviderSportType): JobType[] {
  return providerSyncJobTypes.filter((jobType) => supportsProviderJobType(sportSlug, jobType));
}
