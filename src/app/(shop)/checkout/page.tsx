// src/app/(shop)/checkout/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PaymentForm } from '@/components/checkout/PaymentForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import './checkout-page.css';

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, getTotalPrice } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  // NO redirigir por carrito vacío mientras se procesa el pago
  useEffect(() => {
    if (items.length === 0 && status === 'authenticated' && !isProcessing) {
      // Solo redirigir si NO estamos en medio de un pago
      router.push('/products');
    }
  }, [items, status, router, isProcessing]);

  if (status === 'loading') {
    return (
      <div className="checkout-page">
        <div className="checkout-loading">Cargando...</div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const total = getTotalPrice();
  const cartItems = items;

  if (cartItems.length === 0 && !isProcessing) {
    return null;
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Finalizar Compra</h1>

      <div className="checkout-grid">
        <div className="md:col-span-2">
          <PaymentForm
            userId={session.user.id}
            onProcessingChange={setIsProcessing}
            onError={(message) => {
              setIsProcessing(false);
              router.push(`/checkout/error?message=${encodeURIComponent(message)}`);
            }}
          />
        </div>

        <div>
          <Card className="checkout-summary-card">
            <CardHeader className="checkout-summary-header">
              <CardTitle className="checkout-summary-title">Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="checkout-summary-content">
              {cartItems.map((item) => (
                <div key={item.productId} className="checkout-summary-item">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span className="price">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="checkout-summary-total">
                <span className="label">Total</span>
                <span className="value">{formatPrice(total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
