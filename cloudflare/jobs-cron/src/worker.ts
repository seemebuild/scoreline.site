const jobRunnerSecretHeader = "x-job-runner-secret";

export type JobsCronEnv = {
  SCORELINE_BASE_URL: string;
  JOB_RUNNER_SECRET: string;
};

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
type ScheduledHandler<TEnv> = (
  event: unknown,
  env: TEnv,
  context: unknown,
) => Promise<void>;

export type JobsCronWorker<TEnv> = {
  scheduled: ScheduledHandler<TEnv>;
};

export async function triggerJobsTick(
  env: JobsCronEnv,
  fetchImpl: FetchLike = fetch,
): Promise<Response> {
  const baseUrl = env.SCORELINE_BASE_URL.replace(/\/+$/, "");
  const tickUrl = `${baseUrl}/api/jobs/tick`;

  return fetchImpl(tickUrl, {
    method: "POST",
    headers: {
      [jobRunnerSecretHeader]: env.JOB_RUNNER_SECRET,
    },
  });
}

const worker: JobsCronWorker<JobsCronEnv> = {
  async scheduled(_event: unknown, env: JobsCronEnv): Promise<void> {
    const response = await triggerJobsTick(env);

    if (!response.ok) {
      throw new Error(`Tick request failed with status ${response.status}`);
    }
  },
};

export default worker;
