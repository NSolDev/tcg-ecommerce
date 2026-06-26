// src/components/seo/CollectionSchema.tsx
'use client'

import Script from 'next/script'
import { Product } from '@prisma/client'

interface CollectionSchemaProps {
  products: Product[]
  name: string
  description: string
}

export function CollectionSchema({ products, name, description }: CollectionSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: name,
    description: description,
    about: {
      '@type': 'Thing',
      name: 'Cartas Coleccionables Pokémon',
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.slice(0, 10).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.name,
          url: `https://tcgstore.com/products/${product.slug}`,
          image: product.imageUrl,
          price: product.price,
          priceCurrency: 'EUR',
        },
      })),
    },
  }

  return (
    <Script
      id="collection-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  )
}