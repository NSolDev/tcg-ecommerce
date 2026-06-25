// src/app/(shop)/products/page.tsx
import { getProducts, getSets } from '@/lib/actions/product.actions'
import { PokemonCard } from '@/components/ui/pokemon-card'
import { ProductFilters } from '@/components/product/ProductFilters'
import { CollectionNav } from '@/components/product/CollectionNav'
import Link from 'next/link'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Package, Sparkles } from 'lucide-react'
import { CollectionSchema } from '@/components/seo/CollectionSchema'
import { StoreSchema } from '@/components/seo/StoreSchema'
import { Metadata } from 'next'
import './products-page.css'

interface ProductsPageProps {
  searchParams: {
    search?: string
    set?: string
    category?: string
    rarity?: string
    type?: string
    minPrice?: string
    maxPrice?: string
    page?: string
  }
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const title = searchParams.search 
    ? `Resultados para "${searchParams.search}" | TCG Store`
    : 'Catálogo de Cartas Pokémon | TCG Store'
  
  const description = searchParams.search
    ? `Encuentra ${searchParams.search} en nuestro catálogo de cartas Pokémon.`
    : 'Explora nuestro catálogo de cartas Pokémon, sobres y cajas coleccionables. ¡Envío rápido y 100% auténtico!'

  return {
    title,
    description,
    keywords: ['cartas Pokémon', 'catálogo', 'TCG', 'coleccionables', 'Pokémon'],
    openGraph: {
      title,
      description,
      url: '/products',
      type: 'website',
    },
  }
}

// Colecciones disponibles
const COLLECTIONS = [
  'Ascended Heroes',
  'Astral Radiance',
  'Black Bolt & White Flames',
  'Chaos Rising',
  'Megaevolution',
  'Perfect Order',
  'Pitch Black',
  'Prismatic Evolutions',
  'Rebel Clash',
  'Surging Sparks',
  'Twilight Masquerade'
]

const CATEGORIES = [
  { value: 'CARD', label: '🃏 Cartas Individuales', icon: '🃏' },
  { value: 'PACK', label: '📦 Sobres', icon: '📦' },
  { value: 'BOX', label: '📦 Cajas y Colecciones', icon: '📦' },
]

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const page = Number(searchParams.page) || 1
  const pageSize = 12

  const [productsData, sets] = await Promise.all([
    getProducts({
      search: searchParams.search,
      set: searchParams.set,
      category: searchParams.category as any,
      rarity: searchParams.rarity,
      type: searchParams.type,
      minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
      maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
      page,
      pageSize,
    }),
    getSets(),
  ])

  const { products, totalCount, totalPages, currentPage } = productsData

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams as any)
    params.set('page', String(page))
    return `?${params.toString()}`
  }

  return (
    <>
      <CollectionSchema 
        products={products}
        name="Catálogo de Cartas Pokémon"
        description="Explora nuestra colección de cartas Pokémon, sobres y cajas coleccionables."
      />
      <StoreSchema />

      <div className="catalog-container">
        {/* Hero del catálogo */}
        <div className="catalog-hero">
          <div className="catalog-hero-content">
            <div>
              <h1 className="catalog-hero-title">
                <Sparkles className="icon" />
                Catálogo de Cartas
              </h1>
              <p className="catalog-hero-subtitle">
                {totalCount} cartas disponibles en nuestro catálogo
              </p>
            </div>
            <div className="catalog-hero-stats">
              <Package className="icon" />
              <span>{totalCount} productos</span>
            </div>
          </div>
        </div>

        {/* Navegación por colecciones y categorías */}
        <CollectionNav 
          collections={COLLECTIONS} 
          categories={CATEGORIES} 
        />

        <div className="catalog-layout">
          {/* Sidebar con filtros */}
          <aside className="catalog-sidebar">
            <Suspense fallback={<Skeleton className="h-96" />}>
              <ProductFilters sets={sets} />
            </Suspense>
          </aside>

          {/* Lista de productos */}
          <main className="catalog-main">
            {products.length === 0 ? (
              <div className="catalog-empty">
                <div className="catalog-empty-icon">
                  <Package />
                </div>
                <h3 className="catalog-empty-title">No se encontraron productos</h3>
                <p className="catalog-empty-description">
                  Prueba ajustando los filtros o realiza una nueva búsqueda
                </p>
                <Link href="/products" className="catalog-empty-button">
                  Ver todos los productos
                </Link>
              </div>
            ) : (
              <>
                <div className="catalog-products-grid">
                  {products.map((product) => (
                    <PokemonCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="catalog-pagination">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={getPageUrl(p)}
                        className={`page-btn ${p === currentPage ? 'active' : ''}`}
                      >
                        {p}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  )
}