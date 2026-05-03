import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  APP_BASE_URL: z.url(),
  JOB_RUNNER_SECRET: z.string().min(1, "JOB_RUNNER_SECRET is required"),
  ADMIN_SECRET: z.string().min(1, "ADMIN_SECRET is required"),
});

export type AppEnv = z.infer<typeof envSchema>;

export function createEnv(input: Record<string, string | undefined>): AppEnv {
  const result = envSchema.safeParse(input);

  if (!result.success) {
    const keys = result.error.issues.map((issue) => issue.path.join("."));
    throw new Error(`Invalid environment: ${keys.join(", ")}`);
  }

  return result.data;
}

let cachedEnv: AppEnv | undefined;

export function getEnv(): AppEnv {
  cachedEnv ??= createEnv(process.env);
  return cachedEnv;
}
