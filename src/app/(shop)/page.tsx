// src/app/(shop)/page.tsx
import { getProducts } from '@/lib/actions/product.actions'
import { PokemonCard } from '@/components/ui/pokemon-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight, Package, Shield, Truck, Sparkles, Zap } from 'lucide-react'

export default async function HomePage() {
  const { products } = await getProducts({
    page: 1,
    pageSize: 8,
  })

  return (
    <main>
      {/* Hero Section con efecto de partículas */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent" />
        <div className="absolute inset-0 bg-[url('/patterns/pokeball-pattern.svg')] opacity-5" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">⚡ ¡Nuevas colecciones disponibles!</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pokemon-red via-pokemon-yellow to-pokemon-blue bg-clip-text text-transparent animate-glow-pulse">
                TCG Store
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              El mejor lugar para comprar y vender cartas coleccionables de Pokémon y más
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="group relative overflow-hidden">
                <Link href="/products">
                  <span className="relative z-10 flex items-center gap-2">
                    Ver Catálogo
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 hover:border-primary/50 bg-white/5 backdrop-blur-sm">
                <Link href="/products?rarity=SUPER_RARA">
                  <Zap className="w-4 h-4 mr-2" />
                  Colecciones Raras
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Efecto de glow animado */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '2s' }} />
      </section>

      {/* Beneficios con íconos animados */}
      <section className="py-12 bg-[#0f0f1a]/30 backdrop-blur-sm border-t border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Truck className="h-6 w-6 text-primary animate-float-slow" />
                  </div>
                  <CardTitle className="text-white/90">Envío Rápido</CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">
                  Entrega en 24-48 horas en toda España
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Shield className="h-6 w-6 text-primary animate-float-slow" style={{ animationDelay: '0.5s' }} />
                  </div>
                  <CardTitle className="text-white/90">100% Auténtico</CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">
                  Todas nuestras cartas son originales y certificadas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Package className="h-6 w-6 text-primary animate-float-slow" style={{ animationDelay: '1s' }} />
                  </div>
                  <CardTitle className="text-white/90">Garantía de Satisfacción</CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">
                  Devolución gratuita si no estás satisfecho
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Productos Destacados
              </h2>
              <p className="text-muted-foreground mt-1">
                Las cartas más buscadas por nuestra comunidad
              </p>
            </div>
            <Button asChild variant="outline" className="border-white/20 hover:border-primary/50 bg-white/5 backdrop-blur-sm group">
              <Link href="/products" className="flex items-center gap-2">
                Ver todos
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <PokemonCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action con efecto de glow */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10" />
        <div className="absolute inset-0 bg-[url('/patterns/pokeball-pattern.svg')] opacity-10" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            ¿Listo para empezar tu colección?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Únete a miles de coleccionistas que confían en TCG Store
          </p>
          <Button asChild size="lg" className="group relative overflow-hidden">
            <Link href="/products">
              <span className="relative z-10 flex items-center gap-2">
                Explorar Catálogo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}