// src/app/(shop)/orders/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, Eye } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import Link from 'next/link'
import './orders-page.css'

export default async function OrdersPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const statusLabels: Record<string, string> = {
    PENDING: 'Pendiente',
    COMPLETED: 'Completado',
    CANCELLED: 'Cancelado',
    REFUNDED: 'Reembolsado',
  }

  const statusClasses: Record<string, string> = {
    PENDING: 'orders-card-status-pending',
    COMPLETED: 'orders-card-status-completed',
    CANCELLED: 'orders-card-status-cancelled',
    REFUNDED: 'orders-card-status-refunded',
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h1 className="orders-header-title">Mis Pedidos</h1>
          <p className="orders-header-subtitle">Historial de tus compras</p>
        </div>
        <Button asChild variant="outline" className="orders-header-action">
          <Link href="/products">
            Seguir Comprando
          </Link>
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card className="orders-empty">
          <CardContent className="orders-empty-content">
            <div className="orders-empty-icon">
              <Package />
            </div>
            <h3 className="orders-empty-title">No tienes pedidos</h3>
            <p className="orders-empty-description">
              Aún no has realizado ninguna compra
            </p>
            <Button asChild className="orders-empty-button">
              <Link href="/products">Explorar Catálogo</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <Card key={order.id} className="orders-card">
              <CardHeader className="orders-card-header">
                <div>
                  <CardTitle className="orders-card-id">
                    Pedido #{order.id.slice(0, 8)}
                  </CardTitle>
                  <CardDescription className="orders-card-date">
                    {formatDate(order.createdAt)}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={statusClasses[order.status]}>
                    {statusLabels[order.status]}
                  </Badge>
                  <span className="orders-card-total">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="orders-card-content">
                <div className="orders-card-items">
                  {order.items.slice(0, 3).map((item) => (
                    <Badge key={item.id} variant="outline" className="orders-card-item-badge">
                      {item.quantity}x {item.productId.slice(0, 8)}
                    </Badge>
                  ))}
                  {order.items.length > 3 && (
                    <Badge variant="outline" className="orders-card-more">
                      +{order.items.length - 3} más
                    </Badge>
                  )}
                </div>
                <Button variant="outline" size="sm" asChild className="orders-card-detail-btn">
                  <Link href={`/orders/${order.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}