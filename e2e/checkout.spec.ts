// e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

const USER = { email: 'test@tcgstore.com', password: 'Test123!' };

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.fill('input[name="email"]', USER.email);
  await page.fill('input[name="password"]', USER.password);
  await page.getByRole('button', { name: /Iniciar Sesión/i }).click();
  await page.waitForURL('**/');
}

test.describe('Checkout (simulated payment)', () => {
  test('completes a purchase and shows it in order history', async ({ page }) => {
    await login(page);

    // Open the first product from the catalog and add it to the cart.
    // Cards navigate via an onClick handler (no anchor), so click the card itself.
    await page.goto('/products');
    await page.locator('.products-grid').getByRole('heading').first().click();
    await page.waitForURL(/\/products\/.+/);
    await page.getByRole('button', { name: /Añadir al Carrito/i }).click();

    // Go to checkout via the cart drawer.
    await page.getByRole('link', { name: /Finalizar compra/i }).click();
    await page.waitForURL(/\/checkout/);

    // Fill shipping + (cosmetic) card fields.
    await page.fill('#street', 'Calle Mayor 5');
    await page.fill('#city', 'Madrid');
    await page.fill('#state', 'Madrid');
    await page.fill('#postalCode', '28013');
    await page.fill('#cardName', 'Usuario Test');
    await page.fill('#cardNumber', '4242 4242 4242 4242');
    await page.fill('#cardExpiry', '12/29');
    await page.fill('#cardCvc', '123');

    await page.getByRole('button', { name: /Pagar ahora/i }).click();

    // Success page.
    await page.waitForURL(/\/checkout\/success/);
    await expect(page.getByText(/Pago Exitoso/i)).toBeVisible();
    await expect(page.getByText(/Completado/i)).toBeVisible();

    // The new order appears in history.
    await page.goto('/orders');
    await expect(page.getByText(/Pedido #/i).first()).toBeVisible();
    await expect(page.getByText(/Completado/i).first()).toBeVisible();
  });

  test('blocks checkout for unauthenticated users', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page).toHaveURL(/\/login/);
  });
});
