'use client'

import { Product } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.slug,
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock,
    })
  }

  const rarityColors = {
    COMUN: 'bg-gray-400',
    NORMAL: 'bg-blue-400',
    RARA: 'bg-purple-400',
    SUPER_RARA: 'bg-orange-400',
    SECRETA: 'bg-red-500',
  }

  const rarityLabels = {
    COMUN: 'Común',
    NORMAL: 'Normal',
    RARA: 'Rara',
    SUPER_RARA: 'Súper Rara',
    SECRETA: 'Secreta',
  }

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/products/${product.slug}`}>
        <CardHeader className="p-0">
          <div className="relative aspect-square">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <Badge
              className={`absolute top-2 right-2 ${rarityColors[product.rarity]} text-white`}
            >
              {rarityLabels[product.rarity]}
            </Badge>
            {product.stock === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Badge variant="destructive" className="text-lg px-4 py-2">
                  Agotado
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {product.description}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{product.type}</Badge>
            <Badge variant="outline">{product.condition}</Badge>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <span className="text-xl font-bold">{formatPrice(product.price)}</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-red-500"
              aria-label="Añadir a favoritos"
              onClick={(e) => {
                e.preventDefault()
                // TODO: Añadir a favoritos
              }}
            >
              <Heart className="h-5 w-5" />
            </Button>

            // En el botón de añadir al carrito:
            <Button
              size="icon"
              disabled={product.stock === 0}
              aria-label="Añadir al carrito"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </CardFooter>
      </Link>
    </Card>
  )
}