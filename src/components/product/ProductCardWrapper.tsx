// src/components/product/ProductCardWrapper.tsx
'use client'

import { InteractiveProductCard } from '@/components/ui/card-7'
import { useCartStore } from '@/store/cartStore'
import { Product } from '@prisma/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { getConditionLabel, getCategoryLabel } from '@/lib/utils'

interface ProductCardWrapperProps {
  product: Product & {
    images?: { id: string; url: string; isPrimary: boolean; order: number }[]
    card?: { set: { name: string }; rarity: string; condition: string }
    pack?: { set: { name: string } }
    box?: { set: { name: string } }
  }
}

export function ProductCardWrapper({ product }: ProductCardWrapperProps) {
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)

  // Obtener la imagen principal
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]
  const imageUrl = primaryImage?.url || '/images/placeholder.png'

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      id: product.slug,
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: imageUrl,
      stock: product.stock,
    })
    
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
  }

  const handleCardClick = () => {
    router.push(`/products/${product.slug}`)
  }

  // Determinar el tipo de producto
  let typeLabel = ''
  let setInfo = ''
  let conditionText = ''
  
  if (product.card) {
    typeLabel = 'Carta'
    setInfo = product.card.set?.name || ''
    conditionText = getConditionLabel(product.card.condition || '')
  } else if (product.pack) {
    typeLabel = 'Sobre'
    setInfo = product.pack.set?.name || ''
  } else if (product.box) {
    typeLabel = 'Caja'
    setInfo = product.box.set?.name || ''
  }

  const description = `${typeLabel}${setInfo ? ` · ${setInfo}` : ''}${conditionText ? ` · ${conditionText}` : ''}`

  return (
    <InteractiveProductCard
      slug={product.slug}
      title={product.name}
      description={description}
      price={`${product.price.toFixed(2)}€`}
      imageUrl={imageUrl}
      images={product.images}
      onAddToCart={handleAddToCart}
      onCardClick={handleCardClick}
    />
  )
}