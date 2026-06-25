// src/components/product/ProductFilters.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Search, Filter } from 'lucide-react'
import './product-filters.css'

interface ProductFiltersProps {
  sets: { id: string; name: string }[]
}

export function ProductFilters({ sets }: ProductFiltersProps) {
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
    { value: 'CARD', label: 'Cartas Individuales' },
    { value: 'PACK', label: 'Sobres' },
    { value: 'BOX', label: 'Cajas y Colecciones' },
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
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="filters-container"
    >
      <Card className="filters-card">
        <CardHeader className="filters-header">
          <div className="filters-title-wrapper">
            <CardTitle className="filters-title">
              <Filter className="filters-title-icon" />
              Filtros
              {hasActiveFilters && (
                <span className="filters-active-badge">Activos</span>
              )}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="filters-clear-btn"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="filters-content">
          {/* Búsqueda */}
          <div className="filter-group">
            <Label htmlFor="search" className="filter-label">Buscar</Label>
            <div className="relative">
              <Search className="filter-search-icon" />
              <Input
                id="search"
                placeholder="Buscar cartas..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="filter-input pl-9"
              />
            </div>
          </div>

          {/* Colección - Select con todas las colecciones */}
          <div className="filter-group">
            <Label className="filter-label">Colección</Label>
            <Select
              value={filters.set}
              onValueChange={(value) => setFilters({ ...filters, set: value || '' })}
            >
              <SelectTrigger className="filter-select">
                <SelectValue placeholder="Todas las colecciones" />
              </SelectTrigger>
              <SelectContent className="filter-select-content">
                <SelectItem value="" className="filter-select-item">Todas las colecciones</SelectItem>
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
            <Label className="filter-label">Categoría</Label>
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters({ ...filters, category: value || '' })}
            >
              <SelectTrigger className="filter-select">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent className="filter-select-content">
                <SelectItem value="" className="filter-select-item">Todas las categorías</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value} className="filter-select-item">
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Rareza */}
            <div className="filter-group">
              <Label className="filter-label">Rareza</Label>
              <Select
                value={filters.rarity}
                onValueChange={(value) => setFilters({ ...filters, rarity: value || '' })}
              >
                <SelectTrigger className="filter-select">
                  <SelectValue placeholder="Todas" />
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
              <Label className="filter-label">Tipo</Label>
              <Select
                value={filters.type}
                onValueChange={(value) => setFilters({ ...filters, type: value || '' })}
              >
                <SelectTrigger className="filter-select">
                  <SelectValue placeholder="Todos" />
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
          </div>

          {/* Rango de Precio */}
          <div className="filter-group">
            <Label className="filter-label">Rango de Precio</Label>
            <div className="price-range">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                className="price-input"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                className="price-input"
              />
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-1">
            <Button 
              onClick={applyFilters} 
              className="apply-filters-btn"
            >
              <Search className="w-4 h-4 mr-2" />
              Aplicar Filtros
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}