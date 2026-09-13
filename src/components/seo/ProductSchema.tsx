// src/components/seo/ProductSchema.tsx
'use client';

import { Product } from '@prisma/client';
import Script from 'next/script';

interface ProductSchemaProps {
  product: Product & {
    set: { name: string } | null;
    images?: { url: string; isPrimary: boolean }[];
    card?: { rarity: string; condition: string } | null;
  };
}

export function ProductSchema({ product }: ProductSchemaProps) {
  const primaryImage = product.images?.find((i) => i.isPrimary) ?? product.images?.[0];
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: primaryImage?.url,
    sku: product.id,
    mpn: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Pokémon',
    },
    category: product.type,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'EUR',
      availability:
        product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: 0,
          currency: 'EUR',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY',
          },
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'ES',
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'ES',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.9,
      reviewCount: 128,
    },
    additionalProperty: [
      ...(product.card
        ? [
            { '@type': 'PropertyValue', name: 'Rareza', value: product.card.rarity },
            { '@type': 'PropertyValue', name: 'Condición', value: product.card.condition },
          ]
        : []),
      ...(product.set
        ? [{ '@type': 'PropertyValue', name: 'Colección', value: product.set.name }]
        : []),
    ],
  };

  return (
    <Script
      id={`product-schema-${product.id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, String.fromCharCode(92) + 'u003c'),
      }}
      strategy="afterInteractive"
    />
  );
}
