import { NextResponse } from "next/server";

import { getEnv } from "../../../../config/env";
import { isJobRunnerAuthorized } from "../../../../domain/jobs/auth";

export async function POST(request: Request) {
  const env = getEnv();
  const isAuthorized = isJobRunnerAuthorized(request.headers, env.JOB_RUNNER_SECRET);

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    {
      ok: true,
      status: "accepted",
      acceptedAt: new Date().toISOString(),
    },
    { status: 202 },
  );
}
