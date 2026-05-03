import { expect, test } from "@playwright/test";

test("homepage renders a non-empty Scoreline shell", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /sports updates, live scores, and world cup coverage/i,
    }),
  ).toBeVisible();
  await expect(page.getByRole("navigation", { name: /primary/i })).toBeVisible();
});
