// src/store/cartStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from './cartStore';

describe('Cart Store', () => {
  beforeEach(() => {
    // Resetear el store antes de cada prueba
    useCartStore.setState({ items: [], isOpen: false });
  });

  const mockProduct = {
    id: 'product-1',
    productId: 'prod-1',
    name: 'Test Card',
    price: 10,
    imageUrl: 'test.jpg',
    stock: 5,
  };

  it('should add item to cart', () => {
    const { addItem } = useCartStore.getState();
    addItem(mockProduct);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(1);
    expect(items[0].name).toBe('Test Card');
  });

  it('should increase quantity when adding same item', () => {
    const { addItem } = useCartStore.getState();
    addItem(mockProduct);
    addItem(mockProduct);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it('should remove item from cart', () => {
    const { addItem, removeItem } = useCartStore.getState();
    addItem(mockProduct);
    let { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    removeItem(mockProduct.productId);
    items = useCartStore.getState().items;
    expect(items).toHaveLength(0);
  });

  it('should update quantity', () => {
    const { addItem, updateQuantity } = useCartStore.getState();
    addItem(mockProduct);
    updateQuantity(mockProduct.productId, 3);
    const { items } = useCartStore.getState();
    expect(items[0].quantity).toBe(3);
  });

  it('should calculate total items', () => {
    const { addItem, getTotalItems } = useCartStore.getState();
    addItem(mockProduct);
    addItem({ ...mockProduct, productId: 'prod-2', name: 'Test Card 2' });
    expect(getTotalItems()).toBe(2);
  });

  it('should calculate total price', () => {
    const { addItem, getTotalPrice } = useCartStore.getState();
    addItem(mockProduct);
    addItem({ ...mockProduct, productId: 'prod-2', price: 20 });
    expect(getTotalPrice()).toBe(30);
  });

  it('should clear cart', () => {
    const { addItem, clearCart } = useCartStore.getState();
    addItem(mockProduct);
    let { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    clearCart();
    items = useCartStore.getState().items;
    expect(items).toHaveLength(0);
  });
});
