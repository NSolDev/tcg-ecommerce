// e2e/home.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/TCG Store/)
    const heroHeading = page.getByRole('heading', { name: /TCG Store/i })
    await expect(heroHeading).toBeVisible()
  })

  test('should show featured products', async ({ page }) => {
    await page.goto('/')
    const productCards = page.locator('[data-testid="product-card"]')
    await expect(productCards).toBeVisible()
  })

  test('should navigate to product catalog', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /Ver Catálogo/i }).click()
    await expect(page).toHaveURL(/.*products/)
  })
})