// src/components/cart/CartDrawer.tsx
'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import './cart-drawer.css';

// Cart thumbnails: bypass the Next optimizer for hotlink-protected remote hosts
// (e.g. cardmarket S3, which 403s server-side fetches) and fall back to the app
// placeholder if the image fails to load — same approach used elsewhere in the app.
function CartItemImage({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src || PLACEHOLDER_IMAGE);
  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className="object-contain p-1"
      sizes="64px"
      unoptimized={imgSrc.includes('cardmarket') || imgSrc.startsWith('data:')}
      onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
    />
  );
}

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalItems, getTotalPrice } =
    useCartStore();

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-drawer-overlay" onClick={closeCart} />
      <div className="cart-drawer-panel">
        {/* Header */}
        <div className="cart-drawer-header">
          <span className="title">Carrito ({getTotalItems()})</span>
          <button className="close-btn" onClick={closeCart}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="cart-drawer-empty">
            <ShoppingBag className="icon" />
            <p className="text">Tu carrito está vacío</p>
            <button className="btn-shop" onClick={closeCart}>
              Seguir comprando
            </button>
          </div>
        ) : (
          <>
            <div className="cart-drawer-items">
              {items.map((item) => (
                <div key={item.productId} className="item">
                  <div className="image">
                    <CartItemImage src={item.imageUrl} alt={item.name} />
                  </div>
                  <div className="info">
                    <Link href={`/products/${item.id}`} className="name" onClick={closeCart}>
                      {item.name}
                    </Link>
                    <p className="price">{formatPrice(item.price)}</p>
                    <div className="controls">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="subtotal">
                    <p className="amount">{formatPrice(item.price * item.quantity)}</p>
                    <button className="remove-btn" onClick={() => removeItem(item.productId)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="cart-drawer-footer">
              <div className="total">
                <span className="label">Total:</span>
                <span className="value">{formatPrice(getTotalPrice())}</span>
              </div>
              <div className="actions">
                <button className="btn-continue" onClick={closeCart}>
                  Seguir comprando
                </button>
                <Link href="/checkout" className="btn-checkout" onClick={closeCart}>
                  Finalizar compra
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
