// src/app/sitemap.ts
import { prisma } from '@/lib/db/prisma';

// Generated at request time; tolerate the DB being unavailable at build.
export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://tcgstore.com';

  let products: { slug: string; updatedAt: Date; type: string }[] = [];
  let sets: { id: string; name: string; updatedAt: Date }[] = [];
  try {
    [products, sets] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true, type: true },
      }),
      prisma.set.findMany({
        select: { id: true, name: true, updatedAt: true },
      }),
    ]);
  } catch {
    // DB not reachable (e.g. during image build) — emit static URLs only.
  }

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
  ];

  // URLs de productos
  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: product.type === 'CARD' ? 0.8 : 0.7,
  }));

  // URLs de colecciones
  const setUrls = sets.map((set) => ({
    url: `${baseUrl}/products?set=${set.id}`,
    lastModified: set.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // URLs de categorías
  const categoryUrls = ['CARD', 'PACK', 'BOX'].map((category) => ({
    url: `${baseUrl}/products?category=${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticUrls, ...productUrls, ...setUrls, ...categoryUrls];
}
