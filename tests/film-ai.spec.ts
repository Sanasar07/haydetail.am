import { expect, test } from "@playwright/test"

test("film ai page renders and links to telegram", async ({ page }) => {
  await page.goto("/film-ai")

  await expect(page.getByRole("heading", { level: 1, name: /AI подбор пленки/i })).toBeVisible()

  const telegramLink = page.getByRole("link", { name: /Telegram AI/i })
  await expect(telegramLink).toBeVisible()
  await expect(telegramLink).toHaveAttribute("href", /https:\\/\\/t\\.me\\//)
})
