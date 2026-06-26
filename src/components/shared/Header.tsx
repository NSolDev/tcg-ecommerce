// src/components/shared/Header.tsx
'use client'

import { useCartStore } from '@/store/cartStore'
import { ShoppingCart, Sparkles, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserButton } from './UserButton'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import './header.css'

export function Header() {
  const { getTotalItems, openCart } = useCartStore()
  const totalItems = getTotalItems()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const headerClass = `tcg-header ${isScrolled ? 'scrolled' : ''}`

  return (
    <header className={headerClass}>
      <div className="tcg-header-container">
        {/* Logo */}
        <Link href="/" className="tcg-logo">
          <div className="tcg-logo-wrapper">
            <div className="tcg-logo-glow" />
            <div className="tcg-logo-icon">
              <Sparkles className="tcg-logo-sparkle" />
            </div>
          </div>
          <div>
            <span className="tcg-logo-text">TCG Store</span>
            <span className="tcg-logo-subtitle">⚡ Pokémon Center</span>
          </div>
        </Link>

        {/* Navegación Desktop */}
        <nav className="tcg-nav">
          <Link href="/products" className="tcg-nav-link">Catálogo</Link>
          <Link href="/wishlist" className="tcg-nav-link">Favoritos</Link>
        </nav>

        {/* Acciones */}
        <div className="tcg-actions">
          <Button
            variant="ghost"
            size="icon"
            className="tcg-cart-btn"
            onClick={openCart}
          >
            <ShoppingCart className="h-5 w-5" />
            {isMounted && totalItems > 0 && (
              <Badge className="tcg-cart-badge">
                {totalItems}
              </Badge>
            )}
          </Button>
          <UserButton />
          
          {/* Menú móvil */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#1E1E1E] border-t border-white/10 p-4">
          <nav className="flex flex-col gap-3">
            <Link 
              href="#catalogo" 
              className="text-white/70 hover:text-white transition-colors" 
              onClick={() => setIsMenuOpen(false)}
            >
              Catálogo
            </Link>
            <Link 
              href="#colecciones" 
              className="text-white/70 hover:text-white transition-colors" 
              onClick={() => setIsMenuOpen(false)}
            >
              Colecciones
            </Link>
            <Link 
              href="#ofertas" 
              className="text-white/70 hover:text-white transition-colors" 
              onClick={() => setIsMenuOpen(false)}
            >
              Ofertas
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}