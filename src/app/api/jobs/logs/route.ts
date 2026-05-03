import { NextResponse } from "next/server";

import { getEnv } from "../../../../config/env";
import { isJobAdminAuthorized } from "../../../../domain/jobs/admin-auth";
import { createJobsPrismaClient } from "../../../../domain/jobs/client";
import { listJobExecutionLogs } from "../../../../domain/jobs/store";

const defaultLimit = 20;
const maxLimit = 100;

export async function GET(request: Request) {
  return processJobLogsRequest(request, {
    env: getEnv(),
    loadLogs: async (limit) => {
      const prisma = createJobsPrismaClient();

      try {
        return await listJobExecutionLogs(prisma, limit);
      } finally {
        await prisma.$disconnect();
      }
    },
  });
}

type ProcessJobLogsDeps = {
  env: {
    ADMIN_SECRET: string;
  };
  loadLogs: (limit: number) => Promise<
    Array<{
      id: string;
      jobId: string | null;
      jobType: string;
      status: string;
      message: string | null;
      attempts: number;
      createdAt: Date;
    }>
  >;
};

export async function processJobLogsRequest(request: Request, deps: ProcessJobLogsDeps) {
  if (!isJobAdminAuthorized(request.headers, deps.env.ADMIN_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const limit = clampLimit(url.searchParams.get("limit"));
  const logs = await deps.loadLogs(limit);

  return NextResponse.json({
    ok: true,
    status: "ok",
    limit,
    logs: logs.map((log) => ({
      ...log,
      createdAt: log.createdAt.toISOString(),
    })),
  });
}

function clampLimit(value: string | null): number {
  const parsed = value ? Number(value) : defaultLimit;

  if (!Number.isFinite(parsed) || parsed < 1) {
    return defaultLimit;
  }

  return Math.min(Math.floor(parsed), maxLimit);
}
