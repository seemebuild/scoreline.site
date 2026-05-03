import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export function createJobsPrismaClient() {
  const connectionString = loadDatabaseUrl();

  if (!connectionString) {
    throw new Error("DATABASE_URL is required and must point to a Neon database.");
  }

  const adapter = new PrismaNeon({ connectionString });

  return new PrismaClient({ adapter });
}

function loadDatabaseUrl(): string | undefined {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

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
