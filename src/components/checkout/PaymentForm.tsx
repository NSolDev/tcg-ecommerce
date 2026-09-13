// src/components/checkout/PaymentForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCartStore } from '@/store/cartStore';
import { createOrder } from '@/lib/actions/order.actions';
import { CreditCard, Lock } from 'lucide-react';
import './payment-form.css';

interface PaymentFormProps {
  userId: string;
  onProcessingChange?: (processing: boolean) => void;
  onError?: (message: string) => void;
}

// Card fields are cosmetic: payment is settled server-side (Stripe TEST mode when
// configured, otherwise simulated). We never transmit real card data.
function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();
}

export function PaymentForm({ onProcessingChange, onError }: PaymentFormProps) {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'España',
  });
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvc: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    setLoading(true);
    setError(null);
    onProcessingChange?.(true);

    try {
      const { orderId } = await createOrder(
        items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        address
      );

      clearCart();
      router.push(`/checkout/success?orderId=${orderId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al procesar el pago';
      setError(message);
      setLoading(false);
      onProcessingChange?.(false);
      onError?.(message);
    }
  };

  return (
    <Card className="payment-form-card">
      <CardHeader className="payment-form-header">
        <CardTitle className="payment-form-title">Información de Envío y Pago</CardTitle>
        <CardDescription className="payment-form-description">
          Completa tus datos para finalizar la compra
        </CardDescription>
      </CardHeader>
      <CardContent className="payment-form-content">
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="payment-form-field">
            <Label htmlFor="street" className="payment-form-label">
              Calle
            </Label>
            <Input
              id="street"
              placeholder="Calle Principal 123"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              required
              className="payment-form-input"
            />
          </div>

          <div className="payment-form-row">
            <div className="payment-form-field">
              <Label htmlFor="city" className="payment-form-label">
                Ciudad
              </Label>
              <Input
                id="city"
                placeholder="Madrid"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                required
                className="payment-form-input"
              />
            </div>
            <div className="payment-form-field">
              <Label htmlFor="state" className="payment-form-label">
                Provincia
              </Label>
              <Input
                id="state"
                placeholder="Madrid"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                required
                className="payment-form-input"
              />
            </div>
          </div>

          <div className="payment-form-row">
            <div className="payment-form-field">
              <Label htmlFor="postalCode" className="payment-form-label">
                Código Postal
              </Label>
              <Input
                id="postalCode"
                placeholder="28001"
                value={address.postalCode}
                onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                required
                className="payment-form-input"
              />
            </div>
            <div className="payment-form-field">
              <Label htmlFor="country" className="payment-form-label">
                País
              </Label>
              <Input
                id="country"
                value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                required
                className="payment-form-input"
              />
            </div>
          </div>

          <div className="payment-form-card-section">
            <div className="payment-form-card-heading">
              <CreditCard className="h-4 w-4" />
              <span>Datos de la tarjeta</span>
              <span className="payment-form-badge">
                <Lock className="h-3 w-3" /> Modo test
              </span>
            </div>

            <div className="payment-form-field">
              <Label htmlFor="cardName" className="payment-form-label">
                Titular
              </Label>
              <Input
                id="cardName"
                placeholder="Nombre en la tarjeta"
                value={card.name}
                onChange={(e) => setCard({ ...card, name: e.target.value })}
                required
                className="payment-form-input"
              />
            </div>

            <div className="payment-form-field">
              <Label htmlFor="cardNumber" className="payment-form-label">
                Número de tarjeta
              </Label>
              <Input
                id="cardNumber"
                inputMode="numeric"
                placeholder="4242 4242 4242 4242"
                value={card.number}
                onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                required
                className="payment-form-input"
              />
            </div>

            <div className="payment-form-row">
              <div className="payment-form-field">
                <Label htmlFor="cardExpiry" className="payment-form-label">
                  Caducidad
                </Label>
                <Input
                  id="cardExpiry"
                  placeholder="MM/AA"
                  value={card.expiry}
                  onChange={(e) =>
                    setCard({
                      ...card,
                      expiry: e.target.value
                        .replace(/\D/g, '')
                        .slice(0, 4)
                        .replace(/(.{2})(.+)/, '$1/$2'),
                    })
                  }
                  required
                  className="payment-form-input"
                />
              </div>
              <div className="payment-form-field">
                <Label htmlFor="cardCvc" className="payment-form-label">
                  CVC
                </Label>
                <Input
                  id="cardCvc"
                  inputMode="numeric"
                  placeholder="123"
                  value={card.cvc}
                  onChange={(e) =>
                    setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })
                  }
                  required
                  className="payment-form-input"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="payment-form-error" role="alert">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="payment-form-submit"
            disabled={loading || items.length === 0}
          >
            {loading ? 'Procesando…' : 'Pagar ahora'}
          </Button>

          {loading && (
            <div className="payment-form-processing" aria-live="polite">
              <div className="payment-form-spinner" />
              <span>Procesando tu pago…</span>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
