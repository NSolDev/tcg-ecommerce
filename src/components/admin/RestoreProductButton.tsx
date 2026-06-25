// src/components/admin/RestoreProductButton.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
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
import { restoreProduct } from '@/lib/actions/admin.actions'

interface RestoreProductButtonProps {
  productId: string
}

export function RestoreProductButton({ productId }: RestoreProductButtonProps) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleRestore = async () => {
    setLoading(true)
    try {
      await restoreProduct(productId)
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error restaurando producto:', error)
      alert('Error al restaurar el producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-green-500/30 hover:border-green-500/50 bg-green-500/10 text-green-400 hover:text-green-300 hover:bg-green-500/20">
          <RefreshCw className="h-4 w-4 mr-2" />
          Restaurar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#1a1a2e] border-white/10 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">¿Restaurar producto?</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Este producto volverá a estar disponible en el catálogo. 
            Los clientes podrán verlo y comprarlo nuevamente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleRestore} 
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            {loading ? 'Restaurando...' : 'Sí, Restaurar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}