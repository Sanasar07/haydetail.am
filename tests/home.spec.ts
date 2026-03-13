import { expect, test } from "@playwright/test"

test("home hero and sections render", async ({ page }) => {
  await page.goto("/")

  await expect(
    page.getByRole("heading", { level: 1, name: /Премиальный уход/i })
  ).toBeVisible()

  await expect(page.locator("#hero img[alt=\"Haydetail\"]").first()).toBeVisible()
  await expect(page.locator("#services")).toBeVisible()
  await expect(page.locator("#why-us")).toBeVisible()
  await expect(page.locator("#booking")).toBeVisible()
  await expect(page.locator("#contacts")).toBeVisible()
})

test("hero CTA scrolls to contacts", async ({ page }) => {
  await page.goto("/")

  const heroCta = page.locator("#hero").getByRole("link", { name: "Записаться" })
  await heroCta.click()

  await expect(page).toHaveURL(/#contacts/)
})
