// src/app/sitemap.ts
import { prisma } from '@/lib/db/prisma'

export default async function sitemap() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://tcgstore.com'

  // Obtener todos los productos activos
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      updatedAt: true,
      category: true,
    },
  })

  // Obtener todas las colecciones
  const sets = await prisma.set.findMany({
    select: {
      id: true,
      name: true,
      updatedAt: true,
    },
  })

  // URLs estáticas
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
  ]

  // URLs de productos
  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: product.category === 'CARD' ? 0.8 : 0.7,
  }))

  // URLs de colecciones
  const setUrls = sets.map((set) => ({
    url: `${baseUrl}/products?set=${set.id}`,
    lastModified: set.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // URLs de categorías
  const categoryUrls = ['CARD', 'PACK', 'BOX'].map((category) => ({
    url: `${baseUrl}/products?category=${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticUrls, ...productUrls, ...setUrls, ...categoryUrls]
}