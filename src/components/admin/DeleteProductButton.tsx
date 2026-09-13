// src/components/admin/DeleteProductButton.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
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
import { deleteProduct } from '@/lib/actions/admin.actions';

interface DeleteProductButtonProps {
  productId: string;
}

export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteProduct(productId);
      setOpen(false);
    } catch (error) {
      console.error('Error eliminando producto:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error al eliminar el producto');
      }
      setLoading(false);
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
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-white/10 bg-[#1E1E1E] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription className="text-B0B0B0">
            {error ? (
              <span className="text-red-400">{error}</span>
            ) : (
              'Esta acción no se puede deshacer. El producto será eliminado permanentemente.'
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-white/10 bg-white/5 text-white hover:bg-white/10">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
