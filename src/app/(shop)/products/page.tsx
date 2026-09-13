// src/app/(shop)/products/page.tsx
import { getProducts, getSets } from '@/lib/actions/product.actions';
import { getWishlistProductIds } from '@/lib/actions/wishlist.actions';
import { ProductCardWrapper } from '@/components/product/ProductCardWrapper';
import { ProductFiltersHorizontal } from '@/components/product/ProductFiltersHorizontal';
import Link from 'next/link';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Sparkles } from 'lucide-react';
import { CollectionSchema } from '@/components/seo/CollectionSchema';
import { StoreSchema } from '@/components/seo/StoreSchema';
import { Metadata } from 'next';
import './products-page.css';

export const dynamic = 'force-dynamic';

interface ProductsPageProps {
  searchParams: {
    search?: string;
    set?: string;
    category?: string;
    rarity?: string;
    type?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  };
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const title = searchParams.search
    ? `Resultados para "${searchParams.search}" | TCG Store`
    : 'Catálogo de Cartas Pokémon | TCG Store';

  const description = searchParams.search
    ? `Encuentra ${searchParams.search} en nuestro catálogo de cartas Pokémon.`
    : 'Explora nuestro catálogo de cartas Pokémon, sobres y cajas coleccionables. ¡Envío rápido y 100% auténtico!';

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
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const page = Number(searchParams.page) || 1;
  const pageSize = 12;

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
  ]);

  const wishlistIds = new Set(await getWishlistProductIds());
  const { products, totalPages, currentPage } = productsData;

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams as any);
    params.set('page', String(page));
    return `?${params.toString()}`;
  };

  return (
    <>
      <CollectionSchema
        products={products}
        name="Catálogo de productos"
        description="Explora nuestra colección de cartas, sobres y cajas coleccionables."
      />
      <StoreSchema />

      <div className="products-page">
        {/* Hero del catálogo con imagen de fondo */}
        <div className="products-hero">
          <div className="products-hero-content">
            <div>
              <h1 className="products-hero-title">
                <Sparkles className="icon" />
                Catálogo de productos
              </h1>
            </div>
          </div>
        </div>

        {/* Filtros horizontales */}
        <div className="products-filters-wrapper">
          <Suspense fallback={<Skeleton className="h-16 w-full" />}>
            <ProductFiltersHorizontal sets={sets} />
          </Suspense>
        </div>

        {/* Lista de productos */}
        <div className="flex flex-col gap-6">
          <main className="min-w-0 flex-1">
            {products.length === 0 ? (
              <div className="products-empty">
                <div className="products-empty-icon">
                  <Package />
                </div>
                <h3 className="products-empty-title">No se encontraron productos</h3>
                <p className="products-empty-description">
                  Prueba ajustando los filtros o realiza una nueva búsqueda
                </p>
                <Link href="/products" className="products-empty-button">
                  Ver todos los productos
                </Link>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map((product) => (
                    <ProductCardWrapper
                      key={product.id}
                      product={product}
                      initialInWishlist={wishlistIds.has(product.id)}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="products-pagination">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={getPageUrl(p)}
                        className={`page-btn ${p === currentPage ? 'page-btn-active' : 'page-btn-inactive'}`}
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
  );
}
