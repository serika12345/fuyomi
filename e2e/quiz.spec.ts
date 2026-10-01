import { expect, test } from "@playwright/test";
import { openDeterministicApp } from "./support";

interface ClefScenario {
  readonly buttonName: string;
  readonly heading: string;
  readonly firstAnswer: string;
}

const CLEF_SCENARIOS: ReadonlyArray<ClefScenario> = [
  {
    buttonName: "ト音記号で始める",
    heading: "ト音記号",
    firstAnswer: "ド4 (C4)",
  },
  {
    buttonName: "ヘ音記号で始める",
    heading: "ヘ音記号",
    firstAnswer: "ミ2 (E2)",
  },
  {
    buttonName: "アルト記号で始める",
    heading: "アルト記号",
    firstAnswer: "レ3 (D3)",
  },
];

CLEF_SCENARIOS.forEach((scenario) => {
  test(`renders ${scenario.heading} and accepts its first answer`, async ({
    page,
  }) => {
    await openDeterministicApp(page);
    await page.getByRole("button", { name: scenario.buttonName }).click();

    await expect(
      page.getByRole("heading", { level: 1, name: scenario.heading }),
    ).toBeVisible();
    await expect(
      page.getByTestId("staff-notation").locator("svg"),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: scenario.firstAnswer }),
    ).toBeEnabled();

    await page.getByRole("button", { name: scenario.firstAnswer }).focus();
    await page.keyboard.press("Enter");

    await expect(page.getByRole("status")).toContainText("正解");
    await expect(
      page.getByRole("button", { name: scenario.firstAnswer }),
    ).toBeDisabled();
  });
});

test("shows feedback, advances manually, and summarizes the session", async ({
  page,
}) => {
  await openDeterministicApp(page);
  await page.getByRole("button", { name: "ト音記号で始める" }).click();

  await expect(page.getByLabel("現在の成績")).toContainText("0 / 0");
  await page.getByRole("button", { name: "レ4 (D4)" }).click();

  await expect(page.getByRole("status")).toContainText(
    "不正解。正解は ド4 (C4) です。",
  );
  await expect(page.getByRole("button", { name: "ド4 (C4)" })).toHaveAttribute(
    "data-answer-state",
    "correct",
  );
  await expect(page.getByRole("button", { name: "レ4 (D4)" })).toHaveAttribute(
    "data-answer-state",
    "incorrect",
  );
  await expect(page.getByLabel("現在の成績")).toContainText("0 / 1");

  await page.getByRole("button", { name: "次の問題" }).click();
  await expect(page.getByRole("status")).toHaveCount(0);
  await page.getByRole("button", { name: "レ4 (D4)" }).click();
  await expect(page.getByRole("status")).toContainText("正解！ レ4 (D4)");
  await expect(page.getByLabel("現在の成績")).toContainText("1 / 2");

  await page.getByRole("button", { name: "練習を終了" }).click();
  await expect(page.getByText("50%", { exact: true })).toBeVisible();
  await expect(page.getByLabel("正解数 1")).toBeVisible();
  await expect(page.getByLabel("回答数 2")).toBeVisible();

  await page.getByRole("button", { name: "同じ音部記号でもう一度" }).click();
  await expect(page.getByLabel("現在の成績")).toContainText("0 / 0");

  await page.getByRole("button", { name: "練習を終了" }).click();
  await expect(page.getByText("まだ回答していません")).toBeVisible();
  await page.getByRole("button", { name: "音部記号を選び直す" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "譜読み練習" }),
  ).toBeVisible();
});

test("keeps the keyboard operable at tablet width", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await openDeterministicApp(page);
  await page.getByRole("button", { name: "アルト記号で始める" }).click();

  await expect(page.getByRole("button", { name: "ド5 (C5)" })).toBeVisible();
  await page.getByRole("button", { name: "レ3 (D3)" }).click();
  await expect(page.getByRole("status")).toContainText("正解");
});
