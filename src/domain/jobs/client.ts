import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

export function createJobsPrismaClient() {
  const connectionString =
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/scoreline";
  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({ adapter });
}
