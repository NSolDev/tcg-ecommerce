// src/lib/actions/order.actions.ts
'use server'

import { prisma } from '@/lib/db/prisma'
import { createPaymentIntent } from '@/lib/stripe'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth'

const addressSchema = z.object({
  street: z.string().min(1, 'La calle es requerida'),
  city: z.string().min(1, 'La ciudad es requerida'),
  state: z.string().min(1, 'La provincia es requerida'),
  postalCode: z.string().min(1, 'El código postal es requerido'),
  country: z.string().min(1, 'El país es requerido'),
})

export async function createOrder(
  userId: string,
  items: { productId: string; quantity: number }[],
  address: z.infer<typeof addressSchema>
) {
  try {
    console.log('📦 Creando orden para usuario:', userId)
    console.log('📦 Items:', JSON.stringify(items, null, 2))
    console.log('📦 Dirección:', JSON.stringify(address, null, 2))

    // Validar dirección
    const validatedAddress = addressSchema.parse(address)
    console.log('✅ Dirección validada')

    // Obtener productos
    const productIds = items.map((i) => i.productId)
    console.log('🔍 Buscando productos:', productIds)
    
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    })
    console.log('✅ Productos encontrados:', products.length)

    // Calcular total
    let total = 0
    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product) throw new Error(`Producto ${item.productId} no encontrado`)
      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para ${product.name}`)
      }
      const subtotal = product.price * item.quantity
      total += subtotal
      console.log(`📝 Producto: ${product.name} x${item.quantity} = ${subtotal}€`)
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      }
    })

    console.log('💰 Total de la orden:', total)

    // Crear orden en la base de datos
    console.log('💾 Creando orden en BD...')
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: 'PENDING',
        items: {
          create: orderItems,
        },
        address: {
          create: {
            ...validatedAddress,
            userId,
          },
        },
      },
      include: {
        items: true,
      },
    })
    console.log('✅ Orden creada:', order.id)

    // Crear Payment Intent en Stripe
    console.log('💳 Creando Payment Intent en Stripe...')
    const { clientSecret, paymentIntentId } = await createPaymentIntent(
      total,
      order.id
    )
    console.log('✅ Payment Intent creado:', paymentIntentId)

    // Actualizar orden con el Payment Intent ID
    console.log('💾 Actualizando orden con Payment Intent ID...')
    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripePaymentIntentId: paymentIntentId,
      },
    })
    console.log('✅ Orden actualizada')

    // Reducir stock de productos
    console.log('📦 Reduciendo stock...')
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      })
    }
    console.log('✅ Stock actualizado')

    // Intentar eliminar carrito (si existe) - VERSIÓN MEJORADA
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: true,
        },
      })
      
      if (cart) {
        console.log(`🛒 Carrito encontrado (ID: ${cart.id}) con ${cart.items.length} items`)
        
        // Primero eliminar los items del carrito
        await prisma.cartItem.deleteMany({
          where: { cartId: cart.id },
        })
        console.log('✅ Items del carrito eliminados')
        
        // Luego eliminar el carrito
        await prisma.cart.delete({
          where: { id: cart.id },
        })
        console.log('✅ Carrito eliminado correctamente')
      } else {
        console.log('ℹ️ No se encontró carrito para eliminar')
      }
    } catch (error) {
      // No lanzamos error porque no es crítico para el flujo de la orden
      console.log('⚠️ Error al eliminar carrito (no crítico):', error.message)
      // El error no es crítico, continuamos
    }

    return {
      orderId: order.id,
      clientSecret,
      paymentIntentId,
    }
  } catch (error) {
    console.error('❌ Error en createOrder:', {
      message: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    })
    if (error instanceof z.ZodError) {
      throw new Error(`Dirección inválida: ${error.errors.map(e => e.message).join(', ')}`)
    }
    throw error
  }
}

// ============================================
// FUNCIONES PARA GESTIÓN DE PEDIDOS
// ============================================

export async function completeOrder(orderId: string) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      throw new Error('No autorizado')
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      throw new Error('Orden no encontrada')
    }

    if (order.status !== 'PENDING') {
      throw new Error('Solo se pueden completar pedidos pendientes')
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'COMPLETED',
      },
    })

    revalidatePath('/admin/orders')
    revalidatePath('/admin/orders/' + orderId)
    
    return { success: true, order: updatedOrder }
  } catch (error) {
    console.error('Error completando pedido:', error)
    throw error
  }
}

export async function cancelOrder(orderId: string) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      throw new Error('No autorizado')
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    })

    if (!order) {
      throw new Error('Orden no encontrada')
    }

    if (order.status !== 'PENDING') {
      throw new Error('Solo se pueden cancelar pedidos pendientes')
    }

    // Devolver stock
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      })
    }

    // Cancelar en Stripe
    if (order.stripePaymentIntentId) {
      try {
        const stripe = await import('@/lib/stripe').then(m => m.stripe)
        await stripe.paymentIntents.cancel(order.stripePaymentIntentId)
      } catch (error) {
        console.error('Error cancelando Payment Intent:', error)
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELLED',
      },
    })

    revalidatePath('/admin/orders')
    revalidatePath('/admin/orders/' + orderId)
    
    return { success: true, order: updatedOrder }
  } catch (error) {
    console.error('Error cancelando pedido:', error)
    throw error
  }
}

export async function updateOrderStatus(orderId: string, status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED') {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      throw new Error('No autorizado')
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      throw new Error('Orden no encontrada')
    }

    if (status === 'CANCELLED' && order.status === 'PENDING') {
      const items = await prisma.orderItem.findMany({
        where: { orderId },
      })
      
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        })
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    })

    revalidatePath('/admin/orders')
    revalidatePath('/admin/orders/' + orderId)
    
    return { success: true, order: updatedOrder }
  } catch (error) {
    console.error('Error actualizando estado del pedido:', error)
    throw error
  }
}