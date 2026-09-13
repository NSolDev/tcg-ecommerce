// src/app/(shop)/orders/[id]/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, MapPin, CreditCard, User } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '../order-detail.css';

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: {
          product: true,
        },
      },
      address: true,
    },
  });

  if (!order || order.userId !== session.user.id) {
    notFound();
  }

  const statusLabels: Record<string, string> = {
    PENDING: 'Pendiente',
    COMPLETED: 'Completado',
    CANCELLED: 'Cancelado',
    REFUNDED: 'Reembolsado',
  };

  const statusClasses: Record<string, string> = {
    PENDING: 'order-detail-status-pending',
    COMPLETED: 'order-detail-status-completed',
    CANCELLED: 'order-detail-status-cancelled',
    REFUNDED: 'order-detail-status-refunded',
  };

  return (
    <div className="order-detail-page">
      <div className="order-detail-header">
        <Button variant="outline" size="sm" asChild className="order-detail-back">
          <Link href="/orders">
            <ArrowLeft className="icon" />
            Volver
          </Link>
        </Button>
        <div className="order-detail-info">
          <h1 className="order-detail-id">Pedido #{order.id.slice(0, 8)}</h1>
          <p className="order-detail-date">Realizado el {formatDate(order.createdAt)}</p>
        </div>
        <Badge className={`order-detail-status-badge ${statusClasses[order.status]}`}>
          {statusLabels[order.status]}
        </Badge>
      </div>

      <div className="order-detail-grid">
        {/* Información del Cliente */}
        <Card className="order-detail-card">
          <CardHeader className="order-detail-card-header">
            <CardTitle className="order-detail-card-title">
              <User className="icon" />
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="order-detail-card-content">
            <p className="order-detail-card-text">{order.user.name || 'Sin nombre'}</p>
            <p className="order-detail-card-sub">{order.user.email}</p>
          </CardContent>
        </Card>

        {/* Dirección de Envío */}
        <Card className="order-detail-card">
          <CardHeader className="order-detail-card-header">
            <CardTitle className="order-detail-card-title">
              <MapPin className="icon" />
              Dirección de Envío
            </CardTitle>
          </CardHeader>
          <CardContent className="order-detail-card-content">
            {order.address ? (
              <>
                <p className="order-detail-card-text">{order.address.street}</p>
                <p className="order-detail-card-sub">
                  {order.address.city}, {order.address.state}
                </p>
                <p className="order-detail-card-sub">
                  {order.address.postalCode}, {order.address.country}
                </p>
              </>
            ) : (
              <p className="order-detail-card-sub">Sin dirección registrada</p>
            )}
          </CardContent>
        </Card>

        {/* Información del Pago */}
        <Card className="order-detail-card">
          <CardHeader className="order-detail-card-header">
            <CardTitle className="order-detail-card-title">
              <CreditCard className="icon" />
              Información del Pago
            </CardTitle>
          </CardHeader>
          <CardContent className="order-detail-card-content">
            <div className="order-detail-card-row">
              <span className="label">Total</span>
              <span className="value">{formatPrice(order.total)}</span>
            </div>
            <div className="order-detail-card-row">
              <span className="label">Estado</span>
              <Badge variant={order.status === 'COMPLETED' ? 'default' : 'outline'}>
                {statusLabels[order.status]}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Productos del Pedido */}
      <div className="order-detail-products">
        <Card className="order-detail-products-card">
          <CardHeader className="order-detail-products-header">
            <CardTitle className="order-detail-products-title">
              <Package className="icon" />
              Productos
            </CardTitle>
          </CardHeader>
          <CardContent className="order-detail-products-content">
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="order-detail-product-item">
                  <div>
                    <p className="order-detail-product-name">{item.product.name}</p>
                    <p className="order-detail-product-meta">
                      {item.quantity} x {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="order-detail-product-price">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
              <Separator className="order-detail-separator" />
              <div className="order-detail-total">
                <span className="label">Total</span>
                <span className="value">{formatPrice(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
