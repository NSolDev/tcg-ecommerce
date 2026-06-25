// src/components/product/AddToCartButton.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Check } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Product } from '@prisma/client'
import { toast } from 'sonner'

interface AddToCartButtonProps {
  product: Product
  size?: 'default' | 'lg' | 'sm'
  className?: string
}

export function AddToCartButton({ product, size = 'lg', className = '' }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    if (product.stock === 0) return
    
    setIsAdding(true)
    
    addItem({
      id: product.slug,
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock,
    })
    
    setIsAdded(true)
    toast.success(`${product.name} añadido al carrito`, {
      duration: 2000,
      position: 'bottom-right',
      action: {
        label: 'Ver carrito',
        onClick: () => {
          useCartStore.getState().openCart()
        },
      },
    })
    
    setTimeout(() => {
      setIsAdded(false)
      setIsAdding(false)
    }, 1500)
  }

  const buttonSizes = {
    sm: 'h-9 px-4 text-sm',
    default: 'h-10 px-6',
    lg: 'h-12 px-8 text-lg',
  }

  return (
    <Button
      size={size}
      disabled={product.stock === 0 || isAdding}
      className={`relative overflow-hidden transition-all duration-300 ${isAdded ? 'bg-green-500 hover:bg-green-600' : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary'} ${buttonSizes[size]} ${className}`}
      onClick={handleAddToCart}
    >
      <span className="relative z-10 flex items-center gap-2">
        {isAdded ? (
          <>
            <Check className="h-5 w-5" />
            Añadido
          </>
        ) : isAdding ? (
          <>
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Añadiendo...
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" />
            Añadir al Carrito
          </>
        )}
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
    </Button>
  )
}