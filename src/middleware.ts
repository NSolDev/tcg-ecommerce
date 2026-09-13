// src/middleware.ts
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === 'ADMIN';

  const protectedRoutes = ['/account', '/cart', '/checkout', '/wishlist', '/orders'];
  const adminRoutes = ['/admin'];

  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (isProtectedRoute && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(path);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url));
  }

  if (isLoggedIn && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // ✅ AÑADIR HEADERS DE SEGURIDAD
  const response = NextResponse.next();

  // Prevenir clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevenir MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Prevenir XSS (para navegadores antiguos)
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Controlar la información de referer
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Controlar qué APIs del navegador se pueden usar
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=()'
  );

  // ✅ CONTENT SECURITY POLICY (CSP)
  // `unsafe-eval` is only allowed in development (React Fast Refresh needs it);
  // production drops it entirely. `unsafe-inline` remains for scripts and styles
  // because this app does not use a per-request nonce architecture: Next.js App
  // Router injects inline bootstrap/RSC scripts, and framer-motion/gsap set inline
  // style attributes that a style nonce cannot cover. Adopting nonces would force
  // dynamic rendering on every route and risk breaking third-party scripts, so the
  // remaining `unsafe-inline` is a documented, accepted trade-off for this project.
  const isDev = process.env.NODE_ENV !== 'production';
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    ...(isDev ? ["'unsafe-eval'"] : []),
    'https://js.stripe.com',
  ].join(' ');

  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
      `script-src ${scriptSrc}; ` +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: blob: https://product-images.s3.cardmarket.com https://placehold.co https://images.pexels.com; " +
      "font-src 'self' data:; " +
      "connect-src 'self' https://api.stripe.com; " +
      "frame-src 'self' https://js.stripe.com; " +
      "object-src 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self'; " +
      "frame-ancestors 'none';"
  );

  // ✅ HSTS (forzar HTTPS en producción)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  return response;
});

export const config = {
  matcher: [
    '/account/:path*',
    '/admin/:path*',
    '/cart/:path*',
    '/checkout/:path*',
    '/wishlist/:path*',
    '/orders/:path*',
    '/login',
    '/register',
    '/products/:path*',
    '/',
  ],
};
