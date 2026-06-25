// src/app/(shop)/products/[slug]/page.tsx
import { getProductBySlug, getRelatedProducts } from '@/lib/actions/product.actions'
import { PokemonCard } from '@/components/ui/pokemon-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Heart, ArrowLeft, Zap, Shield, Sparkles, Truck, Package } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import { AddToCartButton } from '@/components/product/AddToCartButton'
import { ProductSchema } from '@/components/seo/ProductSchema'
import { generateProductMetadata } from '@/components/seo/ProductMetadata'
import { StoreSchema } from '@/components/seo/StoreSchema'
import './product-detail.css'

interface ProductDetailPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  try {
    const product = await getProductBySlug(params.slug)
    return generateProductMetadata({ product })
  } catch {
    return {
      title: 'Producto no encontrado | TCG Store',
      description: 'El producto que buscas no está disponible.',
    }
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  try {
    const product = await getProductBySlug(params.slug)
    const relatedProducts = await getRelatedProducts(product.id, product.setId, product.category)

    const rarityLabels = {
      COMUN: 'Común',
      NORMAL: 'Normal',
      RARA: 'Rara',
      SUPER_RARA: 'Súper Rara',
      SECRETA: 'Secreta',
    }

    const rarityClass = {
      COMUN: 'rarity-comun',
      NORMAL: 'rarity-normal',
      RARA: 'rarity-rara',
      SUPER_RARA: 'rarity-super_rara',
      SECRETA: 'rarity-secreta',
    }

    const categoryLabels = {
      CARD: '🃏 Carta Individual',
      PACK: '📦 Sobre',
      BOX: '📦 Caja / Colección',
    }

    const stockStatusClass = product.stock === 0 
      ? 'out-of-stock' 
      : product.stock < 5 
        ? 'low-stock' 
        : 'in-stock'

    const stockStatusText = product.stock === 0 
      ? 'Agotado' 
      : product.stock < 5 
        ? `${product.stock} unidades disponibles` 
        : `${product.stock} unidades disponibles`

    return (
      <>
        <ProductSchema product={product} />
        <StoreSchema />

        <div className="product-detail-container">
          {/* Botón de volver */}
          <Link href="/products" className="product-detail-back">
            <ArrowLeft className="icon" />
            Volver al catálogo
          </Link>

          <div className="product-detail-grid">
            {/* Imagen */}
            <div className="product-detail-image">
              <div className="image-glow" />
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="image"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="corner-tl" />
              <div className="corner-br" />
            </div>

            {/* Información del producto */}
            <div className="product-detail-info">
              <div>
                <div className="product-detail-badges">
                  <Badge className={`product-detail-badge ${rarityClass[product.rarity]}`}>
                    <Sparkles className="w-3 h-3" />
                    {rarityLabels[product.rarity]}
                  </Badge>
                  <Badge className="product-detail-badge set">
                    {product.set.name}
                  </Badge>
                  <Badge className="product-detail-badge category">
                    {categoryLabels[product.category as keyof typeof categoryLabels] || product.category}
                  </Badge>
                </div>
                <h1 className="product-detail-name">{product.name}</h1>
                <p className="product-detail-price">{formatPrice(product.price)}</p>
              </div>

              <Separator className="product-detail-separator" />

              <div className="product-detail-description">
                <div>
                  <h3 className="label">Descripción</h3>
                  <p className="text">{product.description}</p>
                </div>

                <div className="product-detail-specs">
                  <div className="spec">
                    <span className="label">Tipo</span>
                    <span className="value">{product.type}</span>
                  </div>
                  <div className="spec">
                    <span className="label">Condición</span>
                    <span className="value">{product.condition}</span>
                  </div>
                  {product.hp && (
                    <div className="spec">
                      <span className="label">HP</span>
                      <span className="value">{product.hp}</span>
                    </div>
                  )}
                  {product.attack && (
                    <div className="spec">
                      <span className="label">Ataque</span>
                      <span className="value">{product.attack}</span>
                    </div>
                  )}
                  {product.weakness && (
                    <div className="spec">
                      <span className="label">Debilidad</span>
                      <span className="value">{product.weakness}</span>
                    </div>
                  )}
                  {product.evolution && (
                    <div className="spec">
                      <span className="label">Evolución</span>
                      <span className="value">{product.evolution}</span>
                    </div>
                  )}
                  <div className="spec">
                    <span className="label">Stock</span>
                    <span className={`value ${stockStatusClass}`}>{stockStatusText}</span>
                  </div>
                </div>
              </div>

              <Separator className="product-detail-separator" />

              <div className="product-detail-actions">
                <AddToCartButton product={product} />
                <Button variant="outline" className="border-white/10 hover:border-primary/50 bg-white/5 text-white hover:text-white">
                  <Heart className="h-5 w-5 mr-2" />
                  Añadir a Favoritos
                </Button>
              </div>

              {/* Beneficios */}
              <div className="product-detail-benefits">
                <div className="benefit">
                  <Truck className="icon" />
                  <p className="label">Envío Rápido</p>
                </div>
                <div className="benefit">
                  <Shield className="icon" />
                  <p className="label">100% Auténtico</p>
                </div>
                <div className="benefit">
                  <Package className="icon" />
                  <p className="label">Garantía</p>
                </div>
              </div>
            </div>
          </div>

          {/* Productos relacionados */}
          {relatedProducts.length > 0 && (
            <div className="product-related">
              <div className="product-related-header">
                <h2 className="title">Productos Relacionados</h2>
                <Link href="/products" className="link">
                  Ver todos →
                </Link>
              </div>
              <div className="product-related-grid">
                {relatedProducts.map((product) => (
                  <PokemonCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    )
  } catch (error) {
    notFound()
  }
}