// src/components/seo/ProductMetadata.tsx
import { Product } from '@prisma/client'
import { Metadata } from 'next'

interface ProductMetadataProps {
  product: Product & { set: { name: string } }
}

export function generateProductMetadata({ product }: ProductMetadataProps): Metadata {
  const title = `${product.name} - Carta Pokémon | TCG Store`
  const description = `${product.name} de la colección ${product.set.name}. ${product.description}`
  
  // Palabras clave específicas del producto
  const keywords = [
    product.name,
    product.set.name,
    'carta Pokémon',
    product.rarity.toLowerCase(),
    product.condition.toLowerCase(),
    product.type.toLowerCase(),
    'TCG',
    'Pokémon',
  ]

  return {
    title,
    description,
    keywords: keywords.join(', '),
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/products/${product.slug}`,
      type: 'website', // Cambiado de 'product' a 'website'
      images: [
        {
          url: product.imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.imageUrl],
    },
    other: {
      'product:price:amount': product.price.toString(),
      'product:price:currency': 'EUR',
      'product:availability': product.stock > 0 ? 'in stock' : 'out of stock',
      'product:condition': product.condition,
      'product:retailer_item_id': product.id,
    },
  }
}