// src/components/admin/ProductForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createProduct, updateProduct } from '@/lib/actions/admin.actions'
import { Package, Sparkles } from 'lucide-react'

interface ProductFormProps {
  product?: any
  sets: { id: string; name: string }[]
}

export function ProductForm({ product, sets }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [productType, setProductType] = useState<string>(product?.category || 'CARD')

  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || '',
    stock: product?.stock || '',
    imageUrl: product?.imageUrl || 'https://placehold.co/600x400',
    rarity: product?.rarity || '',
    condition: product?.condition || '',
    type: product?.type || '',
    hp: product?.hp || '',
    attack: product?.attack || '',
    weakness: product?.weakness || '',
    evolution: product?.evolution || '',
    setId: product?.setId || '',
    category: product?.category || 'CARD',
  })

  const getTypeOptions = () => {
    switch (productType) {
      case 'CARD':
        return ['Pokémon', 'Entrenador', 'Energía']
      case 'PACK':
        return ['Sobre Estándar', 'Sobre Premium', 'Sobre Promocional']
      case 'BOX':
        return ['Booster Box', 'Elite Trainer Box', 'Collection Box', 'Premium Collection']
      default:
        return ['Pokémon', 'Entrenador', 'Energía']
    }
  }

  const getSpecificFields = () => {
    switch (productType) {
      case 'CARD':
        return (
          <>
            <div className="admin-form-grid">
              <div className="admin-form-field">
                <Label className="admin-form-label">HP</Label>
                <Input
                  type="number"
                  value={formData.hp}
                  onChange={(e) => setFormData({ ...formData, hp: e.target.value })}
                  placeholder="Opcional"
                  className="admin-form-input"
                />
              </div>
              <div className="admin-form-field">
                <Label className="admin-form-label">Ataque</Label>
                <Input
                  type="number"
                  value={formData.attack}
                  onChange={(e) => setFormData({ ...formData, attack: e.target.value })}
                  placeholder="Opcional"
                  className="admin-form-input"
                />
              </div>
            </div>
            <div className="admin-form-grid">
              <div className="admin-form-field">
                <Label className="admin-form-label">Debilidad</Label>
                <Input
                  value={formData.weakness}
                  onChange={(e) => setFormData({ ...formData, weakness: e.target.value })}
                  placeholder="Opcional"
                  className="admin-form-input"
                />
              </div>
              <div className="admin-form-field">
                <Label className="admin-form-label">Evolución</Label>
                <Input
                  value={formData.evolution}
                  onChange={(e) => setFormData({ ...formData, evolution: e.target.value })}
                  placeholder="Opcional"
                  className="admin-form-input"
                />
              </div>
            </div>
          </>
        )
      case 'PACK':
        return (
          <div className="admin-form-field admin-form-grid-full">
            <Label className="admin-form-label">Contenido del Sobre</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe el contenido del sobre (número de cartas, rarezas, etc.)"
              className="admin-form-textarea"
              rows={3}
            />
          </div>
        )
      case 'BOX':
        return (
          <div className="admin-form-field admin-form-grid-full">
            <Label className="admin-form-label">Contenido de la Caja</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe el contenido de la caja (número de sobres, cartas promocionales, accesorios, etc.)"
              className="admin-form-textarea"
              rows={3}
            />
          </div>
        )
      default:
        return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        hp: formData.hp ? parseInt(formData.hp) : null,
        attack: formData.attack ? parseInt(formData.attack) : null,
        weakness: formData.weakness || null,
        evolution: formData.evolution || null,
        category: productType,
      }

      if (product) {
        await updateProduct(product.id, data)
      } else {
        await createProduct(data as any)
      }

      router.push('/admin/products')
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al guardar el producto')
      setLoading(false)
    }
  }

  const handleProductTypeChange = (value: string) => {
    setProductType(value)
    setFormData({ ...formData, category: value })
    
    if (value === 'CARD') {
      setFormData(prev => ({
        ...prev,
        type: 'Pokémon',
        hp: '',
        attack: '',
        weakness: '',
        evolution: '',
      }))
    } else if (value === 'PACK') {
      setFormData(prev => ({
        ...prev,
        type: 'Sobre Estándar',
        hp: '',
        attack: '',
        weakness: '',
        evolution: '',
        rarity: 'NORMAL',
        condition: 'MINT',
      }))
    } else if (value === 'BOX') {
      setFormData(prev => ({
        ...prev,
        type: 'Booster Box',
        hp: '',
        attack: '',
        weakness: '',
        evolution: '',
        rarity: 'SUPER_RARA',
        condition: 'MINT',
      }))
    }
  }

  const typeOptions = getTypeOptions()

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      {error && (
        <div className="admin-form-error">
          {error}
        </div>
      )}

      {/* Selector de Tipo de Producto */}
      <div className="admin-form-field">
        <Label className="admin-form-label">Tipo de Producto</Label>
        <Select
          value={productType}
          onValueChange={handleProductTypeChange}
        >
          <SelectTrigger className="admin-form-select">
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent className="bg-[#151B23] border-white/10 text-white">
            <SelectItem value="CARD" className="hover:bg-white/10 focus:bg-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#A855F7]" />
                <span>🃏 Carta Individual</span>
              </div>
            </SelectItem>
            <SelectItem value="PACK" className="hover:bg-white/10 focus:bg-white/10">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#22D3EE]" />
                <span>📦 Sobre</span>
              </div>
            </SelectItem>
            <SelectItem value="BOX" className="hover:bg-white/10 focus:bg-white/10">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#EC4899]" />
                <span>📦 Caja / Colección</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campos Comunes */}
      <div className="admin-form-grid">
        <div className="admin-form-field">
          <Label className="admin-form-label">Nombre</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nombre del producto"
            required
            className="admin-form-input"
          />
        </div>
        <div className="admin-form-field">
          <Label className="admin-form-label">Slug (URL)</Label>
          <Input
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="nombre-del-producto"
            required
            className="admin-form-input"
          />
        </div>
      </div>

      <div className="admin-form-field admin-form-grid-full">
        <Label className="admin-form-label">URL de la Imagen</Label>
        <Input
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
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
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0.00"
            required
            className="admin-form-input"
          />
        </div>
        <div className="admin-form-field">
          <Label className="admin-form-label">Stock</Label>
          <Input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            placeholder="0"
            required
            className="admin-form-input"
          />
        </div>
      </div>

      {/* Campos según tipo */}
      <div className="admin-form-grid">
        <div className="admin-form-field">
          <Label className="admin-form-label">Tipo de Producto</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger className="admin-form-select">
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent className="bg-[#151B23] border-white/10 text-white">
              {typeOptions.map((option) => (
                <SelectItem key={option} value={option} className="hover:bg-white/10 focus:bg-white/10">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="admin-form-field">
          <Label className="admin-form-label">Colección</Label>
          <Select
            value={formData.setId}
            onValueChange={(value) => setFormData({ ...formData, setId: value })}
          >
            <SelectTrigger className="admin-form-select">
              <SelectValue placeholder="Seleccionar colección" />
            </SelectTrigger>
            <SelectContent className="bg-[#151B23] border-white/10 text-white">
              {sets.map((set) => (
                <SelectItem key={set.id} value={set.id} className="hover:bg-white/10 focus:bg-white/10">
                  {set.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Campos específicos por tipo */}
      {getSpecificFields()}

      <div className="admin-form-grid">
        <div className="admin-form-field">
          <Label className="admin-form-label">Rareza</Label>
          <Select
            value={formData.rarity}
            onValueChange={(value) => setFormData({ ...formData, rarity: value })}
          >
            <SelectTrigger className="admin-form-select">
              <SelectValue placeholder="Seleccionar rareza" />
            </SelectTrigger>
            <SelectContent className="bg-[#151B23] border-white/10 text-white">
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
          <Select
            value={formData.condition}
            onValueChange={(value) => setFormData({ ...formData, condition: value })}
          >
            <SelectTrigger className="admin-form-select">
              <SelectValue placeholder="Seleccionar condición" />
            </SelectTrigger>
            <SelectContent className="bg-[#151B23] border-white/10 text-white">
              <SelectItem value="MINT">Mint</SelectItem>
              <SelectItem value="NEAR_MINT">Near Mint</SelectItem>
              <SelectItem value="PLAYED">Played</SelectItem>
              <SelectItem value="DAMAGED">Damaged</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
          {loading ? 'Guardando...' : product ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  )
}