// e2e/cart.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Cart', () => {
  test('should add product to cart', async ({ page }) => {
    await page.goto('/products')
    
    // Esperar que los productos carguen
    const addToCartButton = page.locator('button[aria-label="Add to cart"]').first()
    await addToCartButton.click()
    
    // Verificar que el carrito se abre
    const cartDrawer = page.locator('[data-testid="cart-drawer"]')
    await expect(cartDrawer).toBeVisible()
  })

  test('should show cart items', async ({ page }) => {
    await page.goto('/products')
    const addToCartButton = page.locator('button[aria-label="Add to cart"]').first()
    await addToCartButton.click()
    
    // Verificar el item en el carrito
    const cartItem = page.locator('[data-testid="cart-item"]')
    await expect(cartItem).toBeVisible()
  })
})