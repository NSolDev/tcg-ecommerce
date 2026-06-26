// src/app/page.tsx
import { getProducts, getCards, getBoxes, getPacks } from '@/lib/actions/product.actions'
import { InteractiveProductCard } from '@/components/ui/card-7'
import { Header } from '@/components/shared/Header'
import { CartDrawer } from '@/components/cart/CartDrawer'
import SocialCards from '@/components/ui/card-fan-carousel'
import Link from 'next/link'
import { ArrowRight, Package, Shield, Truck, ChevronDown, Sparkles } from 'lucide-react'
import IntroAnimation from '@/components/ui/scroll-morph-hero'
import { PLACEHOLDER_IMAGE } from '@/lib/constants'
import './page.css'

export default async function HomePage() {
  // Obtener productos para el hero
  const { products } = await getProducts({ page: 1, pageSize: 8 })
  
  // Obtener datos específicos
  const cards = await getCards() // Últimas 7 cartas
  const boxes = await getBoxes() // Últimas 4 cajas
  const packs = await getPacks() // Últimos 4 sobres

  // Preparar productos para el hero
  const heroProducts = products.map(p => {
    const primaryImage = p.images?.find(img => img.isPrimary) || p.images?.[0]
    console.log('Producto:', p.name, 'Tiene imágenes:', p.images?.length || 0, 'Primary:', primaryImage?.url)
    return {
      id: p.id,
      name: p.name,
      imageUrl: primaryImage?.url || PLACEHOLDER_IMAGE,
      slug: p.slug,
      images: p.images || [],
    }
  })
  // Preparar datos para el carousel de cartas destacadas
  const carouselCards = cards.map((card) => {
    const primaryImage = card.images?.find(img => img.isPrimary) || card.images?.[0]
    let rarity = ''
    const rarityMap = {
      COMUN: 'Común',
      NORMAL: 'Normal',
      RARA: 'Rara',
      SUPER_RARA: 'Súper Rara',
      SECRETA: 'Secreta',
    }
    rarity = rarityMap[card.card?.rarity as keyof typeof rarityMap] || ''
        
    return {
      imgUrl: primaryImage?.url || PLACEHOLDER_IMAGE,
      alt: card.name,
      title: card.name,
      description: `${card.price.toFixed(2)}€${rarity ? ` · ${rarity}` : ''}`,
      link: `/products/${card.slug}`,
      slug: card.slug,
    }
  })

  return (
    <>
      <Header />
      <main className="home-main">
        {/* Sección 1: Hero */}
        <section id="inicio" className="home-section snap-start">
          <IntroAnimation products={heroProducts} />
          <div className="scroll-indicator">
            <span className="scroll-indicator-text">Desplázate</span>
            <ChevronDown className="scroll-indicator-icon" />
          </div>
        </section>

        {/* Sección 2: Cartas Destacadas con Carousel Fan */}
        <section id="cartas" className="home-section snap-center">
          <div className="home-section-content home-section-content-carousel">
            <div className="section-header">
              <h2 className="section-title">
                <Sparkles className="section-title-icon" />
                Cartas Destacadas
              </h2>
              <p className="section-subtitle">Las cartas más exclusivas de nuestra colección</p>
            </div>
            <div className="carousel-wrapper">
              <SocialCards 
                cards={carouselCards} 
                autoplay={true} 
                interval={5000} 
              />
            </div>
            <div className="section-footer">
              <Link href="/products?category=CARD" className="btn-primary">
                Ver todas las cartas
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Sección 3: Cajas Destacadas */}
        <section id="cajas" className="home-section snap-center">
          <div className="home-section-content">
            <div className="section-header">
              <h2 className="section-title">
                <Package className="section-title-icon" />
                Cajas Destacadas
              </h2>
              <p className="section-subtitle">Las cajas más buscadas por nuestra comunidad</p>
            </div>
            <div className="home-featured-grid">
              {boxes.map((product) => {
                const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]
                return (
                  <InteractiveProductCard
                    key={product.id}
                    slug={product.slug}
                    title={product.name}
                    description={`Caja · ${product.box?.set?.name || ''}`}
                    price={`${product.price.toFixed(2)}€`}
                    imageUrl={primaryImage?.url || PLACEHOLDER_IMAGE}
                    images={product.images}
                    rating={4.9}
                    reviews={128}
                  />
                )
              })}
            </div>
            <div className="section-footer">
              <Link href="/products?category=BOX" className="btn-primary">
                Ver todas las cajas
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Sección 4: Sobres Destacados */}
        <section id="sobres" className="home-section snap-center">
          <div className="home-section-content">
            <div className="section-header">
              <h2 className="section-title">
                <Package className="section-title-icon" />
                Sobres Destacados
              </h2>
              <p className="section-subtitle">Los sobres más populares de nuestra tienda</p>
            </div>
            <div className="home-featured-grid">
              {packs.map((product) => {
                const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]
                return (
                  <InteractiveProductCard
                    key={product.id}
                    slug={product.slug}
                    title={product.name}
                    description={`Sobre · ${product.pack?.set?.name || ''}`}
                    price={`${product.price.toFixed(2)}€`}
                    imageUrl={primaryImage?.url || PLACEHOLDER_IMAGE}
                    images={product.images}
                    rating={4.9}
                    reviews={128}
                  />
                )
              })}
            </div>
            <div className="section-footer">
              <Link href="/products?category=PACK" className="btn-primary">
                Ver todos los sobres
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Sección 5: Beneficios */}
        <section id="beneficios" className="home-section snap-center">
          <div className="home-section-content">
            <div className="section-header">
              <h2 className="section-title">
                <Shield className="section-title-icon" />
                ¿Por qué elegirnos?
              </h2>
              <p className="section-subtitle">Calidad y autenticidad garantizada</p>
            </div>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon-wrapper">
                  <Truck className="benefit-icon" />
                </div>
                <h3 className="benefit-title">Envío Rápido</h3>
                <p className="benefit-description">Entrega en 24-48 horas en toda España</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon-wrapper">
                  <Shield className="benefit-icon" />
                </div>
                <h3 className="benefit-title">100% Auténtico</h3>
                <p className="benefit-description">Todas nuestras cartas son originales y certificadas</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon-wrapper">
                  <Package className="benefit-icon" />
                </div>
                <h3 className="benefit-title">Garantía de Satisfacción</h3>
                <p className="benefit-description">Devolución gratuita si no estás satisfecho</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 6: Ofertas / Call to Action */}
        <section id="ofertas" className="home-section snap-center">
          <div className="home-section-content text-center">
            <div className="relative">
              <div className="home-cta-glow home-cta-glow-1" />
              <div className="home-cta-glow home-cta-glow-2" />
              <div className="relative z-10">
                <h2 className="home-cta-title">¿Listo para empezar tu colección?</h2>
                <p className="home-cta-description">
                  Únete a miles de coleccionistas que confían en TCG Store
                </p>
                <Link href="/products" className="btn-primary">
                  Explorar Catálogo
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <CartDrawer />
    </>
  )
}