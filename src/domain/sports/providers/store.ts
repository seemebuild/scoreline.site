import type { Prisma } from "@prisma/client";

import type { ProviderSnapshot } from "./types";

export type ProviderSnapshotStorePrismaClient = {
  providerSnapshot: {
    create: (args: {
      data: {
        provider: string;
        endpoint: string;
        providerId?: string | null;
        responseJson: Prisma.InputJsonValue;
        fetchedAt?: Date;
      };
    }) => Promise<unknown>;
  };
};

export async function saveProviderSnapshot(
  prisma: ProviderSnapshotStorePrismaClient,
  snapshot: ProviderSnapshot,
) {
  return prisma.providerSnapshot.create({
    data: {
      provider: snapshot.provider,
      endpoint: snapshot.endpoint,
      providerId: snapshot.providerId,
      responseJson: snapshot.payload as Prisma.InputJsonValue,
      fetchedAt: snapshot.fetchedAt,
    },
  });
}
