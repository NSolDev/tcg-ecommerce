// src/app/admin/products/page.tsx
import { prisma } from '@/lib/db/prisma';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { DeleteProductButton } from '@/components/admin/DeleteProductButton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import './admin-products.css';

export default async function AdminProductsPage() {
  // Obtener productos con la nueva estructura
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      card: {
        include: {
          set: true,
        },
      },
      pack: {
        include: {
          set: true,
        },
      },
      box: {
        include: {
          set: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Transformar productos para incluir la información del set
  const productsWithSet = products.map((product) => {
    let setInfo = null;
    let rarity = null;

    if (product.card) {
      setInfo = product.card.set;
      rarity = product.card.rarity;
    } else if (product.pack) {
      setInfo = product.pack.set;
    } else if (product.box) {
      setInfo = product.box.set;
    }

    return {
      ...product,
      set: setInfo,
      rarity: rarity,
    };
  });

  const rarityLabels: Record<string, string> = {
    COMUN: 'Común',
    NORMAL: 'Normal',
    RARA: 'Rara',
    SUPER_RARA: 'Súper Rara',
    SECRETA: 'Secreta',
  };

  return (
    <div className="admin-products-page">
      <div className="admin-products-header">
        <div>
          <h1 className="admin-products-title">Productos</h1>
          <p className="admin-products-subtitle">Gestiona el catálogo de productos</p>
        </div>
        <div className="admin-products-actions">
          <Button asChild variant="outline" className="admin-products-btn-inactive">
            <Link href="/admin/products/inactive">
              <AlertCircle className="mr-2 h-4 w-4" />
              Ver Inactivos
            </Link>
          </Button>
          <Button asChild className="admin-products-btn-new">
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Producto
            </Link>
          </Button>
        </div>
      </div>

      <div className="admin-products-card">
        <CardHeader className="admin-products-card-header">
          <CardTitle className="admin-products-card-title">Catálogo de Productos</CardTitle>
        </CardHeader>
        <CardContent className="admin-products-card-content">
          {productsWithSet.length === 0 ? (
            <p className="admin-products-empty">No hay productos registrados</p>
          ) : (
            <div className="admin-products-table-wrap">
              <Table>
                <TableHeader>
                  <TableRow className="admin-products-table-header">
                    <TableHead className="admin-products-table-th">Nombre</TableHead>
                    <TableHead className="admin-products-table-th">Colección</TableHead>
                    <TableHead className="admin-products-table-th">Rareza</TableHead>
                    <TableHead className="admin-products-table-th">Precio</TableHead>
                    <TableHead className="admin-products-table-th">Stock</TableHead>
                    <TableHead className="admin-products-table-th">Estado</TableHead>
                    <TableHead className="admin-products-table-th text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productsWithSet.map((product) => (
                    <TableRow key={product.id} className="admin-products-table-row">
                      <TableCell data-label="Nombre" className="admin-products-table-cell-name">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="admin-product-name-trigger">{product.name}</span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="admin-product-tooltip">
                              <p className="admin-product-tooltip-text">{product.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell data-label="Colección" className="admin-products-table-cell">
                        {product.set?.name || '-'}
                      </TableCell>
                      <TableCell data-label="Rareza">
                        {product.rarity ? (
                          <Badge variant="outline" className="admin-products-badge">
                            {rarityLabels[product.rarity] || product.rarity}
                          </Badge>
                        ) : (
                          <span className="text-white/40">-</span>
                        )}
                      </TableCell>
                      <TableCell data-label="Precio" className="admin-products-table-cell">
                        {formatPrice(product.price)}
                      </TableCell>
                      <TableCell data-label="Stock">
                        {product.stock === 0 ? (
                          <Badge variant="destructive">Agotado</Badge>
                        ) : product.stock < 5 ? (
                          <Badge variant="outline" className="admin-products-badge-low-stock">
                            Bajo stock
                          </Badge>
                        ) : (
                          <Badge variant="default" className="admin-products-badge-stock">
                            {product.stock}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell data-label="Estado">
                        <Badge variant={product.isActive ? 'default' : 'destructive'}>
                          {product.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell
                        data-label="Acciones"
                        className="admin-products-table-cell-actions"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="admin-products-btn-edit"
                        >
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteProductButton productId={product.id} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </div>
    </div>
  );
}
