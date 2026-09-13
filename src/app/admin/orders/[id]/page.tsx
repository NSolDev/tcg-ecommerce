// src/app/admin/orders/[id]/page.tsx
import { prisma } from '@/lib/db/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, User, MapPin, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatPrice, formatDate } from '@/lib/utils';
import { CompleteOrderButton, CancelOrderButton } from '@/components/admin/OrderActionButtons';

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
      address: true,
    },
  });

  if (!order) {
    notFound();
  }

  const statusColors = {
    PENDING: 'bg-yellow-500',
    COMPLETED: 'bg-green-500',
    CANCELLED: 'bg-red-500',
    REFUNDED: 'bg-gray-500',
  };

  const statusLabels = {
    PENDING: 'Pendiente',
    COMPLETED: 'Completado',
    CANCELLED: 'Cancelado',
    REFUNDED: 'Reembolsado',
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Pedido #{order.id.slice(0, 8)}</h1>
          <p className="text-muted-foreground">Realizado el {formatDate(order.createdAt)}</p>
        </div>
        <Badge className={`ml-auto ${statusColors[order.status]} text-white`}>
          {statusLabels[order.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Información del Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4" />
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-medium">{order.user.name || 'Sin nombre'}</p>
            <p className="text-sm text-muted-foreground">{order.user.email}</p>
            <p className="text-sm text-muted-foreground">ID: {order.user.id.slice(0, 8)}</p>
          </CardContent>
        </Card>

        {/* Dirección de Envío */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4" />
              Dirección de Envío
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {order.address ? (
              <>
                <p className="font-medium">{order.address.street}</p>
                <p className="text-sm text-muted-foreground">
                  {order.address.city}, {order.address.state}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.address.postalCode}, {order.address.country}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">Sin dirección registrada</p>
            )}
          </CardContent>
        </Card>

        {/* Información del Pago */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <CreditCard className="h-4 w-4" />
              Información del Pago
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold">{formatPrice(order.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado</span>
              <Badge variant={order.status === 'COMPLETED' ? 'default' : 'outline'}>
                {statusLabels[order.status]}
              </Badge>
            </div>
            {order.stripePaymentIntentId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stripe ID</span>
                <span className="max-w-[120px] truncate font-mono text-xs">
                  {order.stripePaymentIntentId.slice(0, 16)}...
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Productos del Pedido */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Productos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {order.items.length === 0 ? (
            <p className="text-muted-foreground">No hay productos en este pedido</p>
          ) : (
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acciones del Pedido - USANDO LOS NUEVOS COMPONENTES */}
      <div className="flex gap-4">
        {order.status === 'PENDING' && (
          <>
            <CompleteOrderButton orderId={order.id} />
            <CancelOrderButton orderId={order.id} />
          </>
        )}
        {order.status === 'COMPLETED' && <Button variant="outline">Ver Factura</Button>}
      </div>
    </div>
  );
}
