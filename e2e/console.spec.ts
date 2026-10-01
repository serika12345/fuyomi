import { expect, test } from "@playwright/test";
import { openDeterministicApp } from "./support";

test("loads and renders a notation without console or page errors", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors[consoleErrors.length] = message.text();
    }
  });
  page.on("pageerror", (error) => {
    pageErrors[pageErrors.length] = error.message;
  });

  await openDeterministicApp(page);
  await page.getByRole("button", { name: "ト音記号で始める" }).click();
  await expect(page.getByTestId("staff-notation").locator("svg")).toBeVisible();
  await page.waitForTimeout(250);

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});
