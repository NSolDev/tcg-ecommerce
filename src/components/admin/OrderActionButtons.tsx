// src/components/admin/OrderActionButtons.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { completeOrder, cancelOrder } from '@/lib/actions/order.actions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { CheckCircle, XCircle } from 'lucide-react'

interface CompleteOrderButtonProps {
  orderId: string
}

export function CompleteOrderButton({ orderId }: CompleteOrderButtonProps) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleComplete = async () => {
    setLoading(true)
    try {
      await completeOrder(orderId)
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error completando pedido:', error)
      alert('Error al completar el pedido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <CheckCircle className="h-4 w-4" />
          Marcar como Completado
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#1a1a2e] border-white/10 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">¿Confirmar pedido?</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Esta acción marcará el pedido como completado.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleComplete} disabled={loading} className="bg-primary hover:bg-primary/80 text-white">
            {loading ? 'Completando...' : 'Completar Pedido'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

interface CancelOrderButtonProps {
  orderId: string
}

export function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleCancel = async () => {
    setLoading(true)
    try {
      await cancelOrder(orderId)
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error cancelando pedido:', error)
      alert('Error al cancelar el pedido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <XCircle className="h-4 w-4" />
          Cancelar Pedido
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#1a1a2e] border-white/10 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">¿Cancelar pedido?</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Esta acción cancelará el pedido y devolverá el stock.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
            Volver
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleCancel} disabled={loading} className="bg-red-500 hover:bg-red-600 text-white">
            {loading ? 'Cancelando...' : 'Sí, Cancelar Pedido'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}