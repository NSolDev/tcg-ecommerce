// src/app/(shop)/products/page.tsx
import { getProducts, getSets } from '@/lib/actions/product.actions'
import { ProductCardWrapper } from '@/components/product/ProductCardWrapper'
import { ProductFiltersHorizontal } from '@/components/product/ProductFiltersHorizontal'
import { CollectionNav } from '@/components/product/CollectionNav'
import Link from 'next/link'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Package, Sparkles } from 'lucide-react'
import { CollectionSchema } from '@/components/seo/CollectionSchema'
import { StoreSchema } from '@/components/seo/StoreSchema'
import { Metadata } from 'next'

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

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero del catálogo */}
        <div className="relative mb-8 overflow-hidden rounded-2xl p-8 min-h-[180px] flex items-center bg-gradient-to-r from-[#FFCB05]/20 to-[#2A75BB]/20 border border-white/10">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-[#FFCB05] animate-pulse" />
                Catálogo de Cartas
              </h1>
              <p className="text-white/60 text-lg mt-1">
                {totalCount} cartas disponibles en nuestro catálogo
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm border border-white/10">
              <Package className="w-5 h-5 text-[#FFCB05]" />
              <span className="font-medium text-white">{totalCount} productos</span>
            </div>
          </div>
        </div>

        {/* Navegación por colecciones y categorías */}
        <CollectionNav 
          collections={COLLECTIONS} 
          categories={CATEGORIES} 
        />

        {/* Filtros horizontales */}
        <div className="mb-6">
          <Suspense fallback={<Skeleton className="h-16 w-full" />}>
            <ProductFiltersHorizontal sets={sets} />
          </Suspense>
        </div>

        {/* Lista de productos */}
        <div className="flex flex-col gap-6">
          <main className="flex-1 min-w-0">
            {products.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#1E1E1E] border border-white/5 mb-6">
                  <Package className="h-10 w-10 text-[#B0B0B0]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No se encontraron productos</h3>
                <p className="text-[#B0B0B0] mb-6">
                  Prueba ajustando los filtros o realiza una nueva búsqueda
                </p>
                <Link href="/products" className="inline-flex items-center px-6 py-3 rounded-lg font-semibold text-[#121212] bg-[#FFCB05] hover:bg-[#E6B800] transition-all">
                  Ver todos los productos
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                  {products.map((product) => (
                    <ProductCardWrapper key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={getPageUrl(p)}
                        className={`min-w-[2.5rem] h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                          p === currentPage
                            ? 'bg-[#FFCB05] text-[#121212] shadow-lg shadow-[#FFCB05]/30'
                            : 'bg-[#1E1E1E] border border-white/5 text-[#B0B0B0] hover:border-[#FFCB05]/30 hover:text-white'
                        }`}
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