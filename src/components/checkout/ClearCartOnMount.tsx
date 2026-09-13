// src/components/checkout/ClearCartOnMount.tsx
'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

/** Clears the client cart once, after a successful order. */
export function ClearCartOnMount() {
  const clearCart = useCartStore((state) => state.clearCart);
  useEffect(() => {
    clearCart();
  }, [clearCart]);
  return null;
}
