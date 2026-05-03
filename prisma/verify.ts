import { Prisma } from "@prisma/client";

import {
  LAUNCH_SOCCER_COMPETITIONS,
  LAUNCH_SPORTS,
} from "../src/domain/sports/launch-catalog";
import { createPrismaClient } from "./seed";

const duplicateProbe = {
  provider: "scoreline-verify",
  providerType: "team",
  providerId: "duplicate-provider-id",
};

async function verifyLaunchSeeds(prisma: ReturnType<typeof createPrismaClient>) {
  const [sportCount, soccer] = await Promise.all([
    prisma.sport.count({
      where: {
        slug: {
          in: LAUNCH_SPORTS.map((sport) => sport.slug),
        },
      },
    }),
    prisma.sport.findUniqueOrThrow({
      where: { slug: "soccer" },
      select: { id: true },
    }),
  ]);

  if (sportCount !== LAUNCH_SPORTS.length) {
    throw new Error(
      `Expected ${LAUNCH_SPORTS.length} launch sports, found ${sportCount}.`,
    );
  }

  const soccerCompetitionCount = await prisma.competition.count({
    where: {
      sportId: soccer.id,
      slug: {
        in: LAUNCH_SOCCER_COMPETITIONS.map((competition) => competition.slug),
      },
    },
  });

  if (soccerCompetitionCount !== LAUNCH_SOCCER_COMPETITIONS.length) {
    throw new Error(
      `Expected ${LAUNCH_SOCCER_COMPETITIONS.length} soccer competitions, found ${soccerCompetitionCount}.`,
    );
  }
}

async function verifyProviderMappingUniqueness(
  prisma: ReturnType<typeof createPrismaClient>,
) {
  await prisma.providerMapping.deleteMany({ where: duplicateProbe });
  await prisma.providerMapping.create({ data: duplicateProbe });

  try {
    await prisma.providerMapping.create({ data: duplicateProbe });
    throw new Error("Expected duplicate provider mapping insert to fail.");
  } catch (error) {
    if (
      !(error instanceof Prisma.PrismaClientKnownRequestError) ||
      error.code !== "P2002"
    ) {
      throw error;
    }
  } finally {
    await prisma.providerMapping.deleteMany({ where: duplicateProbe });
  }
}

async function main() {
  const prisma = createPrismaClient();

  try {
    await verifyLaunchSeeds(prisma);
    await verifyProviderMappingUniqueness(prisma);
    console.log("Database verification passed.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
