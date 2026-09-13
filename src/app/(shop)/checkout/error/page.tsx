// src/app/(shop)/checkout/error/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, ShoppingBag } from 'lucide-react';

interface ErrorPageProps {
  searchParams: {
    message?: string;
  };
}

export default function ErrorPage({ searchParams }: ErrorPageProps) {
  const errorMessage =
    searchParams.message || 'Hubo un problema al procesar tu pago. Por favor, intenta de nuevo.';

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center px-4 py-12">
      <Card className="w-full border-white/10 bg-[#1E1E1E]">
        <CardHeader className="pb-4 pt-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/15">
              <AlertCircle className="h-10 w-10 text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Error en el Pago</CardTitle>
          <CardDescription className="text-[#B0B0B0]">
            {decodeURIComponent(errorMessage)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          <div className="rounded-lg border border-red-500/10 bg-red-500/5 p-4 text-center">
            <p className="text-sm text-[#B0B0B0]">
              Si el problema persiste, por favor contacta con nuestro equipo de soporte.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild className="w-full bg-[#FFCB05] text-[#121212] hover:bg-[#E6B800]">
              <Link href="/cart">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Carrito
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-white/10 text-white hover:bg-white/5"
            >
              <Link href="/contact">Contactar Soporte</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-white/10 text-white hover:bg-white/5"
            >
              <Link href="/products">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Seguir Comprando
              </Link>
            </Button>
          </div>

          <div className="border-t border-white/5 pt-4 text-center">
            <h4 className="mb-1 text-sm font-semibold text-white">¿Necesitas ayuda?</h4>
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
  );
}
