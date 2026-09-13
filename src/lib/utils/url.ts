// src/lib/utils/url.ts

/**
 * Verifica si una URL es válida para redirección (solo rutas internas)
 */
export function isValidRedirectUrl(url: string): boolean {
  if (!url) return false;

  try {
    // Verificar que la URL es relativa o es una URL interna
    const isRelative = url.startsWith('/') && !url.startsWith('//');
    const isInternal =
      url.startsWith('/') ||
      url.startsWith('/login') ||
      url.startsWith('/register') ||
      url.startsWith('/products') ||
      url.startsWith('/cart') ||
      url.startsWith('/checkout') ||
      url.startsWith('/account') ||
      url.startsWith('/orders') ||
      url.startsWith('/wishlist');

    // Prevenir URLs absolutas externas
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const parsedUrl = new URL(url);
      const allowedHosts = ['localhost', 'tcgstore.com', 'www.tcgstore.com'];
      return allowedHosts.includes(parsedUrl.hostname);
    }

    // Prevenir protocolos peligrosos
    const dangerousProtocols = ['javascript:', 'data:', 'file:', 'ftp:'];
    if (dangerousProtocols.some((protocol) => url.toLowerCase().startsWith(protocol))) {
      return false;
    }

    return isRelative || isInternal;
  } catch {
    return false;
  }
}

/**
 * Obtiene una URL de redirección segura
 */
export function getSafeRedirectUrl(
  callbackUrl: string | null | undefined,
  defaultUrl: string = '/'
): string {
  if (!callbackUrl) return defaultUrl;
  return isValidRedirectUrl(callbackUrl) ? callbackUrl : defaultUrl;
}
