// src/components/product/CollectionNav.tsx
'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronDown, Package, Sparkles, Zap } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import './collection-nav.css';

interface CollectionNavProps {
  collections: string[];
  categories: { value: string; label: string; icon: React.ReactNode }[];
}

export function CollectionNav({ collections, categories }: CollectionNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  // Refs para detectar clics fuera
  const collectionsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const currentCategory = searchParams.get('category') || 'all';
  const currentSet = searchParams.get('set') || 'all';

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (collectionsRef.current && !collectionsRef.current.contains(event.target as Node)) {
        setIsCollectionsOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cerrar al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isCollectionsOpen) setIsCollectionsOpen(false);
      if (isCategoriesOpen) setIsCategoriesOpen(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isCollectionsOpen, isCategoriesOpen]);

  const isActive = (path: string) => {
    if (path === '/products') {
      return pathname === '/products' && !searchParams.get('category') && !searchParams.get('set');
    }
    return pathname === path;
  };

  const getCategoryUrl = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    params.delete('set');
    return `/products?${params.toString()}`;
  };

  const getSetUrl = (setId: string) => {
    const params = new URLSearchParams(searchParams);
    if (setId === 'all') {
      params.delete('set');
    } else {
      params.set('set', setId);
    }
    return `/products?${params.toString()}`;
  };

  return (
    <nav className="collection-nav">
      <div className="collection-nav-container">
        {/* Enlaces principales */}
        <div className="collection-nav-links">
          <Link
            href="/products"
            className={cn('collection-nav-link', isActive('/products') && 'active')}
          >
            <Sparkles className="nav-icon" />
            Todos
          </Link>
        </div>

        {/* Dropdown de Categorías */}
        <div className="collection-nav-dropdown" ref={categoriesRef}>
          <button
            className={cn('collection-nav-dropdown-trigger', currentCategory !== 'all' && 'active')}
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
          >
            <Package className="nav-icon" />
            <span>Categorías</span>
            <ChevronDown className={cn('dropdown-arrow', isCategoriesOpen && 'open')} />
            {currentCategory !== 'all' && (
              <span className="collection-nav-active-badge">
                {categories.find((c) => c.value === currentCategory)?.label || currentCategory}
              </span>
            )}
          </button>
          {isCategoriesOpen && (
            <div className="collection-nav-dropdown-menu">
              <Link
                href="/products"
                className={cn(
                  'collection-nav-dropdown-item',
                  currentCategory === 'all' && 'active'
                )}
                onClick={() => setIsCategoriesOpen(false)}
              >
                <Sparkles className="item-icon" />
                Todas las categorías
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.value}
                  href={getCategoryUrl(category.value)}
                  className={cn(
                    'collection-nav-dropdown-item',
                    currentCategory === category.value && 'active'
                  )}
                  onClick={() => setIsCategoriesOpen(false)}
                >
                  <span className="item-icon">{category.icon}</span>
                  {category.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown de Colecciones */}
        <div className="collection-nav-dropdown" ref={collectionsRef}>
          <button
            className={cn('collection-nav-dropdown-trigger', currentSet !== 'all' && 'active')}
            onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
          >
            <Zap className="nav-icon" />
            <span>Colecciones</span>
            <ChevronDown className={cn('dropdown-arrow', isCollectionsOpen && 'open')} />
            {currentSet !== 'all' && (
              <span className="collection-nav-active-badge">
                {collections.find((c) => c === currentSet) || currentSet}
              </span>
            )}
          </button>
          {isCollectionsOpen && (
            <div className="collection-nav-dropdown-menu collection-nav-dropdown-menu-grid">
              <Link
                href="/products"
                className={cn('collection-nav-dropdown-item', currentSet === 'all' && 'active')}
                onClick={() => setIsCollectionsOpen(false)}
              >
                <Sparkles className="item-icon" />
                Todas las colecciones
              </Link>
              {collections.map((collection) => (
                <Link
                  key={collection}
                  href={getSetUrl(collection)}
                  className={cn(
                    'collection-nav-dropdown-item',
                    currentSet === collection && 'active'
                  )}
                  onClick={() => setIsCollectionsOpen(false)}
                >
                  <span className="item-icon">📦</span>
                  {collection}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
