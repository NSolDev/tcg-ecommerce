// src/lib/actions/order.actions.ts
'use server';

import { prisma } from '@/lib/db/prisma';
import { getStripe } from '@/lib/stripe';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import type { OrderStatus } from '@prisma/client';

const addressSchema = z.object({
  street: z.string().min(1, 'La calle es requerida'),
  city: z.string().min(1, 'La ciudad es requerida'),
  state: z.string().min(1, 'La provincia es requerida'),
  postalCode: z.string().min(1, 'El código postal es requerido'),
  country: z.string().min(1, 'El país es requerido'),
});

const itemsSchema = z
  .array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().min(1),
    })
  )
  .min(1, 'El carrito está vacío');

function toMessage(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.errors.map((e) => e.message).join(', ');
  }
  return error instanceof Error ? error.message : 'Error desconocido';
}

/**
 * Creates an order from the cart, reserving stock atomically, then settles
 * payment. Payment is HYBRID: a real Stripe TEST PaymentIntent when Stripe keys
 * are configured, otherwise a simulated success. Prices and stock are validated
 * server-side — client cart data (names/prices) is never trusted.
 */
export async function createOrder(
  items: z.infer<typeof itemsSchema>,
  address: z.infer<typeof addressSchema>
) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Debes iniciar sesión para completar la compra');
  }
  const userId = session.user.id;

  const validatedItems = itemsSchema.parse(items);
  const validatedAddress = addressSchema.parse(address);

  // Reserve stock + create the PENDING order atomically so we never oversell.
  const order = await prisma.$transaction(async (tx) => {
    const products = await tx.product.findMany({
      where: { id: { in: validatedItems.map((i) => i.productId) }, isActive: true },
    });
    const byId = new Map(products.map((p) => [p.id, p]));

    let total = 0;
    const orderItems = validatedItems.map((item) => {
      const product = byId.get(item.productId);
      if (!product) {
        throw new Error(`Producto no disponible: ${item.productId}`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para ${product.name}`);
      }
      total += product.price * item.quantity;
      return { productId: product.id, quantity: item.quantity, price: product.price };
    });

    const created = await tx.order.create({
      data: {
        userId,
        total,
        status: 'PENDING',
        items: { create: orderItems },
        address: { create: { ...validatedAddress, userId } },
      },
    });

    for (const item of validatedItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return created;
  });

  // Settle payment outside the DB transaction (external call).
  try {
    const stripe = getStripe();
    if (stripe) {
      // Real Stripe TEST mode: confirm server-side with a test payment method.
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.total * 100),
        currency: 'eur',
        metadata: { orderId: order.id },
        payment_method: 'pm_card_visa',
        confirm: true,
        automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
      });
      if (paymentIntent.status !== 'succeeded') {
        throw new Error('El pago no pudo completarse');
      }
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'COMPLETED', stripePaymentIntentId: paymentIntent.id },
      });
    } else {
      // Simulated payment (no Stripe keys configured).
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'COMPLETED' },
      });
    }
  } catch (error) {
    // Payment failed: release the reserved stock and cancel the order.
    await prisma.$transaction(async (tx) => {
      const failed = await tx.order.findUnique({
        where: { id: order.id },
        include: { items: true },
      });
      if (failed && failed.status === 'PENDING') {
        for (const item of failed.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
        await tx.order.update({ where: { id: order.id }, data: { status: 'CANCELLED' } });
      }
    });
    throw new Error(toMessage(error));
  }

  revalidatePath('/orders');
  revalidatePath('/products');
  return { orderId: order.id };
}

// ============================================
// GESTIÓN DE PEDIDOS (ADMIN)
// ============================================

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('No autorizado');
  }
  return session;
}

export async function completeOrder(orderId: string) {
  await requireAdmin();

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error('Orden no encontrada');
  if (order.status !== 'PENDING') {
    throw new Error('Solo se pueden completar pedidos pendientes');
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: 'COMPLETED' },
  });

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true, order: updatedOrder };
}

export async function cancelOrder(orderId: string) {
  await requireAdmin();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) throw new Error('Orden no encontrada');
  if (order.status !== 'PENDING') {
    throw new Error('Solo se pueden cancelar pedidos pendientes');
  }

  await prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }
    await tx.order.update({ where: { id: orderId }, data: { status: 'CANCELLED' } });
  });

  // Best-effort: cancel the Stripe PaymentIntent if one exists.
  const stripe = getStripe();
  if (stripe && order.stripePaymentIntentId) {
    try {
      await stripe.paymentIntents.cancel(order.stripePaymentIntentId);
    } catch (error) {
      console.error('Error cancelando Payment Intent:', toMessage(error));
    }
  }

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await requireAdmin();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) throw new Error('Orden no encontrada');

  await prisma.$transaction(async (tx) => {
    // Restock only when moving out of a stock-holding state into CANCELLED.
    if (status === 'CANCELLED' && order.status === 'PENDING') {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }
    await tx.order.update({ where: { id: orderId }, data: { status } });
  });

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}
