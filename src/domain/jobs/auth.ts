export const jobRunnerSecretHeader = "x-job-runner-secret";

export function getJobRunnerSecretFromHeaders(headers: Headers): string | null {
  const headerSecret = headers.get(jobRunnerSecretHeader);
  if (headerSecret) {
    return headerSecret;
  }

  const authorization = headers.get("authorization");
  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(" ", 2);
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

export function isJobRunnerAuthorized(headers: Headers, expectedSecret: string): boolean {
  const providedSecret = getJobRunnerSecretFromHeaders(headers);

  return Boolean(providedSecret && providedSecret === expectedSecret);
}
