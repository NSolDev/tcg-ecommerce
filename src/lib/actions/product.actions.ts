// src/lib/actions/product.actions.ts
'use server'

import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const productQuerySchema = z.object({
  search: z.string().optional(),
  set: z.string().optional(),
  category: z.enum(['CARD', 'PACK', 'BOX']).optional(),
  rarity: z.string().optional(),
  type: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(12),
})

export async function getProducts(query: z.infer<typeof productQuerySchema>) {
  const validated = productQuerySchema.parse(query)
  const { search, set, category, rarity, type, minPrice, maxPrice, page, pageSize } = validated

  // Construir filtros
  const where: any = {
    isActive: true, // Solo productos activos
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (set) {
    where.setId = set
  }

  if (category) {
    where.category = category
  }

  if (rarity) {
    where.rarity = rarity
  }

  if (type) {
    where.type = type
  }

  if (minPrice !== undefined) {
    where.price = { ...where.price, gte: minPrice }
  }

  if (maxPrice !== undefined) {
    where.price = { ...where.price, lte: maxPrice }
  }

  // Calcular paginación
  const skip = (page - 1) * pageSize
  const take = pageSize

  // Ejecutar consultas en paralelo
  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        set: true,
      },
    }),
    prisma.product.count({ where }),
  ])

  return {
    products,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page,
    pageSize,
  }
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      set: true,
    },
  })

  if (!product) {
    throw new Error('Producto no encontrado')
  }

  return product
}

export async function getSets() {
  return prisma.set.findMany({
    orderBy: { name: 'asc' },
  })
}

export async function getRelatedProducts(productId: string, setId: string, category: string) {
  return prisma.product.findMany({
    where: {
      id: { not: productId },
      setId,
      category: category as any,
      isActive: true,
      stock: { gt: 0 },
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
  })
}