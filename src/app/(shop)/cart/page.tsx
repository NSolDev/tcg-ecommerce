// src/app/(shop)/cart/page.tsx
'use client'

import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Shield } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import './cart-page.css'

export default function CartPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const {
    items,
    removeItem,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    clearCart,
  } = useCartStore()

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  const handleCheckout = () => {
    if (!session) {
      router.push('/login?callbackUrl=/checkout')
      return
    }
    router.push('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <div className="cart-empty-icon">
            <ShoppingBag />
          </div>
          <h1 className="cart-empty-title">Tu carrito está vacío</h1>
          <p className="cart-empty-description">
            Parece que aún no has agregado ningún producto. ¡Explora nuestro catálogo y encuentra tus cartas favoritas!
          </p>
          <Link href="/products" className="cart-empty-button">
            Explorar Catálogo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <div className="cart-header-left">
          <h1 className="cart-header-title">
            <ShoppingBag className="icon" />
            Carrito
          </h1>
          <p className="cart-header-subtitle">
            {totalItems} {totalItems === 1 ? 'producto' : 'productos'} en tu carrito
          </p>
        </div>
        <button className="cart-header-clear" onClick={clearCart}>
          <Trash2 className="w-4 h-4" />
          Vaciar Carrito
        </button>
      </div>

      <div className="cart-grid">
        {/* Lista de productos */}
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.productId} className="cart-item">
              <div className="cart-item-content">
                {/* Imagen del producto */}
                <div className="cart-item-image">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                    sizes="96px"
                  />
                </div>

                {/* Información del producto */}
                <div className="cart-item-info">
                  <Link href={`/products/${item.id}`} className="cart-item-name">
                    {item.name}
                  </Link>
                  <p className="cart-item-price">{formatPrice(item.price)}</p>

                  {/* Controles de cantidad */}
                  <div className="cart-item-controls">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <span className="stock-label">Stock: {item.stock}</span>
                  </div>
                </div>

                {/* Subtotal y eliminar */}
                <div className="cart-item-subtotal">
                  <p className="amount">{formatPrice(item.price * item.quantity)}</p>
                  <button className="remove-btn" onClick={() => removeItem(item.productId)}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Botón para seguir comprando */}
          <Link href="/products" className="cart-continue">
            <ArrowRight className="icon rotate-180" />
            Seguir Comprando
          </Link>
        </div>

        {/* Resumen del pedido */}
        <div className="cart-summary">
          <div className="cart-summary-card">
            <h2 className="cart-summary-title">Resumen del Pedido</h2>
            
            <div className="cart-summary-row">
              <span className="label">Subtotal</span>
              <span className="value">{formatPrice(totalPrice)}</span>
            </div>
            <div className="cart-summary-row">
              <span className="label">Envío</span>
              <span className="value free">Gratis</span>
            </div>
            <div className="cart-summary-row">
              <span className="label">Impuestos</span>
              <span className="value">{formatPrice(0)}</span>
            </div>
            
            <Separator className="cart-summary-separator" />
            
            <div className="cart-summary-total">
              <span className="label">Total</span>
              <span className="value">{formatPrice(totalPrice)}</span>
            </div>

            <div className="cart-summary-security">
              <Shield className="icon" />
              <span>Pago 100% seguro con Stripe</span>
            </div>

            <button
              className={`cart-summary-checkout ${!session ? 'login' : ''}`}
              onClick={handleCheckout}
            >
              {session ? (
                <>
                  Proceder al Pago
                  <ArrowRight className="icon" />
                </>
              ) : (
                <>
                  Iniciar Sesión para Pagar
                  <ArrowRight className="icon" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}