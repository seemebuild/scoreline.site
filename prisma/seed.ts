import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  LAUNCH_SOCCER_COMPETITIONS,
  LAUNCH_SPORTS,
} from "../src/domain/sports/launch-catalog";

export type SeedPrismaClient = {
  sport: {
    upsert: (args: {
      where: { slug: string };
      update: { name: string };
      create: { name: string; slug: string };
    }) => Promise<unknown>;
    findUniqueOrThrow: (args: {
      where: { slug: string };
      select: { id: true };
    }) => Promise<{ id: string }>;
  };
  competition: {
    upsert: (args: {
      where: { sportId_slug: { sportId: string; slug: string } };
      update: { name: string; region: string };
      create: {
        sportId: string;
        name: string;
        slug: string;
        region: string;
      };
    }) => Promise<unknown>;
  };
};

export async function seedLaunchData(prisma: SeedPrismaClient) {
  for (const sport of LAUNCH_SPORTS) {
    await prisma.sport.upsert({
      where: { slug: sport.slug },
      update: { name: sport.name },
      create: sport,
    });
  }

  const soccer = await prisma.sport.findUniqueOrThrow({
    where: { slug: "soccer" },
    select: { id: true },
  });

  for (const competition of LAUNCH_SOCCER_COMPETITIONS) {
    await prisma.competition.upsert({
      where: {
        sportId_slug: {
          sportId: soccer.id,
          slug: competition.slug,
        },
      },
      update: {
        name: competition.name,
        region: competition.region,
      },
      create: {
        sportId: soccer.id,
        name: competition.name,
        slug: competition.slug,
        region: competition.region,
      },
    });
  }
}

export function createPrismaClient() {
  const connectionString = loadDatabaseUrl();

  if (!connectionString) {
    throw new Error("DATABASE_URL is required and must point to a Neon database.");
  }

  const adapter = new PrismaNeon({ connectionString });

  return new PrismaClient({ adapter });
}

async function main() {
  const prisma = createPrismaClient();

  try {
    await seedLaunchData(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
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
