// src/components/product/ProductFiltersHorizontal.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Search } from 'lucide-react';
import './product-filters-horizontal.css';

interface ProductFiltersHorizontalProps {
  sets: { id: string; name: string }[];
}

export function ProductFiltersHorizontal({ sets }: ProductFiltersHorizontalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    set: searchParams.get('set') || '',
    category: searchParams.get('category') || '',
    rarity: searchParams.get('rarity') || '',
    type: searchParams.get('type') || '',
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 1000,
  });

  const categories = [
    { value: 'CARD', label: 'Cartas' },
    { value: 'PACK', label: 'Sobres' },
    { value: 'BOX', label: 'Cajas' },
  ];

  const rarities = [
    { value: 'COMUN', label: 'Común' },
    { value: 'NORMAL', label: 'Normal' },
    { value: 'RARA', label: 'Rara' },
    { value: 'SUPER_RARA', label: 'Súper Rara' },
    { value: 'SECRETA', label: 'Secreta' },
  ];

  const types = [
    { value: 'Pokémon', label: 'Pokémon' },
    { value: 'Entrenador', label: 'Entrenador' },
    { value: 'Energía', label: 'Energía' },
    { value: 'Sobre', label: 'Sobre' },
    { value: 'Caja', label: 'Caja' },
  ];

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.set) params.set('set', filters.set);
    if (filters.category) params.set('category', filters.category);
    if (filters.rarity) params.set('rarity', filters.rarity);
    if (filters.type) params.set('type', filters.type);
    if (filters.minPrice > 0) params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice < 1000) params.set('maxPrice', String(filters.maxPrice));
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      set: '',
      category: '',
      rarity: '',
      type: '',
      minPrice: 0,
      maxPrice: 1000,
    });
    router.push('/products');
  };

  const hasActiveFilters =
    filters.search ||
    filters.set ||
    filters.category ||
    filters.rarity ||
    filters.type ||
    filters.minPrice > 0 ||
    filters.maxPrice < 1000;

  // Truncar nombres largos
  const truncateText = (text: string, maxLength: number = 20) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const getSetName = (setId: string) => {
    const set = sets.find((s) => s.id === setId);
    return set ? set.name : 'Colección';
  };

  const getSetDisplayName = (setId: string) => {
    const set = sets.find((s) => s.id === setId);
    return set ? truncateText(set.name) : 'Colección';
  };

  const getCategoryName = (categoryValue: string) => {
    const cat = categories.find((c) => c.value === categoryValue);
    return cat ? cat.label : 'Categoría';
  };

  const getRarityName = (rarityValue: string) => {
    const rar = rarities.find((r) => r.value === rarityValue);
    return rar ? rar.label : 'Rareza';
  };

  const getTypeName = (typeValue: string) => {
    const t = types.find((t) => t.value === typeValue);
    return t ? t.label : 'Tipo';
  };

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
              <SelectValue placeholder="Colección">
                {filters.set && (
                  <span className="filter-select-value" title={getSetName(filters.set)}>
                    {getSetDisplayName(filters.set)}
                  </span>
                )}
                {!filters.set && <span className="filter-select-placeholder">Colección</span>}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="filter-select-content">
              <SelectItem value="" className="filter-select-item">
                Todas las colecciones
              </SelectItem>
              {sets.map((set) => (
                <SelectItem
                  key={set.id}
                  value={set.id}
                  className="filter-select-item"
                  title={set.name}
                >
                  {truncateText(set.name)}
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
              <SelectValue placeholder="Categoría">
                {filters.category && (
                  <span className="filter-select-value">{getCategoryName(filters.category)}</span>
                )}
                {!filters.category && <span className="filter-select-placeholder">Categoría</span>}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="filter-select-content">
              <SelectItem value="" className="filter-select-item">
                Todas las categorías
              </SelectItem>
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
              <SelectValue placeholder="Rareza">
                {filters.rarity && (
                  <span className="filter-select-value">{getRarityName(filters.rarity)}</span>
                )}
                {!filters.rarity && <span className="filter-select-placeholder">Rareza</span>}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="filter-select-content">
              <SelectItem value="" className="filter-select-item">
                Todas las rarezas
              </SelectItem>
              {rarities.map((rarity) => (
                <SelectItem key={rarity.value} value={rarity.value} className="filter-select-item">
                  {rarity.label}
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
              <SelectValue placeholder="Tipo">
                {filters.type && (
                  <span className="filter-select-value">{getTypeName(filters.type)}</span>
                )}
                {!filters.type && <span className="filter-select-placeholder">Tipo</span>}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="filter-select-content">
              <SelectItem value="" className="filter-select-item">
                Todos los tipos
              </SelectItem>
              {types.map((type) => (
                <SelectItem key={type.value} value={type.value} className="filter-select-item">
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Acciones */}
        <div className="filter-actions">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="filter-clear-btn">
              <X className="mr-1 h-4 w-4" />
              Limpiar
            </Button>
          )}
          <Button onClick={applyFilters} className="filter-apply-btn">
            <Search className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
        </div>
      </div>
    </div>
  );
}
