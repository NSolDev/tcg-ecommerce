// src/components/seo/StoreSchema.tsx
'use client'

import Script from 'next/script'

export function StoreSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'TCG Store',
    description: 'Tienda especializada en cartas coleccionables Pokémon, sobres y cajas.',
    url: 'https://tcgstore.com',
    logo: 'https://tcgstore.com/logo.png',
    image: 'https://tcgstore.com/og-image.jpg',
    email: 'contacto@tcgstore.com',
    telephone: '+34 900 123 456',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calle Mayor 1',
      addressLocality: 'Madrid',
      addressRegion: 'Madrid',
      postalCode: '28001',
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.416775,
      longitude: -3.703790,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '10:00',
        closes: '18:00',
      },
    ],
    sameAs: [
      'https://instagram.com/tcgstore',
      'https://twitter.com/tcgstore',
      'https://facebook.com/tcgstore',
    ],
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: ['Credit Card', 'Debit Card', 'PayPal', 'Google Pay', 'Apple Pay'],
  }

  return (
    <Script
      id="store-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  )
}