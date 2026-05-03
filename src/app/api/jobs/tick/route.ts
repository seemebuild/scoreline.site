import { NextResponse } from "next/server";

import { getEnv } from "../../../../config/env";
import { isJobRunnerAuthorized } from "../../../../domain/jobs/auth";
import { runJobsTick } from "../../../../domain/jobs/runner";
import { createPrismaClient } from "../../../../../prisma/seed";

export async function POST(request: Request) {
  return processJobsTickRequest(request, {
    env: getEnv(),
    runTick: async () => {
      const prisma = createPrismaClient();

      try {
        return await runJobsTick(prisma, { limit: 20 });
      } finally {
        await prisma.$disconnect();
      }
    },
  });
}

type ProcessJobsTickDeps = {
  env: {
    JOB_RUNNER_SECRET: string;
  };
  runTick: () => Promise<{
    claimed: number;
    completed: number;
    retried: number;
    failed: number;
  }>;
};

export async function processJobsTickRequest(
  request: Request,
  deps: ProcessJobsTickDeps,
) {
  const isAuthorized = isJobRunnerAuthorized(request.headers, deps.env.JOB_RUNNER_SECRET);

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summary = await deps.runTick();

  return NextResponse.json(
    {
      ok: true,
      status: "processed",
      summary,
      acceptedAt: new Date().toISOString(),
    },
    { status: 202 },
  );
}
