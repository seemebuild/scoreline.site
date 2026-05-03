import { createClient } from "@sanity/client";

type SanityEnv = {
  projectId?: string;
  dataset?: string;
  apiVersion?: string;
  token?: string;
} & NodeJS.ProcessEnv;

export function createSanityClient(env: SanityEnv = process.env): ReturnType<typeof createClient> | null {
  const projectId = env.projectId ?? env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.dataset ?? env.NEXT_PUBLIC_SANITY_DATASET;

  if (!projectId || !dataset) {
    return null;
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: env.apiVersion ?? "2026-05-03",
    useCdn: true,
    perspective: "published",
    token: env.token ?? env.SANITY_API_TOKEN,
  });
}
