// src/app/(shop)/checkout/success/page.tsx
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { ClearCartOnMount } from '@/components/checkout/ClearCartOnMount';

interface SuccessPageProps {
  searchParams: { orderId?: string };
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const orderId = searchParams.orderId;
  const order = orderId
    ? await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { product: true } }, address: true },
      })
    : null;

  // Only the owner may view their order confirmation.
  const notFoundOrForbidden = !order || order.userId !== session.user.id;

  if (notFoundOrForbidden) {
    return (
      <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center px-4 py-12">
        <Card className="w-full border-white/10 bg-[#1E1E1E]">
          <CardHeader className="pb-4 pt-8 text-center">
            <CardTitle className="text-2xl font-bold text-white">Pedido no encontrado</CardTitle>
            <CardDescription className="text-[#B0B0B0]">
              No pudimos encontrar este pedido en tu cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-8">
            <Button asChild className="w-full bg-[#FFCB05] text-[#121212] hover:bg-[#E6B800]">
              <Link href="/orders">Ver Mis Pedidos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center px-4 py-12">
      <ClearCartOnMount />
      <Card className="w-full border-white/10 bg-[#1E1E1E]">
        <CardHeader className="pb-4 pt-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/15">
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">¡Pago Exitoso!</CardTitle>
          <CardDescription className="text-[#B0B0B0]">
            Tu pedido ha sido confirmado. Recibirás un email con los detalles.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          <div className="space-y-2 rounded-lg border border-white/5 bg-white/5 p-4">
            <div className="flex justify-between">
              <span className="text-[#B0B0B0]">Número de pedido</span>
              <span className="font-medium text-white">#{order.id.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#B0B0B0]">Total</span>
              <span className="font-bold text-[#FFCB05]">{formatPrice(order.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#B0B0B0]">Estado</span>
              <span className="rounded-full border border-green-500/15 bg-green-500/15 px-2 py-0.5 text-xs font-medium text-green-400">
                {order.status === 'COMPLETED' ? 'Completado' : 'Pendiente'}
              </span>
            </div>
          </div>

          {order.address && (
            <div className="rounded-lg border border-white/5 bg-white/5 p-4">
              <h3 className="mb-2 text-sm font-semibold text-white">Dirección de Envío</h3>
              <div className="space-y-0.5 text-sm text-[#B0B0B0]">
                <p>{order.address.street}</p>
                <p>
                  {order.address.city}, {order.address.state}
                </p>
                <p>
                  {order.address.postalCode}, {order.address.country}
                </p>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-white/5 bg-white/5 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <Package className="h-4 w-4 text-[#FFCB05]" />
              Productos
            </h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0"
                >
                  <div>
                    <p className="text-sm text-white">{item.product.name}</p>
                    <p className="text-xs text-[#B0B0B0]">
                      {item.quantity} x {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-white">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between border-t border-white/10 pt-3 text-base font-bold">
              <span className="text-white">Total</span>
              <span className="text-[#FFCB05]">{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="flex-1 bg-[#FFCB05] text-[#121212] hover:bg-[#E6B800]">
              <Link href="/products">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Seguir Comprando
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 border-white/10 text-white hover:bg-white/5"
            >
              <Link href="/orders">Mis Pedidos</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
