// src/components/product/ProductFiltersHorizontal.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Search, Filter } from 'lucide-react'
import './product-filters-horizontal.css'

interface ProductFiltersHorizontalProps {
  sets: { id: string; name: string }[]
}

export function ProductFiltersHorizontal({ sets }: ProductFiltersHorizontalProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    set: searchParams.get('set') || '',
    category: searchParams.get('category') || '',
    rarity: searchParams.get('rarity') || '',
    type: searchParams.get('type') || '',
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 1000,
  })

  const categories = [
    { value: 'CARD', label: '🃏 Cartas' },
    { value: 'PACK', label: '📦 Sobres' },
    { value: 'BOX', label: '📦 Cajas' },
  ]

  const rarities = ['COMUN', 'NORMAL', 'RARA', 'SUPER_RARA', 'SECRETA']
  const types = ['Pokémon', 'Entrenador', 'Energía', 'Sobre', 'Caja']

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.set) params.set('set', filters.set)
    if (filters.category) params.set('category', filters.category)
    if (filters.rarity) params.set('rarity', filters.rarity)
    if (filters.type) params.set('type', filters.type)
    if (filters.minPrice > 0) params.set('minPrice', String(filters.minPrice))
    if (filters.maxPrice < 1000) params.set('maxPrice', String(filters.maxPrice))
    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      set: '',
      category: '',
      rarity: '',
      type: '',
      minPrice: 0,
      maxPrice: 1000,
    })
    router.push('/products')
  }

  const hasActiveFilters = filters.search || filters.set || filters.category || filters.rarity || filters.type || filters.minPrice > 0 || filters.maxPrice < 1000

  return (
    <div className="filters-horizontal">
      <div className="filters-horizontal-container">
        {/* Búsqueda */}
        <div className="filter-group search-group">
          <div className="relative">
            <Search className="search-icon" />
            <Input
              placeholder="Buscar cartas..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="filter-input search-input"
            />
          </div>
        </div>

        {/* Colección */}
        <div className="filter-group">
          <Select
            value={filters.set}
            onValueChange={(value) => setFilters({ ...filters, set: value || '' })}
          >
            <SelectTrigger className="filter-select">
              <SelectValue placeholder="Colección" />
            </SelectTrigger>
            <SelectContent className="filter-select-content">
              <SelectItem value="" className="filter-select-item">Todas</SelectItem>
              {sets.map((set) => (
                <SelectItem key={set.id} value={set.id} className="filter-select-item">
                  {set.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Categoría */}
        <div className="filter-group">
          <Select
            value={filters.category}
            onValueChange={(value) => setFilters({ ...filters, category: value || '' })}
          >
            <SelectTrigger className="filter-select">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent className="filter-select-content">
              <SelectItem value="" className="filter-select-item">Todas</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value} className="filter-select-item">
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rareza */}
        <div className="filter-group">
          <Select
            value={filters.rarity}
            onValueChange={(value) => setFilters({ ...filters, rarity: value || '' })}
          >
            <SelectTrigger className="filter-select">
              <SelectValue placeholder="Rareza" />
            </SelectTrigger>
            <SelectContent className="filter-select-content">
              <SelectItem value="" className="filter-select-item">Todas</SelectItem>
              {rarities.map((rarity) => (
                <SelectItem key={rarity} value={rarity} className="filter-select-item">
                  {rarity.charAt(0) + rarity.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tipo */}
        <div className="filter-group">
          <Select
            value={filters.type}
            onValueChange={(value) => setFilters({ ...filters, type: value || '' })}
          >
            <SelectTrigger className="filter-select">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent className="filter-select-content">
              <SelectItem value="" className="filter-select-item">Todos</SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type} className="filter-select-item">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Acciones */}
        <div className="filter-actions">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="filter-clear-btn"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
          <Button onClick={applyFilters} className="filter-apply-btn">
            <Search className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
        </div>
      </div>
    </div>
  )
}