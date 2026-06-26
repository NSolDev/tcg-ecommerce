// src/app/(shop)/checkout/error/page.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, ShoppingBag } from 'lucide-react'

interface ErrorPageProps {
  searchParams: {
    message?: string
  }
}

export default function ErrorPage({ searchParams }: ErrorPageProps) {
  const errorMessage = searchParams.message || 'Hubo un problema al procesar tu pago. Por favor, intenta de nuevo.'

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 min-h-[80vh] flex items-center">
      <Card className="w-full bg-[#1E1E1E] border-white/10">
        <CardHeader className="text-center pt-8 pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-red-500/15 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Error en el Pago</CardTitle>
          <CardDescription className="text-[#B0B0B0]">
            {decodeURIComponent(errorMessage)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-4 text-center">
            <p className="text-[#B0B0B0] text-sm">
              Si el problema persiste, por favor contacta con nuestro equipo de soporte.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild className="w-full bg-[#FFCB05] hover:bg-[#E6B800] text-[#121212]">
              <Link href="/cart">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Carrito
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">
              <Link href="/contact">
                Contactar Soporte
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">
              <Link href="/products">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Seguir Comprando
              </Link>
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-white/5">
            <h4 className="text-sm font-semibold text-white mb-1">¿Necesitas ayuda?</h4>
            <p className="text-sm text-[#B0B0B0]">
              Puedes contactarnos en{' '}
              <a href="mailto:soporte@tcgstore.com" className="text-[#FFCB05] hover:underline">
                soporte@tcgstore.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}