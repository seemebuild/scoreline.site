import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getEnv } from "../../../../config/env";
import { isSanityWebhookAuthorized, type SanityWebhookPayload } from "../../../../domain/editorial/webhook";

type RevalidateDependencies = {
  env: {
    SANITY_WEBHOOK_SECRET: string;
  };
  revalidatePath: (path: string) => void;
};

export async function POST(request: Request) {
  return processSanityWebhookRequest(request, {
    env: getEnv(),
    revalidatePath,
  });
}

export async function processSanityWebhookRequest(request: Request, deps: RevalidateDependencies) {
  if (!isSanityWebhookAuthorized(request.headers, deps.env.SANITY_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => ({}))) as SanityWebhookPayload;
  const paths = getPathsToRevalidate(payload);

  for (const path of paths) {
    deps.revalidatePath(path);
  }

  return NextResponse.json({
    ok: true,
    status: "revalidated",
    paths,
  }, { status: 202 });
}

function getPathsToRevalidate(payload: SanityWebhookPayload): string[] {
  if (payload.type === "author" && payload.authorSlug) {
    return ["/authors", `/authors/${payload.authorSlug}`];
  }

  if (payload.type === "article" && payload.slug) {
    return ["/news", `/news/${payload.slug}`];
  }

  if (payload.type === "policy") {
    return ["/policy", "/policy/editorial", "/policy/privacy", "/policy/terms"];
  }

  return ["/news", "/authors", "/policy"];
}
