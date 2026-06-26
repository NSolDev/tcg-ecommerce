// src/app/(shop)/checkout/success/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/store/cartStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle, Package, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface SuccessPageProps {
  searchParams: {
    orderId?: string
  }
}

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const clearCart = useCartStore((state) => state.clearCart)
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated' && searchParams.orderId) {
      fetch(`/api/orders/${searchParams.orderId}`)
        .then(res => {
          if (!res.ok) throw new Error('No se pudo cargar el pedido')
          return res.json()
        })
        .then(data => {
          setOrder(data)
          setLoading(false)
        })
        .catch(err => {
          console.error('Error:', err)
          setError(err.message || 'Error al cargar el pedido')
          setLoading(false)
        })
    } else if (status === 'authenticated' && !searchParams.orderId) {
      setError('No se encontró el pedido')
      setLoading(false)
    }
  }, [status, searchParams.orderId, router])

  if (status === 'loading' || loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 min-h-[80vh] flex items-center justify-center">
        <p className="text-[#B0B0B0]">Cargando tu pedido...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 min-h-[80vh] flex items-center">
        <Card className="w-full bg-[#1E1E1E] border-white/10">
          <CardHeader className="text-center pt-8 pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-red-500/15 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-red-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">Error</CardTitle>
            <CardDescription className="text-[#B0B0B0]">
              {error || 'No se pudo cargar el pedido'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-8">
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full bg-[#FFCB05] hover:bg-[#E6B800] text-[#121212]">
                <Link href="/orders">Ver Mis Pedidos</Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">
                <Link href="/products">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Seguir Comprando
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 min-h-[80vh] flex items-center">
      <Card className="w-full bg-[#1E1E1E] border-white/10">
        <CardHeader className="text-center pt-8 pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">¡Pago Exitoso!</CardTitle>
          <CardDescription className="text-[#B0B0B0]">
            Tu pedido ha sido confirmado. Recibirás un email con los detalles.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          <div className="bg-white/5 border border-white/5 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-[#B0B0B0]">Número de pedido</span>
              <span className="text-white font-medium">#{order.id.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#B0B0B0]">Total</span>
              <span className="text-[#FFCB05] font-bold">{formatPrice(order.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#B0B0B0]">Estado</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/15">
                {order.status === 'COMPLETED' ? 'Completado' : 'Pendiente'}
              </span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-2">Dirección de Envío</h3>
            <div className="text-sm text-[#B0B0B0] space-y-0.5">
              <p>{order.address?.street}</p>
              <p>{order.address?.city}, {order.address?.state}</p>
              <p>{order.address?.postalCode}, {order.address?.country}</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-[#FFCB05]" />
              Productos
            </h3>
            <div className="space-y-2">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
                  <div>
                    <p className="text-sm text-white">{item.product.name}</p>
                    <p className="text-xs text-[#B0B0B0]">{item.quantity} x {formatPrice(item.price)}</p>
                  </div>
                  <span className="text-sm text-white font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-base pt-3 mt-2 border-t border-white/10">
              <span className="text-white">Total</span>
              <span className="text-[#FFCB05]">{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1 bg-[#FFCB05] hover:bg-[#E6B800] text-[#121212]">
              <Link href="/products">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Seguir Comprando
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 border-white/10 text-white hover:bg-white/5">
              <Link href="/orders">Mis Pedidos</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}