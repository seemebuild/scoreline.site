import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const migrationDir = dirname(fileURLToPath(import.meta.url));
const migrationSql = readFileSync(join(migrationDir, "migration.sql"), "utf8");

describe("initial migration", () => {
  it("enforces unique provider mappings from external provider ids", () => {
    expect(migrationSql).toContain(
      'CREATE UNIQUE INDEX "ProviderMapping_provider_providerType_providerId_key" ON "ProviderMapping"("provider", "providerType", "providerId");',
    );
  });

  it("adds route and live-score lookup indexes used by public pages", () => {
    expect(migrationSql).toContain(
      'CREATE UNIQUE INDEX "Sport_slug_key" ON "Sport"("slug");',
    );
    expect(migrationSql).toContain(
      'CREATE UNIQUE INDEX "Competition_sportId_slug_key" ON "Competition"("sportId", "slug");',
    );
    expect(migrationSql).toContain(
      'CREATE INDEX "Event_status_kickoffAt_idx" ON "Event"("status", "kickoffAt");',
    );
  });
});
