// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

const USER = { email: 'test@tcgstore.com', password: 'Test123!' };

test.describe('Authentication', () => {
  test('shows the login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /Iniciar Sesión/i })).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('rejects invalid credentials with a message', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'invalid@email.com');
    await page.fill('input[name="password"]', 'wrongpass');
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click();
    await expect(page.getByText(/incorrectos/i)).toBeVisible();
  });

  test('logs in with valid credentials and reaches the account', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', USER.email);
    await page.fill('input[name="password"]', USER.password);
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click();
    await page.waitForURL('**/');
    // The authenticated session renders the protected account page server-side.
    await page.goto('/account');
    await expect(page.getByText(/Usuario Test/i)).toBeVisible();
    await expect(page.getByText(USER.email)).toBeVisible();
  });

  test('redirects unauthenticated users away from protected routes', async ({ page }) => {
    await page.goto('/account');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: /Iniciar Sesión/i })).toBeVisible();
  });
});
