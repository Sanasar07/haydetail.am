import { expect, test } from "@playwright/test"

test("film ai page renders and links to telegram", async ({ page }) => {
  await page.goto("/film-ai")

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()

  const telegramLink = page.getByRole("link", { name: /Telegram AI/i })
  await expect(telegramLink).toBeVisible()

  const href = await telegramLink.getAttribute("href")
  expect(href ?? "").toMatch(/^https:\/\/t\.me\//)
})
