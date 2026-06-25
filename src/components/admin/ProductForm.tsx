// src/components/admin/ProductForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createProduct, updateProduct } from '@/lib/actions/admin.actions'

interface ProductFormProps {
  product?: any
  sets: { id: string; name: string }[]
}

export function ProductForm({ product, sets }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
  })

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

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="nombre-del-producto"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Precio (€)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL de la Imagen</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Rareza</Label>
              <Select
                value={formData.rarity}
                onValueChange={(value) => setFormData({ ...formData, rarity: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rareza" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COMUN">Común</SelectItem>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                  <SelectItem value="RARA">Rara</SelectItem>
                  <SelectItem value="SUPER_RARA">Súper Rara</SelectItem>
                  <SelectItem value="SECRETA">Secreta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Condición</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) => setFormData({ ...formData, condition: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar condición" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MINT">Mint</SelectItem>
                  <SelectItem value="NEAR_MINT">Near Mint</SelectItem>
                  <SelectItem value="PLAYED">Played</SelectItem>
                  <SelectItem value="DAMAGED">Damaged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pokémon">Pokémon</SelectItem>
                  <SelectItem value="Entrenador">Entrenador</SelectItem>
                  <SelectItem value="Energía">Energía</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Colección</Label>
              <Select
                value={formData.setId}
                onValueChange={(value) => setFormData({ ...formData, setId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar colección" />
                </SelectTrigger>
                <SelectContent>
                  {sets.map((set) => (
                    <SelectItem key={set.id} value={set.id}>
                      {set.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hp">HP</Label>
              <Input
                id="hp"
                type="number"
                value={formData.hp}
                onChange={(e) => setFormData({ ...formData, hp: e.target.value })}
                placeholder="Opcional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attack">Ataque</Label>
              <Input
                id="attack"
                type="number"
                value={formData.attack}
                onChange={(e) => setFormData({ ...formData, attack: e.target.value })}
                placeholder="Opcional"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weakness">Debilidad</Label>
              <Input
                id="weakness"
                value={formData.weakness}
                onChange={(e) => setFormData({ ...formData, weakness: e.target.value })}
                placeholder="Opcional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evolution">Evolución</Label>
              <Input
                id="evolution"
                value={formData.evolution}
                onChange={(e) => setFormData({ ...formData, evolution: e.target.value })}
                placeholder="Opcional"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/products')}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : product ? 'Actualizar' : 'Crear'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}