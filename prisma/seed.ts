import { PrismaClient } from "@prisma/client";

import {
  LAUNCH_SOCCER_COMPETITIONS,
  LAUNCH_SPORTS,
} from "../src/domain/sports/launch-catalog";

const prisma = new PrismaClient();

async function main() {
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

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
