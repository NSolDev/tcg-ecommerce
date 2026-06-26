// src/app/(shop)/products/[slug]/page.tsx
import { getProductBySlug, getRelatedProducts } from '@/lib/actions/product.actions'
import { InteractiveProductCard } from '@/components/ui/card-7'
import { ProductDetailCard } from '@/components/product/ProductDetailCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { ProductSchema } from '@/components/seo/ProductSchema'
import { StoreSchema } from '@/components/seo/StoreSchema'
import { PLACEHOLDER_IMAGE } from '@/lib/constants'
import { Metadata } from 'next'
import './product-detail-page.css'

interface ProductDetailPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  try {
    const product = await getProductBySlug(params.slug)
    
    return {
      title: `${product.name} | TCG Store`,
      description: product.description?.slice(0, 160) || `Compra ${product.name} en TCG Store.`,
      openGraph: {
        title: product.name,
        description: product.description?.slice(0, 160) || `Compra ${product.name} en TCG Store.`,
        url: `/products/${product.slug}`,
        type: 'website',
        images: product.images?.length > 0 
          ? [{ url: product.images[0].url }] 
          : [{ url: '/images/placeholder.png' }],
      },
    }
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
    const relatedProducts = await getRelatedProducts(product.id, product.setId || '', product.type)

    return (
      <>
        <ProductSchema product={product} />
        <StoreSchema />

        <div className="product-detail-container">
          <Link href="/products" className="product-detail-back">
            <ArrowLeft className="icon" />
            Volver al catálogo
          </Link>

          <ProductDetailCard product={product} />

          {relatedProducts.length > 0 && (
            <div className="product-related">
              <div className="product-related-header">
                <h2 className="title">Productos Relacionados</h2>
                <Link href="/products" className="link">
                  Ver todos →
                </Link>
              </div>
              <div className="product-related-grid">
                {relatedProducts.map((relatedProduct) => {
                  const relPrimaryImage = relatedProduct.images?.find((img: any) => img.isPrimary) || relatedProduct.images?.[0]
                  const relImageUrl = relPrimaryImage?.url || PLACEHOLDER_IMAGE
                  
                  let setInfo = ''
                  if (relatedProduct.card?.set) {
                    setInfo = relatedProduct.card.set.name
                  } else if (relatedProduct.pack?.set) {
                    setInfo = relatedProduct.pack.set.name
                  } else if (relatedProduct.box?.set) {
                    setInfo = relatedProduct.box.set.name
                  }

                  return (
                    <InteractiveProductCard
                      key={relatedProduct.id}
                      slug={relatedProduct.slug}
                      title={relatedProduct.name}
                      description={relatedProduct.description || `${relatedProduct.type} · ${setInfo}`}
                      price={`${relatedProduct.price.toFixed(2)}€`}
                      imageUrl={relImageUrl}
                      images={relatedProduct.images}
                      rating={4.9}
                      reviews={128}
                    />
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </>
    )
  } catch (error) {
    console.error('Error en detalle de producto:', error)
    notFound()
  }
}