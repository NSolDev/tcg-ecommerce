// src/app/(shop)/wishlist/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { InteractiveProductCard } from '@/components/ui/card-7'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { PLACEHOLDER_IMAGE } from '@/lib/constants'
import './wishlist-page.css'

export default async function WishlistPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Obtener wishlist del usuario con los productos
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                orderBy: { order: 'asc' },
              },
              card: {
                include: {
                  set: true,
                },
              },
              pack: {
                include: {
                  set: true,
                },
              },
              box: {
                include: {
                  set: true,
                },
              },
            },
          },
        },
      },
    },
  })

  const products = wishlist?.items.map((item) => item.product) || []

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <div>
          <h1 className="wishlist-header-title">
            <Heart className="icon" />
            Favoritos
          </h1>
          <p className="wishlist-header-subtitle">
            {products.length} productos en tu lista de favoritos
          </p>
        </div>
        <Button asChild variant="outline" className="wishlist-header-action">
          <Link href="/products">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Seguir Comprando
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <Card className="wishlist-empty">
          <CardContent className="wishlist-empty-content">
            <div className="wishlist-empty-icon">
              <Heart className="w-12 h-12" />
            </div>
            <h3 className="wishlist-empty-title">No tienes favoritos</h3>
            <p className="wishlist-empty-description">
              Explora nuestro catálogo y guarda tus cartas favoritas
            </p>
            <Button asChild className="wishlist-empty-button">
              <Link href="/products">Explorar Catálogo</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="wishlist-grid">
          {products.map((product) => {
            const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]
            const imageUrl = primaryImage?.url || PLACEHOLDER_IMAGE

            // Determinar tipo y set
            let typeLabel = ''
            let setInfo = ''
            
            if (product.card) {
              typeLabel = 'Carta'
              setInfo = product.card.set?.name || ''
            } else if (product.pack) {
              typeLabel = 'Sobre'
              setInfo = product.pack.set?.name || ''
            } else if (product.box) {
              typeLabel = 'Caja'
              setInfo = product.box.set?.name || ''
            }

            const description = `${typeLabel}${setInfo ? ` · ${setInfo}` : ''}`

            return (
              <InteractiveProductCard
                key={product.id}
                slug={product.slug}
                title={product.name}
                description={description}
                price={`${product.price.toFixed(2)}€`}
                imageUrl={imageUrl}
                images={product.images}
                rating={4.9}
                reviews={128}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}