// src/components/admin/DeleteUserButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserX } from 'lucide-react';
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
} from '@/components/ui/alert-dialog';
import { deleteUser } from '@/lib/actions/admin.actions';

interface DeleteUserButtonProps {
  userId: string;
  isAdmin: boolean;
}

export function DeleteUserButton({ userId, isAdmin }: DeleteUserButtonProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteUser(userId);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      alert(error instanceof Error ? error.message : 'Error al eliminar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="border border-red-500/20 bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300"
        >
          <UserX className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-white/10 bg-[#1E1E1E] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">¿Eliminar usuario?</AlertDialogTitle>
          <AlertDialogDescription className="text-B0B0B0">
            {isAdmin
              ? 'Este usuario es administrador. Asegúrate de que haya otro administrador antes de eliminarlo.'
              : 'Esta acción eliminará permanentemente al usuario y todos sus datos asociados.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-white/10 bg-white/5 text-white hover:bg-white/10">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600"
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
