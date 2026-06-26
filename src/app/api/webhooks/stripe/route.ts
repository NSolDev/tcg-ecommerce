// src/app/api/webhooks/stripe/route.ts
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db/prisma'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    console.log('📨 Webhook recibido')
    console.log('📨 Signature:', signature ? 'Presente' : 'No presente')
    console.log('📨 Body length:', body.length)

    if (!signature) {
      console.error('❌ No stripe-signature header')
      return NextResponse.json(
        { error: 'No stripe-signature header' },
        { status: 400 }
      )
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('❌ STRIPE_WEBHOOK_SECRET no configurada')
      return NextResponse.json(
        { error: 'STRIPE_WEBHOOK_SECRET no configurada' },
        { status: 500 }
      )
    }

    let event: Stripe.Event

    try {
      // Verificar webhook
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
      console.log('✅ Webhook verificado:', event.type)
    } catch (err) {
      console.error('❌ Error verificando webhook:', err)
      return NextResponse.json(
        { error: 'Webhook inválido' },
        { status: 400 }
      )
    }

    // Manejar eventos
    try {
      switch (event.type) {
        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent
          const orderId = paymentIntent.metadata.orderId
          console.log('💰 Payment succeeded for order:', orderId)

          if (orderId) {
            await prisma.order.update({
              where: { id: orderId },
              data: {
                status: 'COMPLETED',
              },
            })
            console.log('✅ Order updated to COMPLETED:', orderId)
          }
          break
        }

        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent
          const orderId = paymentIntent.metadata.orderId
          console.log('❌ Payment failed for order:', orderId)

          if (orderId) {
            await prisma.order.update({
              where: { id: orderId },
              data: {
                status: 'CANCELLED',
              },
            })
            console.log('✅ Order updated to CANCELLED:', orderId)
          }
          break
        }

        case 'payment_intent.canceled': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent
          const orderId = paymentIntent.metadata.orderId
          console.log('🔄 Payment canceled for order:', orderId)

          if (orderId) {
            await prisma.order.update({
              where: { id: orderId },
              data: {
                status: 'CANCELLED',
              },
            })
            console.log('✅ Order updated to CANCELLED:', orderId)
          }
          break
        }

        default:
          console.log('📌 Evento no manejado:', event.type)
      }

      return NextResponse.json({ received: true })
    } catch (error) {
      console.error('❌ Error procesando webhook:', error)
      return NextResponse.json(
        { error: 'Error procesando webhook' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('❌ Error general en webhook:', error)
    return NextResponse.json(
      { error: 'Error general' },
      { status: 500 }
    )
  }
}