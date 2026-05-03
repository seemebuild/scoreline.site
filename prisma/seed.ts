import { PrismaClient } from "@prisma/client";
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
  return new PrismaClient();
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
