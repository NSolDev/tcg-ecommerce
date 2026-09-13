// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f1a' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: {
    default: 'TCG Store - Cartas Coleccionables Pokémon',
    template: '%s | TCG Store',
  },
  description:
    'Compra y vende cartas coleccionables de Pokémon, sobres y cajas. Envío rápido, 100% auténtico y garantía de satisfacción.',
  keywords: [
    'cartas Pokémon',
    'coleccionables',
    'TCG',
    'Pokémon',
    'sobres Pokémon',
    'cajas Pokémon',
    'cartas coleccionables',
    'tienda Pokémon',
    'Ascended Heroes',
    'Prismatic Evolutions',
    'Surging Sparks',
  ],
  authors: [{ name: 'TCG Store', url: 'https://tcgstore.com' }],
  creator: 'TCG Store',
  publisher: 'TCG Store',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website', // Cambiado de 'website' a 'website' (ya era correcto)
    locale: 'es_ES',
    url: 'https://tcgstore.com',
    siteName: 'TCG Store',
    title: 'TCG Store - Cartas Coleccionables Pokémon',
    description:
      'Compra y vende cartas coleccionables de Pokémon, sobres y cajas. Envío rápido, 100% auténtico.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TCG Store - Cartas Coleccionables Pokémon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TCG Store - Cartas Coleccionables Pokémon',
    description: 'Compra y vende cartas coleccionables de Pokémon, sobres y cajas.',
    images: ['/og-image.jpg'],
    creator: '@tcgstore',
    site: '@tcgstore',
  },
  category: 'ecommerce',
  classification: 'Tienda de cartas coleccionables',
  other: {
    'geo:region': 'ES-MD',
    'geo:placename': 'Madrid',
    'geo:position': '40.416775;-3.703790',
    ICBM: '40.416775, -3.703790',
    language: 'es-ES',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <head>
        <meta name="geo.region" content="ES-MD" />
        <meta name="geo.placename" content="Madrid" />
        <meta name="geo.position" content="40.416775;-3.703790" />
        <meta name="ICBM" content="40.416775, -3.703790" />
        <meta name="language" content="es-ES" />
        <meta name="revisit-after" content="1 days" />
        <meta name="distribution" content="global" />
        <link rel="alternate" hrefLang="es" href="https://tcgstore.com" />
      </head>
      <body className={`${inter.variable} bg-[#0f0f1a] font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#1a1a2e',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
              },
              className: 'border border-white/10 backdrop-blur-sm',
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
