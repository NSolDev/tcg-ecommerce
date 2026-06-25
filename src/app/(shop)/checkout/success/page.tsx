// src/app/(shop)/checkout/success/page.tsx
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface SuccessPageProps {
  searchParams: {
    orderId?: string
  }
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  if (!searchParams.orderId) {
    redirect('/')
  }

  const order = await prisma.order.findUnique({
    where: { id: searchParams.orderId },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
      address: true,
    },
  })

  if (!order || order.userId !== session.user.id) {
    redirect('/')
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">¡Pago Exitoso!</CardTitle>
          <CardDescription>
            Tu pedido ha sido confirmado. Recibirás un email con los detalles.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Número de pedido</span>
              <span className="font-medium">#{order.id.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold">{formatPrice(order.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado</span>
              <span className="text-green-500 font-medium">
                {order.status === 'COMPLETED' ? 'Completado' : 'Pendiente'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Dirección de Envío</h3>
            <div className="text-sm text-muted-foreground">
              <p>{order.address?.street}</p>
              <p>
                {order.address?.city}, {order.address?.state}
              </p>
              <p>
                {order.address?.postalCode}, {order.address?.country}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Productos</h3>
            <div className="space-y-2">
              {order.items.map((item: { id: string; product: { name: string }; quantity: number; price: number }) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.product.name} x{item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button asChild className="flex-1">
              <Link href="/products">Seguir Comprando</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/account/orders">Mis Pedidos</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}