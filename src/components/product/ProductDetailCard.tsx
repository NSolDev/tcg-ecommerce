// src/components/product/ProductDetailCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Heart, Truck, Shield, Package, Sparkles } from 'lucide-react';
import {
  formatPrice,
  getRarityLabel,
  getConditionLabel,
  getCategoryLabel,
  rarityColors,
} from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import { getLocalImage } from '@/lib/imageMap';
import './product-detail-card.css';

interface ProductDetailCardProps {
  product: any;
}

export function ProductDetailCard({ product }: ProductDetailCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [imgError, setImgError] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Obtener la imagen principal de la base de datos
  const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
  const remoteImageUrl = primaryImage?.url || PLACEHOLDER_IMAGE;

  // Obtener imagen local por slug (fallback)
  const localImageUrl = product.slug ? getLocalImage(product.slug) : null;

  // Determinar qué imagen mostrar
  const getDisplayImage = () => {
    if (imgError) {
      return localImageUrl || PLACEHOLDER_IMAGE;
    }
    if (remoteImageUrl && remoteImageUrl !== PLACEHOLDER_IMAGE) {
      return remoteImageUrl;
    }
    return localImageUrl || PLACEHOLDER_IMAGE;
  };

  const imageUrl = getDisplayImage();

  // Obtener información del set según el tipo
  let setInfo = null;
  let typeLabel = '';
  let rarity = '';
  let condition = '';

  if (product.card) {
    setInfo = product.card.set;
    typeLabel = 'Carta';
    rarity = product.card.rarity || 'NORMAL';
    condition = product.card.condition || 'MINT';
  } else if (product.pack) {
    setInfo = product.pack.set;
    typeLabel = 'Sobre';
  } else if (product.box) {
    setInfo = product.box.set;
    typeLabel = 'Caja';
  }

  // Usar traducciones
  const rarityLabel = getRarityLabel(rarity);
  const conditionLabel = getConditionLabel(condition);
  const categoryLabel = getCategoryLabel(product.type);

  const handleAddToCart = () => {
    if (product.stock === 0) return;

    setIsAdding(true);
    addItem({
      id: product.slug,
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: imageUrl,
      stock: product.stock,
    });

    toast.success(`${product.name} añadido al carrito`, {
      duration: 2000,
      action: {
        label: 'Ver carrito',
        onClick: () => {
          useCartStore.getState().openCart();
        },
      },
    });

    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleImageError = () => {
    setImgError(true);
  };

  const stockStatus = product.stock === 0 ? 'Agotado' : `${product.stock} unidades disponibles`;
  const stockColor =
    product.stock === 0
      ? 'product-detail-spec-value-out-of-stock'
      : product.stock < 5
        ? 'product-detail-spec-value-low-stock'
        : 'product-detail-spec-value-in-stock';

  return (
    <div className="product-detail-grid">
      {/* Imagen */}
      <div className="product-detail-image">
        <div className="image-glow" />
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="image"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={handleImageError}
            unoptimized={imageUrl.includes('cardmarket') || imageUrl.includes('data:image')}
          />
        ) : (
          <div className="image-placeholder">
            <p>Imagen no disponible</p>
          </div>
        )}
        <div className="corner-tl" />
        <div className="corner-br" />
      </div>

      {/* Información del producto */}
      <div className="product-detail-info">
        <div>
          <div className="product-detail-badges">
            {rarity && (
              <Badge
                className={`product-detail-badge ${rarityColors[rarity] || 'product-detail-badge-rarity-comun'}`}
              >
                <Sparkles className="h-3 w-3" />
                {rarityLabel}
              </Badge>
            )}
            {setInfo && (
              <Badge className="product-detail-badge product-detail-badge-set">
                {setInfo.name}
              </Badge>
            )}
            <Badge className="product-detail-badge product-detail-badge-category">
              {categoryLabel}
            </Badge>
          </div>
          <h1 className="product-detail-name">{product.name}</h1>
          <p className="product-detail-price">{formatPrice(product.price)}</p>
        </div>

        <Separator className="product-detail-separator" />

        <div>
          <div>
            <h3 className="product-detail-description-label">Descripción</h3>
            <p className="product-detail-description-text">{product.description}</p>
          </div>

          <div className="product-detail-specs">
            <div>
              <span className="product-detail-spec-label">Tipo</span>
              <p className="product-detail-spec-value">{typeLabel}</p>
            </div>
            {condition && (
              <div>
                <span className="product-detail-spec-label">Condición</span>
                <p className="product-detail-spec-value">{conditionLabel}</p>
              </div>
            )}
            {product.hp && (
              <div>
                <span className="product-detail-spec-label">HP</span>
                <p className="product-detail-spec-value">{product.hp}</p>
              </div>
            )}
            {product.attack && (
              <div>
                <span className="product-detail-spec-label">Ataque</span>
                <p className="product-detail-spec-value">{product.attack}</p>
              </div>
            )}
            {product.weakness && (
              <div>
                <span className="product-detail-spec-label">Debilidad</span>
                <p className="product-detail-spec-value">{product.weakness}</p>
              </div>
            )}
            {product.evolution && (
              <div>
                <span className="product-detail-spec-label">Evolución</span>
                <p className="product-detail-spec-value">{product.evolution}</p>
              </div>
            )}
            <div>
              <span className="product-detail-spec-label">Stock</span>
              <p className={`product-detail-spec-value ${stockColor}`}>{stockStatus}</p>
            </div>
          </div>
        </div>

        <Separator className="product-detail-separator" />

        <div className="product-detail-actions">
          <Button
            className="product-detail-btn-primary"
            disabled={product.stock === 0 || isAdding}
            onClick={handleAddToCart}
          >
            {isAdding ? (
              <div className="spinner" />
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" />
                Añadir al Carrito
              </>
            )}
          </Button>
          <Button className="product-detail-btn-secondary">
            <Heart className="h-5 w-5" />
            Favoritos
          </Button>
        </div>

        {/* Beneficios */}
        <div className="product-detail-benefits">
          <div className="product-detail-benefit">
            <Truck className="icon" />
            <p className="label">Envío Rápido</p>
          </div>
          <div className="product-detail-benefit">
            <Shield className="icon" />
            <p className="label">100% Auténtico</p>
          </div>
          <div className="product-detail-benefit">
            <Package className="icon" />
            <p className="label">Garantía</p>
          </div>
        </div>
      </div>
    </div>
  );
}
