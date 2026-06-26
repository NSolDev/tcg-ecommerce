// src/lib/actions/product.actions.ts
'use server'

import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'
import { PLACEHOLDER_IMAGE } from '@/lib/constants'

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

  const where: any = {
    isActive: true,
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (category) {
    where.type = category
  }

  if (minPrice !== undefined) {
    where.price = { ...where.price, gte: minPrice }
  }

  if (maxPrice !== undefined) {
    where.price = { ...where.price, lte: maxPrice }
  }

  if (set) {
    where.OR = [
      { card: { setId: set } },
      { pack: { setId: set } },
      { box: { setId: set } },
    ]
  }

  if (rarity) {
    where.card = { rarity: rarity }
  }

  if (type) {
    where.type = type
  }

  const skip = (page - 1) * pageSize
  const take = pageSize

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        card: {
          include: {
            set: true,
          },
        },
        pack: {
          include: {
            set: true,
          },
        },
        box: {
          include: {
            set: true,
          },
        },
      },
    }),
    prisma.product.count({ where }),
  ])

  const productsWithSet = products.map((product) => {
    let setInfo = null
    if (product.card) {
      setInfo = product.card.set
    } else if (product.pack) {
      setInfo = product.pack.set
    } else if (product.box) {
      setInfo = product.box.set
    }

    return {
      ...product,
      set: setInfo,
    }
  })

  return {
    products: productsWithSet,
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
      images: {
        orderBy: { order: 'asc' },
      },
      card: {
        include: {
          set: true,
        },
      },
      pack: {
        include: {
          set: true,
        },
      },
      box: {
        include: {
          set: true,
        },
      },
    },
  })

  if (!product) {
    throw new Error('Producto no encontrado')
  }

  let setInfo = null
  if (product.card) {
    setInfo = product.card.set
  } else if (product.pack) {
    setInfo = product.pack.set
  } else if (product.box) {
    setInfo = product.box.set
  }

  return {
    ...product,
    set: setInfo,
  }
}

export async function getSets() {
  return prisma.set.findMany({
    orderBy: { name: 'asc' },
  })
}

export async function getRelatedProducts(productId: string, setId: string, productType: string) {
  const where: any = {
    id: { not: productId },
    isActive: true,
    stock: { gt: 0 },
  }

  if (productType === 'CARD') {
    where.card = { setId }
  } else if (productType === 'PACK') {
    where.pack = { setId }
  } else if (productType === 'BOX') {
    where.box = { setId }
  }

  const products = await prisma.product.findMany({
    where,
    take: 4,
    orderBy: { createdAt: 'desc' },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      card: {
        include: {
          set: true,
        },
      },
      pack: {
        include: {
          set: true,
        },
      },
      box: {
        include: {
          set: true,
        },
      },
    },
  })

  return products.map((product) => {
    let setInfo = null
    if (product.card) {
      setInfo = product.card.set
    } else if (product.pack) {
      setInfo = product.pack.set
    } else if (product.box) {
      setInfo = product.box.set
    }
    return {
      ...product,
      set: setInfo,
    }
  })
}

export async function getCards() {
  const cards = await prisma.product.findMany({
    where: {
      isActive: true,
      type: 'CARD',
    },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
      card: {
        include: {
          set: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 7,
  })

  return cards.map(card => ({
    ...card,
    images: card.images.length > 0 ? card.images : [{ 
      id: 'placeholder',
      url: PLACEHOLDER_IMAGE, 
      isPrimary: true, 
      order: 0 
    }]
  }))
}

export async function getBoxes() {
  const boxes = await prisma.product.findMany({
    where: {
      isActive: true,
      type: 'BOX',
    },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
      box: {
        include: {
          set: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 4, // Cambiado de 5 a 4 para coincidir con la página principal
  })

  return boxes.map(box => ({
    ...box,
    images: box.images.length > 0 ? box.images : [{ 
      id: 'placeholder',
      url: PLACEHOLDER_IMAGE, 
      isPrimary: true, 
      order: 0 
    }]
  }))
}

// ============================================
// NUEVA FUNCIÓN: getPacks
// ============================================

export async function getPacks() {
  const packs = await prisma.product.findMany({
    where: {
      isActive: true,
      type: 'PACK',
    },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
      pack: {
        include: {
          set: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 4,
  })

  return packs.map(pack => ({
    ...pack,
    images: pack.images.length > 0 ? pack.images : [{ 
      id: 'placeholder',
      url: PLACEHOLDER_IMAGE, 
      isPrimary: true, 
      order: 0 
    }]
  }))
}