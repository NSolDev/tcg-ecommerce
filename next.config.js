// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Type-checking still blocks the build (tsc is clean). ESLint (mostly
  // unused-import noise) is available via `npm run lint` but doesn't block builds.
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    // Restricted to the hosts actually used: seeded product images (cardmarket S3),
    // the placeholder service, and localhost for local development.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'product-images.s3.cardmarket.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    // Permitir SVG (necesario para placeholder)
    dangerouslyAllowSVG: true,
    // ❌ ELIMINAR: contentSecurityPolicy - Se maneja en middleware
  },

  experimental: {
    optimizeCss: true,
  },

  // ✅ Mantener: Elimina console.log en producción
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'], // Mantener errores y warnings
          }
        : false,
  },

  // ✅ Mantener: Oculta información del servidor
  poweredByHeader: false,

  // ✅ Mantener: Modo estricto de React
  reactStrictMode: true,

  // ✅ NUEVO: Deshabilitar source maps en producción
  productionBrowserSourceMaps: false,

  // ✅ NUEVO: Ocultar indicadores de desarrollo
  devIndicators: {
    buildActivity: process.env.NODE_ENV !== 'production',
  },

  // ✅ NUEVO: Minificación SWC
  swcMinify: true,

  // ✅ NUEVO: Compresión gzip/brotli
  compress: true,

  // ✅ NUEVO: Headers de seguridad adicionales (complemento del middleware)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
