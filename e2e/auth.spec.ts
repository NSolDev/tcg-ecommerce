// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: /Iniciar Sesión/i })).toBeVisible()
    await expect(page.getByLabel(/Email/i)).toBeVisible()
    await expect(page.getByLabel(/Contraseña/i)).toBeVisible()
  })

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@tcgstore.com')
    await page.fill('input[name="password"]', 'Test123!')
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click()
    await page.waitForURL('/')
    await expect(page.getByText(/Usuario Test/i)).toBeVisible()
  })

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'invalid@email.com')
    await page.fill('input[name="password"]', 'wrongpass')
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click()
    await expect(page.getByText(/Credenciales inválidas/i)).toBeVisible()
  })
})