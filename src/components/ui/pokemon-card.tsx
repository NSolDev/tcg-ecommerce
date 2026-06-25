// src/components/ui/pokemon-card.tsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ShoppingCart, Star, Sparkles, Zap, Shield, Check } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { Product } from '@prisma/client'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'sonner'

interface PokemonCardProps {
  product: Product
}

export function PokemonCard({ product }: PokemonCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const rarityColors = {
    COMUN: 'from-gray-500 to-gray-700',
    NORMAL: 'from-blue-500 to-blue-700',
    RARA: 'from-purple-500 to-purple-700',
    SUPER_RARA: 'from-orange-500 to-orange-700',
    SECRETA: 'from-red-500 to-red-700',
  }

  const rarityGlow = {
    COMUN: 'shadow-gray-500/20',
    NORMAL: 'shadow-blue-500/20',
    RARA: 'shadow-purple-500/20',
    SUPER_RARA: 'shadow-orange-500/20',
    SECRETA: 'shadow-red-500/20',
  }

  const rarityLabels = {
    COMUN: 'Común',
    NORMAL: 'Normal',
    RARA: 'Rara',
    SUPER_RARA: 'Súper Rara',
    SECRETA: 'Secreta',
  }

  const categoryLabels = {
    CARD: '🃏 Carta',
    PACK: '📦 Sobre',
    BOX: '📦 Caja',
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className={`group relative h-full overflow-hidden transition-all duration-500 bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] border border-white/10 hover:border-primary/30 ${rarityGlow[product.rarity]} hover:shadow-2xl`}>
        {/* Efecto de escaneo holográfico */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1500 ease-in-out delay-300" />
        </div>

        {/* Efecto de brillo en hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/10 to-transparent" />
          <div className="absolute inset-0 shimmer" />
        </div>

        {/* Badge de rareza con efecto neón */}
        <div className={`absolute top-3 left-3 z-10 bg-gradient-to-r ${rarityColors[product.rarity]} rounded-full p-0.5 animate-glow-pulse`}>
          <Badge className="bg-black/80 text-white border-0 px-3 py-1.5 flex items-center gap-1.5 backdrop-blur-sm text-xs">
            <Sparkles className="w-3 h-3 animate-pulse" />
            {rarityLabels[product.rarity]}
          </Badge>
        </div>

        {/* Badge de tipo */}
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-white/10 backdrop-blur-sm border-white/20 text-white/80 px-3 py-1 text-xs">
            <Zap className="w-3 h-3 mr-1" />
            {product.type}
          </Badge>
        </div>

        <Link href={`/products/${product.slug}`}>
          {/* CardHeader con imagen */}
          <div className="p-4 pb-2">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a]">
              <div className={`absolute inset-0 bg-gradient-to-r ${rarityColors[product.rarity]} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-3xl`} />
              
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain p-4 transition-all duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
              />
              
              {product.stock === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                  <Badge variant="destructive" className="text-base px-4 py-2 animate-pulse">
                    Agotado
                  </Badge>
                </div>
              )}

              <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-white/20 group-hover:border-primary/50 transition-colors duration-500" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-white/20 group-hover:border-primary/50 transition-colors duration-500" />
            </div>
          </div>

          {/* CardContent */}
          <div className="p-4 pt-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base line-clamp-1 group-hover:text-primary transition-colors duration-300 text-white">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1 opacity-75">
                  {product.description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              <Badge variant="outline" className="border-white/10 bg-white/5 text-white/70 text-[10px] px-2 py-0.5">
                {product.condition}
              </Badge>
              {product.hp && (
                <Badge variant="outline" className="border-white/10 bg-white/5 text-white/70 text-[10px] px-2 py-0.5">
                  ❤️ {product.hp}
                </Badge>
              )}
              {product.attack && (
                <Badge variant="outline" className="border-white/10 bg-white/5 text-white/70 text-[10px] px-2 py-0.5">
                  ⚔️ {product.attack}
                </Badge>
              )}
              {/* Badge de categoría movido aquí, dentro del contenido */}
              <Badge variant="outline" className="border-white/10 bg-white/5 text-white/70 text-[10px] px-2 py-0.5">
                {categoryLabels[product.category as keyof typeof categoryLabels] || '📦 Producto'}
              </Badge>
            </div>

            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-white/80">4.9</span>
              </div>
              <span className="text-white/40">•</span>
              <span className="text-white/60">128 reseñas</span>
              <span className="text-white/40">•</span>
              <span className="text-white/60 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Auténtico
              </span>
            </div>
          </div>

          {/* CardFooter con precio y botón - sin badge de categoría */}
          <div className="p-4 pt-0 flex items-center justify-between">
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {formatPrice(product.price)}
              </span>
              {product.stock > 0 && product.stock < 5 && (
                <p className="text-[10px] text-orange-400 animate-pulse mt-0.5">
                  ⚡ ¡Últimas {product.stock} unidades!
                </p>
              )}
            </div>
            <Button
              size="sm"
              disabled={product.stock === 0 || isAdding}
              className={`relative overflow-hidden transition-all duration-300 text-xs px-4 py-2 h-9 ${
                isHovered ? 'shadow-lg shadow-primary/30' : ''
              } ${isAdded ? 'bg-green-500 hover:bg-green-600' : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary'}`}
              onClick={handleAddToCart}
            >
              <span className="relative z-10 flex items-center gap-1.5">
                {isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Añadido
                  </>
                ) : isAdding ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Añadiendo...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                    Comprar
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            </Button>
          </div>
        </Link>

        {/* Efecto de borde neón */}
        <div className="neon-border" />
      </Card>
    </motion.div>
  )
}