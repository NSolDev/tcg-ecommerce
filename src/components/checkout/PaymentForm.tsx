// src/components/checkout/PaymentForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCartStore } from '@/store/cartStore'
import { loadStripe } from '@stripe/stripe-js'
import './payment-form.css'

interface PaymentFormProps {
  userId: string
}

export function PaymentForm({ userId }: PaymentFormProps) {
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'España',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (items.length === 0) {
      setError('El carrito está vacío')
      return
    }

    setLoading(true)
    setError(null)
    setProcessing(true)

    try {
      // 1. Crear la orden y obtener clientSecret
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          address,
          userId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la orden')
      }

      // 2. Cargar Stripe y confirmar el pago
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      if (!stripe) {
        throw new Error('No se pudo cargar Stripe')
      }

      const { error: stripeError } = await stripe.confirmPayment({
        clientSecret: data.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?orderId=${data.orderId}`,
        },
      })

      if (stripeError) {
        // 3. Si hay error, confirmar con el servidor para actualizar estado
        await fetch('/api/checkout/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: data.paymentIntentId,
            orderId: data.orderId,
          }),
        })

        throw new Error(stripeError.message || 'Error al procesar el pago')
      }

      // 4. Éxito - limpiar carrito y redirigir
      clearCart()
      router.push(`/checkout/success?orderId=${data.orderId}`)

    } catch (error) {
      console.error('Error en checkout:', error)
      const message = error instanceof Error ? error.message : 'Error al procesar el pago'
      setError(message)
      setLoading(false)
      setProcessing(false)
      // Redirigir a página de error con el mensaje
      router.push(`/checkout/error?message=${encodeURIComponent(message)}`)
    }
  }

  return (
    <Card className="payment-form-card">
      <CardHeader className="payment-form-header">
        <CardTitle className="payment-form-title">Información de Envío</CardTitle>
        <CardDescription className="payment-form-description">
          Completa tus datos para finalizar la compra
        </CardDescription>
      </CardHeader>
      <CardContent className="payment-form-content">
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="payment-form-field">
            <Label htmlFor="street" className="payment-form-label">Calle</Label>
            <Input
              id="street"
              placeholder="Calle Principal 123"
              value={address.street}
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
              required
              className="payment-form-input"
            />
          </div>

          <div className="payment-form-row">
            <div className="payment-form-field">
              <Label htmlFor="city" className="payment-form-label">Ciudad</Label>
              <Input
                id="city"
                placeholder="Madrid"
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
                required
                className="payment-form-input"
              />
            </div>
            <div className="payment-form-field">
              <Label htmlFor="state" className="payment-form-label">Provincia</Label>
              <Input
                id="state"
                placeholder="Madrid"
                value={address.state}
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
                }
                required
                className="payment-form-input"
              />
            </div>
          </div>

          <div className="payment-form-row">
            <div className="payment-form-field">
              <Label htmlFor="postalCode" className="payment-form-label">Código Postal</Label>
              <Input
                id="postalCode"
                placeholder="28001"
                value={address.postalCode}
                onChange={(e) =>
                  setAddress({ ...address, postalCode: e.target.value })
                }
                required
                className="payment-form-input"
              />
            </div>
            <div className="payment-form-field">
              <Label htmlFor="country" className="payment-form-label">País</Label>
              <Input
                id="country"
                value={address.country}
                onChange={(e) =>
                  setAddress({ ...address, country: e.target.value })
                }
                required
                className="payment-form-input"
              />
            </div>
          </div>

          {error && (
            <div className="payment-form-error">{error}</div>
          )}

          <Button
            type="submit"
            className="payment-form-submit"
            disabled={loading || items.length === 0}
          >
            {loading ? 'Procesando...' : 'Pagar con Stripe'}
          </Button>

          {processing && (
            <div className="payment-form-processing">
              <div className="payment-form-spinner"></div>
              <span>Procesando tu pago...</span>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}