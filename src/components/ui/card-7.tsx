// src/components/ui/card-7.tsx
'use client'

import * as React from "react";
import { cn } from "@/lib/utils";
import { Heart, ShoppingCart } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import Image from "next/image";
import { getLocalImage } from "@/lib/imageMap";

interface ProductImage {
  id: string
  url: string
  isPrimary: boolean
  order: number
}

interface InteractiveProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl?: string
  images?: ProductImage[]
  slug?: string
  logoUrl?: string
  title: string
  description: string
  price: string
  onAddToCart?: (e: React.MouseEvent) => void
  onCardClick?: () => void
}

export function InteractiveProductCard({
  className,
  imageUrl,
  images,
  slug = '',
  logoUrl,
  title,
  description,
  price,
  onAddToCart,
  onCardClick,
  ...props
}: InteractiveProductCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({});
  const [isLiked, setIsLiked] = React.useState(false);
  const [currentImage, setCurrentImage] = React.useState<string>(() => {
    // Inicializar con la mejor imagen disponible
    const primaryImage = images?.find(img => img.isPrimary) || images?.[0]
    return primaryImage?.url || imageUrl || PLACEHOLDER_IMAGE
  });
  const [hasAttemptedLocal, setHasAttemptedLocal] = React.useState(false);

  const primaryImage = images?.find(img => img.isPrimary) || images?.[0]
  const remoteImageUrl = primaryImage?.url || imageUrl || PLACEHOLDER_IMAGE
  const localImageUrl = getLocalImage(slug)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const rotateX = (y - height / 2) / (height / 2) * -8;
    const rotateY = (x - width / 2) / (width / 2) * 8;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`,
      transition: "transform 0.1s ease-out",
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.4s ease-in-out",
    });
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick();
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(e);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleImageError = () => {
    // Si la imagen remota falla y tenemos imagen local, usarla
    if (localImageUrl && !hasAttemptedLocal) {
      setCurrentImage(localImageUrl)
      setHasAttemptedLocal(true)
      return
    }
    // Si todo falla, usar placeholder
    setCurrentImage(PLACEHOLDER_IMAGE)
  };

  // Si cambia la imagen remota, resetear el estado
  React.useEffect(() => {
    const primaryImage = images?.find(img => img.isPrimary) || images?.[0]
    const newRemoteUrl = primaryImage?.url || imageUrl || PLACEHOLDER_IMAGE
    if (newRemoteUrl !== currentImage && !hasAttemptedLocal) {
      setCurrentImage(newRemoteUrl)
    }
  }, [images, imageUrl, currentImage, hasAttemptedLocal])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      style={style}
      className={cn(
        "relative w-full max-w-[340px] aspect-[9/12] rounded-2xl bg-[#1E1E1E] shadow-lg cursor-pointer overflow-hidden",
        "transform-style-3d",
        className
      )}
      {...props}
    >
      {/* Imagen de fondo */}
      <div className="absolute inset-0 h-full w-full rounded-2xl overflow-hidden">
        <Image
          src={currentImage}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          style={{ transform: "translateZ(-20px) scale(1.1)" }}
          priority
          onError={handleImageError}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={currentImage.includes('cardmarket')}
        />
      </div>
      
      {/* Overlay con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-2xl" />

      {/* Contenido con efecto 3D */}
      <div
        className="absolute inset-0 p-5 flex flex-col"
        style={{ transform: "translateZ(40px)" }}
      >
        {/* Header con título */}
        <div className="flex items-start justify-between rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-white line-clamp-2">{title}</h3>
          </div>
          {logoUrl && (
            <Image
              src={logoUrl}
              alt="Brand Logo"
              className="h-4 w-auto object-contain"
              width={40}
              height={16}
            />
          )}
        </div>

        {/* Espaciador */}
        <div className="flex-1" />

        {/* Footer con precio, favoritos y carrito */}
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 p-3 backdrop-blur-md">
          <span className="text-lg font-bold text-[#FFCB05]">
            {price}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className="rounded-full bg-white/10 p-2 transition-all hover:bg-white/20"
            >
              <Heart
                className={cn(
                  "w-4 h-4 transition-colors duration-300",
                  isLiked ? "fill-[#FFCB05] text-[#FFCB05]" : "text-white"
                )}
              />
            </button>
            <button
              onClick={handleAddToCart}
              className="rounded-full bg-white/10 p-2 transition-all hover:bg-white/20"
            >
              <ShoppingCart className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}