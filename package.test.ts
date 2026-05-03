import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
  scripts: Record<string, string>;
};

describe("database scripts", () => {
  it("provides a single Neon-ready command for migration and seed verification", () => {
    expect(packageJson.scripts["db:verify"]).toBe(
      "pnpm db:migrate:deploy && pnpm db:seed && pnpm db:check",
    );
  });
});
