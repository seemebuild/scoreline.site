import { describe, expect, it } from "vitest";

import robots from "./robots";

describe("robots", () => {
  it("allows the public editorial and sports routes", () => {
    const config = robots();
    const firstRule = Array.isArray(config.rules) ? config.rules[0] : config.rules;
    const allow = firstRule && "allow" in firstRule ? firstRule.allow ?? [] : [];

    expect(allow).toContain("/news");
    expect(allow).toContain("/sports");
    expect(config.sitemap).toBe("https://scoreline.site/sitemap.xml");
  });
});
