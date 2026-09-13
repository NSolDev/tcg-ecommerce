// e2e/home.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('loads with the hero', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/TCG Store/);
    await expect(page.getByRole('heading', { name: /TCG Store/i }).first()).toBeVisible();
  });

  test('navigates to the catalog from the header', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('link', { name: /^Catálogo$/i })
      .first()
      .click();
    await expect(page).toHaveURL(/.*products/);
  });

  test('catalog shows products', async ({ page }) => {
    await page.goto('/products');
    await expect(page.locator('.products-grid').getByRole('heading').first()).toBeVisible();
  });
});
