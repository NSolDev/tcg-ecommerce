// src/components/admin/ProductForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createProduct, updateProduct } from '@/lib/actions/admin.actions';
import { Package, Sparkles } from 'lucide-react';

type ProductType = 'CARD' | 'PACK' | 'BOX';

// The product shape the edit page passes in (Product + type relations + images).
interface EditableProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  type: ProductType;
  images?: { url: string; isPrimary: boolean }[];
  card?: { setId: string; rarity: string; condition: string } | null;
  pack?: { setId: string; cardsPerPack: number | null } | null;
  box?: { setId: string; packsPerBox: number | null } | null;
}

interface ProductFormProps {
  product?: EditableProduct;
  sets: { id: string; name: string }[];
}

function initialState(product?: EditableProduct) {
  const type: ProductType = product?.type ?? 'CARD';
  const rel = product?.card ?? product?.pack ?? product?.box ?? null;
  const primaryImage = product?.images?.find((i) => i.isPrimary) ?? product?.images?.[0];
  return {
    type,
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    price: product?.price?.toString() ?? '',
    stock: product?.stock?.toString() ?? '',
    imageUrl: primaryImage?.url ?? '',
    setId: rel?.setId ?? '',
    rarity: product?.card?.rarity ?? '',
    condition: product?.card?.condition ?? '',
    cardsPerPack: product?.pack?.cardsPerPack?.toString() ?? '',
    packsPerBox: product?.box?.packsPerBox?.toString() ?? '',
  };
}

export function ProductForm({ product, sets }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(initialState(product));

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
      imageUrl: form.imageUrl,
      type: form.type,
      setId: form.setId,
      rarity: form.type === 'CARD' ? (form.rarity as never) : undefined,
      condition: form.type === 'CARD' ? (form.condition as never) : undefined,
      cardsPerPack:
        form.type === 'PACK' && form.cardsPerPack ? parseInt(form.cardsPerPack, 10) : null,
      packsPerBox: form.type === 'BOX' && form.packsPerBox ? parseInt(form.packsPerBox, 10) : null,
    };

    try {
      if (product) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el producto');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      {error && (
        <div className="admin-form-error" role="alert">
          {error}
        </div>
      )}

      {/* Tipo de producto (enum) */}
      <div className="admin-form-field">
        <Label className="admin-form-label">Tipo de Producto</Label>
        <Select value={form.type} onValueChange={(v) => set('type', v as ProductType)}>
          <SelectTrigger className="admin-form-select">
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-[#151B23] text-white">
            <SelectItem value="CARD" className="hover:bg-white/10 focus:bg-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#A855F7]" />
                <span>Carta Individual</span>
              </div>
            </SelectItem>
            <SelectItem value="PACK" className="hover:bg-white/10 focus:bg-white/10">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-[#22D3EE]" />
                <span>Sobre</span>
              </div>
            </SelectItem>
            <SelectItem value="BOX" className="hover:bg-white/10 focus:bg-white/10">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-[#EC4899]" />
                <span>Caja / Colección</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campos comunes */}
      <div className="admin-form-grid">
        <div className="admin-form-field">
          <Label className="admin-form-label">Nombre</Label>
          <Input
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Nombre del producto"
            required
            className="admin-form-input"
          />
        </div>
        <div className="admin-form-field">
          <Label className="admin-form-label">Slug (URL)</Label>
          <Input
            value={form.slug}
            onChange={(e) => set('slug', e.target.value)}
            placeholder="nombre-del-producto"
            required
            className="admin-form-input"
          />
        </div>
      </div>

      <div className="admin-form-field admin-form-grid-full">
        <Label className="admin-form-label">Descripción</Label>
        <Textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Descripción del producto"
          required
          rows={3}
          className="admin-form-textarea"
        />
      </div>

      <div className="admin-form-field admin-form-grid-full">
        <Label className="admin-form-label">URL de la Imagen</Label>
        <Input
          value={form.imageUrl}
          onChange={(e) => set('imageUrl', e.target.value)}
          placeholder="https://ejemplo.com/imagen.jpg"
          required
          className="admin-form-input"
        />
      </div>

      <div className="admin-form-grid">
        <div className="admin-form-field">
          <Label className="admin-form-label">Precio (€)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => set('price', e.target.value)}
            placeholder="0.00"
            required
            className="admin-form-input"
          />
        </div>
        <div className="admin-form-field">
          <Label className="admin-form-label">Stock</Label>
          <Input
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => set('stock', e.target.value)}
            placeholder="0"
            required
            className="admin-form-input"
          />
        </div>
      </div>

      <div className="admin-form-field admin-form-grid-full">
        <Label className="admin-form-label">Colección</Label>
        <Select value={form.setId} onValueChange={(v) => set('setId', v ?? '')}>
          <SelectTrigger className="admin-form-select">
            <SelectValue placeholder="Seleccionar colección" />
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-[#151B23] text-white">
            {sets.map((s) => (
              <SelectItem key={s.id} value={s.id} className="hover:bg-white/10 focus:bg-white/10">
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Campos específicos por tipo */}
      {form.type === 'CARD' && (
        <div className="admin-form-grid">
          <div className="admin-form-field">
            <Label className="admin-form-label">Rareza</Label>
            <Select value={form.rarity} onValueChange={(v) => set('rarity', v ?? '')}>
              <SelectTrigger className="admin-form-select">
                <SelectValue placeholder="Seleccionar rareza" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#151B23] text-white">
                <SelectItem value="COMUN">Común</SelectItem>
                <SelectItem value="NORMAL">Normal</SelectItem>
                <SelectItem value="RARA">Rara</SelectItem>
                <SelectItem value="SUPER_RARA">Súper Rara</SelectItem>
                <SelectItem value="SECRETA">Secreta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="admin-form-field">
            <Label className="admin-form-label">Condición</Label>
            <Select value={form.condition} onValueChange={(v) => set('condition', v ?? '')}>
              <SelectTrigger className="admin-form-select">
                <SelectValue placeholder="Seleccionar condición" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#151B23] text-white">
                <SelectItem value="MINT">Mint</SelectItem>
                <SelectItem value="NEAR_MINT">Near Mint</SelectItem>
                <SelectItem value="PLAYED">Played</SelectItem>
                <SelectItem value="DAMAGED">Damaged</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {form.type === 'PACK' && (
        <div className="admin-form-field admin-form-grid-full">
          <Label className="admin-form-label">Cartas por sobre (opcional)</Label>
          <Input
            type="number"
            min="1"
            value={form.cardsPerPack}
            onChange={(e) => set('cardsPerPack', e.target.value)}
            placeholder="Ej: 10"
            className="admin-form-input"
          />
        </div>
      )}

      {form.type === 'BOX' && (
        <div className="admin-form-field admin-form-grid-full">
          <Label className="admin-form-label">Sobres por caja (opcional)</Label>
          <Input
            type="number"
            min="1"
            value={form.packsPerBox}
            onChange={(e) => set('packsPerBox', e.target.value)}
            placeholder="Ej: 36"
            className="admin-form-input"
          />
        </div>
      )}

      <div className="admin-form-actions">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/products')}
          className="btn-secondary"
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Guardando…' : product ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
}
