import { describe, expect, it, vi } from "vitest";

import {
  LAUNCH_SOCCER_COMPETITIONS,
  LAUNCH_SPORTS,
} from "../src/domain/sports/launch-catalog";
import { seedLaunchData, type SeedPrismaClient } from "./seed";

describe("seedLaunchData", () => {
  it("upserts launch sports and soccer competitions idempotently", async () => {
    const prisma = {
      sport: {
        upsert: vi.fn(),
        findUniqueOrThrow: vi.fn().mockResolvedValue({ id: "sport_soccer" }),
      },
      competition: {
        upsert: vi.fn(),
      },
    } satisfies SeedPrismaClient;

    await seedLaunchData(prisma);

    expect(prisma.sport.upsert).toHaveBeenCalledTimes(LAUNCH_SPORTS.length);
    expect(prisma.sport.upsert).toHaveBeenCalledWith({
      where: { slug: "soccer" },
      update: { name: "Soccer" },
      create: { name: "Soccer", slug: "soccer" },
    });
    expect(prisma.sport.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { slug: "soccer" },
      select: { id: true },
    });
    expect(prisma.competition.upsert).toHaveBeenCalledTimes(
      LAUNCH_SOCCER_COMPETITIONS.length,
    );
    expect(prisma.competition.upsert).toHaveBeenCalledWith({
      where: {
        sportId_slug: {
          sportId: "sport_soccer",
          slug: "fifa-world-cup",
        },
      },
      update: {
        name: "FIFA World Cup",
        region: "Global",
      },
      create: {
        sportId: "sport_soccer",
        name: "FIFA World Cup",
        slug: "fifa-world-cup",
        region: "Global",
      },
    });
  });
});
