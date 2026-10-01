import { expect, type Page } from "@playwright/test";

export const openDeterministicApp = async (page: Page): Promise<void> => {
  await page.addInitScript(() => {
    Math.random = (): number => 0;
  });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: "譜読み練習" }),
  ).toBeVisible();
};
