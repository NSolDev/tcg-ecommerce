// src/components/ui/scroll-morph-hero.tsx
'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PLACEHOLDER_IMAGE } from '@/lib/constants'
import { getLocalImage } from '@/lib/imageMap'
import './scroll-morph-hero.css'

interface IntroAnimationProps {
  products?: {
    id: string
    name: string
    imageUrl?: string
    images?: { id: string; url: string; isPrimary: boolean; order: number }[]
    slug?: string
  }[]
}

export default function IntroAnimation({ products = [] }: IntroAnimationProps) {
  const [isClient, setIsClient] = useState(false)
  // Estado para rastrear qué imágenes han fallado
  const [failedRemoteImages, setFailedRemoteImages] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setIsClient(true)
  }, [])

  const colors = ['#FFCB05', '#2A75BB', '#FFCB05']

  // ═══════════════════════════════════════════════════════════
  // 🔥 LÓGICA CORRECTA DE FALLBACK
  // ═══════════════════════════════════════════════════════════
  const getImageUrl = (product: IntroAnimationProps['products'][0]) => {
    if (!product) return PLACEHOLDER_IMAGE

    const productId = product.id || ''

    // 1️⃣ PRIMERO: Intentar usar la URL de la base de datos (Cardmarket)
    //    Si esta URL ya falló, saltar al siguiente paso
    if (!failedRemoteImages[productId]) {
      const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]
      if (primaryImage?.url) {
        return primaryImage.url
      }
      if (product.imageUrl) {
        return product.imageUrl
      }
    }

    // 2️⃣ SEGUNDO: Si la URL remota falló, usar imagen local por slug
    if (product.slug) {
      const localImage = getLocalImage(product.slug)
      if (localImage) {
        return localImage
      }
    }

    // 3️⃣ TERCERO: Si todo falla, usar placeholder
    return PLACEHOLDER_IMAGE
  }

  // Manejador de error - cuando la imagen remota falla
  const handleRemoteImageError = (productId: string) => {
    // Marcar la URL remota como fallida para usar el fallback local
    setFailedRemoteImages(prev => {
      // Si ya está marcada, no hacer nada
      if (prev[productId]) return prev
      console.log(`🔄 Imagen remota fallida para ${productId}, usando fallback local`)
      return { ...prev, [productId]: true }
    })
  }

  // Productos de ejemplo con imágenes locales (fallback)
  const defaultProducts = [
    { 
      id: 'default-1', 
      name: 'Charizard ex', 
      imageUrl: '/images/products/charizard-ex.png',
      slug: 'charizard-ex-ascended-heroes'
    },
    { 
      id: 'default-2', 
      name: 'Mewtwo VSTAR', 
      imageUrl: '/images/products/mewtwo-vstar.jpg',
      slug: 'mewtwo-vstar-prismatic-evolutions'
    },
    { 
      id: 'default-3', 
      name: 'Pikachu ex', 
      imageUrl: '/images/products/pikachu-ex.jpg',
      slug: 'pikachu-ex-surging-sparks'
    },
    { 
      id: 'default-4', 
      name: 'Gengar ex', 
      imageUrl: '/images/products/gengar-ex.jpg',
      slug: 'gengar-ex-twilight-masquerade'
    },
    { 
      id: 'default-5', 
      name: 'Gardevoir ex', 
      imageUrl: '/images/products/gardevoir-ex.jpg',
      slug: 'gardevoir-ex-151'
    },
    { 
      id: 'default-6', 
      name: 'Sobre Ascended Heroes', 
      imageUrl: '/images/products/pack-ascended-heroes.png',
      slug: 'pack-ascended-heroes'
    },
    { 
      id: 'default-7', 
      name: 'Caja Megaevolution', 
      imageUrl: '/images/products/box-megaevolution.jpg',
      slug: 'box-megaevolution-mega-lucario-elite-trainer'
    },
    { 
      id: 'default-8', 
      name: 'Sobre Surging Sparks', 
      imageUrl: '/images/products/pack-surging-sparks.jpg',
      slug: 'pack-surging-sparks'
    },
  ]

  const hasRealProducts = products && products.length > 0
  const itemsToShow = hasRealProducts ? products.slice(0, 8) : defaultProducts

  if (!isClient) {
    return (
      <div className="scroll-morph-hero flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#FFCB05]">TCG Store</h1>
          <p className="text-[#B0B0B0] mt-4">Cargando experiencia...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="scroll-morph-hero">
      {/* Fondo holográfico */}
      <motion.div
        className="holo-background"
        animate={{
          background: [
            `radial-gradient(circle at 20% 50%, ${colors[0]}33, transparent 50%)`,
            `radial-gradient(circle at 80% 50%, ${colors[1]}33, transparent 50%)`,
            `radial-gradient(circle at 50% 80%, ${colors[0]}33, transparent 50%)`,
            `radial-gradient(circle at 20% 50%, ${colors[0]}33, transparent 50%)`,
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Productos en órbita */}
      <div className="orbit-container">
        {itemsToShow.map((product, i) => {
          const angle = (i / itemsToShow.length) * Math.PI * 2
          const radius = 360 
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          const borderColor = colors[i % colors.length]
          const sizes = [
            'size-xl',  // 14rem (224px)
            'size-lg',  // 12rem (192px)
            'size-md',  // 10rem (160px)
            'size-sm',  // 8rem  (128px)
            'size-xl',  // 14rem (224px)
            'size-lg',  // 12rem (192px)
            'size-md',  // 10rem (160px)
            'size-sm',  // 8rem  (128px)
          ]
          const productId = product.id || `product-${i}`
          const imageUrl = getImageUrl(product)

          return (
            <motion.div
              key={productId}
              className={`orbit-item ${sizes[i % sizes.length]}`}
              style={{
                x,
                y,
                borderColor: borderColor,
                boxShadow: `0 0 30px ${borderColor}30`,
              }}
              animate={{
                rotate: [0, 360],
                scale: [0.8, 1.1, 0.8],
              }}
              transition={{
                rotate: { duration: 25 + i * 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <Image
                src={imageUrl}
                alt={product.name || `Producto ${i + 1}`}
                fill
                className="object-cover p-1"
                sizes="96px"
                priority={i < 4}
                onError={() => handleRemoteImageError(productId)}
                unoptimized={true}
              />
            </motion.div>
          )
        })}
      </div>

      {/* Texto y CTA */}
      <div className="hero-content">
        <motion.h1
          className="hero-title"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="block text-[#FFCB05]">TCG Store</span>
          <span className="block text-xl md:text-2xl lg:text-3xl text-[#B0B0B0] font-normal mt-4">
            Cartas Coleccionables Pokémon
          </span>
        </motion.h1>

        <motion.div
          className="mt-8"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Link
            href="/products"
            className="btn-primary"
          >
            Explorar Catálogo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}