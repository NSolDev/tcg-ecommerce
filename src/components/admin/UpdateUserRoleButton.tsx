// src/components/admin/UpdateUserRoleButton.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Shield, ShieldOff } from 'lucide-react'
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
import { updateUserRole } from '@/lib/actions/admin.actions'

interface UpdateUserRoleButtonProps {
  userId: string
  currentRole: string
}

export function UpdateUserRoleButton({ userId, currentRole }: UpdateUserRoleButtonProps) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const isAdmin = currentRole === 'ADMIN'

  const handleUpdateRole = async () => {
    setLoading(true)
    try {
      const newRole = isAdmin ? 'USER' : 'ADMIN'
      await updateUserRole(userId, newRole)
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error actualizando rol:', error)
      alert(error instanceof Error ? error.message : 'Error al actualizar el rol')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={
            isAdmin 
              ? 'border-red-500/20 hover:border-red-500/30 bg-red-500/10 text-red-400 hover:text-red-300' 
              : 'border-green-500/20 hover:border-green-500/30 bg-green-500/10 text-green-400 hover:text-green-300'
          }
        >
          {isAdmin ? (
            <ShieldOff className="h-4 w-4" />
          ) : (
            <Shield className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#1E1E1E] border-white/10 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            {isAdmin ? '¿Quitar rol de administrador?' : '¿Asignar rol de administrador?'}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-B0B0B0">
            {isAdmin 
              ? 'Este usuario perderá todos los privilegios de administrador.'
              : 'Este usuario obtendrá acceso al panel de administración.'
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleUpdateRole} 
            disabled={loading}
            className={isAdmin ? 'bg-red-500 hover:bg-red-600' : 'bg-[#FFCB05] hover:bg-[#E6B800] text-[#121212]'}
          >
            {loading ? 'Actualizando...' : 'Confirmar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}