import { PrismaClient } from "@prisma/client";

export function createJobsPrismaClient() {
  return new PrismaClient();
}
