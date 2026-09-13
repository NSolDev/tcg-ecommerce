// src/components/shared/ImageWithFallback.tsx
'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface ImageWithFallbackProps extends ImageProps {
  fallback?: string;
}

export function ImageWithFallback({
  src,
  alt,
  fallback = '/placeholder.png',
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image {...props} src={imgSrc} alt={alt} onError={() => setImgSrc(fallback)} loading="lazy" />
  );
}
