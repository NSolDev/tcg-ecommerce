// src/components/shared/Header.tsx
'use client'

import { useCartStore } from '@/store/cartStore'
import { ShoppingCart, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserButton } from './UserButton'
import Link from 'next/link'

export function Header() {
  const { getTotalItems, openCart } = useCartStore()
  const totalItems = getTotalItems()

  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo con temática Pokémon */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pokemon-red to-pokemon-yellow rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-r from-pokemon-red to-pokemon-yellow p-2 rounded-full">
              <Sparkles className="h-6 w-6 text-white animate-pulse" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              TCG Store
            </span>
            <span className="hidden md:inline ml-2 text-xs text-muted-foreground">
              ⚡ Pokémon Center
            </span>
          </div>
        </Link>

        {/* Navegación */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
            Catálogo
          </Link>
          <Link href="/wishlist" className="text-sm font-medium hover:text-primary transition-colors">
            Favoritos
          </Link>
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-primary/10 transition-colors"
            onClick={openCart}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge
                className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center bg-pokemon-red text-white text-xs font-bold animate-pulse"
              >
                {totalItems}
              </Badge>
            )}
          </Button>
          <UserButton />
        </div>
      </div>
    </header>
  )
}