// e2e/cart.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Cart', () => {
  test('adds a product and opens the cart drawer', async ({ page }) => {
    await page.goto('/products');
    // Cards navigate via onClick (no anchor) — open the first product detail.
    await page.locator('.products-grid').getByRole('heading').first().click();
    await page.waitForURL(/\/products\/.+/);

    await page.getByRole('button', { name: /Añadir al Carrito/i }).click();

    // The drawer opens and offers checkout.
    await expect(page.getByRole('link', { name: /Finalizar compra/i })).toBeVisible();
  });
});
