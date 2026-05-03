import { defineConfig } from "prisma/config";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const databaseUrl = process.env.DATABASE_URL ?? loadDatabaseUrlFromEnvFile();

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required and must point to a Neon database.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
});

function loadDatabaseUrlFromEnvFile(): string | undefined {
  for (const candidate of [".env.local", ".env"]) {
    const filePath = resolve(process.cwd(), candidate);

    try {
      const contents = readFileSync(filePath, "utf8");
      const match = contents.match(/^DATABASE_URL\s*=\s*["']?(.+?)["']?$/m);

      if (match?.[1]) {
        return match[1];
      }
    } catch {
      continue;
    }
  }

  return undefined;
}
