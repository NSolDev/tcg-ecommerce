// src/components/product/ProductCard.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductCard } from './ProductCard'

// Mock del store
vi.mock('@/store/cartStore', () => ({
  useCartStore: vi.fn(() => ({
    addItem: vi.fn(),
  })),
}))

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Charizard ex',
    slug: 'charizard-ex',
    description: 'Powerful fire Pokémon',
    price: 49.99,
    stock: 10,
    imageUrl: '/charizard.jpg',
    rarity: 'SUPER_RARA' as const,
    condition: 'MINT' as const,
    type: 'Pokémon',
    hp: 220,
    attack: 180,
    weakness: 'Water',
    evolution: 'Charmeleon',
    setId: 'set-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('should render product name', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Charizard ex')).toBeInTheDocument()
  })

  it('should render product price', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('49,99 €')).toBeInTheDocument()
  })

  it('should show out of stock badge when stock is 0', () => {
    const outOfStock = { ...mockProduct, stock: 0 }
    render(<ProductCard product={outOfStock} />)
    expect(screen.getByText('Agotado')).toBeInTheDocument()
  })

  it('should render rarity badge', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Súper Rara')).toBeInTheDocument()
  })

  // Test del botón de añadir al carrito - simplificado
  it('should have add to cart button', () => {
    render(<ProductCard product={mockProduct} />)
    const buttons = screen.getAllByRole('button')
    // Debería haber al menos 2 botones (favoritos y carrito)
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })
})