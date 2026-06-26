// src/components/ui/ImageWithFallback.tsx
'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import { PLACEHOLDER_IMAGE } from '@/lib/constants'
import { getLocalImage } from '@/lib/imageMap'

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  src: string
  fallbackSrc?: string
  slug?: string
}

export function ImageWithFallback({
  src,
  fallbackSrc = PLACEHOLDER_IMAGE,
  slug = '',
  alt,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const localImage = getLocalImage(slug)

  const handleError = () => {
    if (!hasError && localImage) {
      setImgSrc(localImage)
      setHasError(true)
      return
    }
    if (!hasError) {
      setImgSrc(fallbackSrc)
      setHasError(true)
    }
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
      unoptimized={imgSrc.includes('cardmarket') || imgSrc.includes('data:image')}
    />
  )
}