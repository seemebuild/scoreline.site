import type { JobType } from "../../jobs/types";
import type { ProviderSportType } from "./types";
import { supportsProviderJobType } from "./capabilities";

export function buildProviderJobPlan(
  sportSlug: ProviderSportType,
  jobTypes: JobType[],
): JobType[] {
  return jobTypes.filter((jobType) => supportsProviderJobType(sportSlug, jobType));
}
