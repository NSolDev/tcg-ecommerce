// src/middleware.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAdmin = req.auth?.user?.role === 'ADMIN'

  const protectedRoutes = ['/account', '/cart', '/checkout', '/wishlist', '/orders']
  const adminRoutes = ['/admin']

  const path = req.nextUrl.pathname

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  )
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route))

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (isProtectedRoute && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(path)
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url))
  }

  if (isLoggedIn && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('X-Geo-Region', 'ES-MD')
  response.headers.set('X-Geo-City', 'Madrid')
  response.headers.set('X-Geo-Country', 'ES')
  
  return response
})

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
  ],
}