export const jobAdminSecretHeader = "x-admin-secret";

export function getJobAdminSecretFromHeaders(headers: Headers): string | null {
  const headerSecret = headers.get(jobAdminSecretHeader);
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

export function isJobAdminAuthorized(headers: Headers, expectedSecret: string): boolean {
  const providedSecret = getJobAdminSecretFromHeaders(headers);

  return Boolean(providedSecret && providedSecret === expectedSecret);
}
