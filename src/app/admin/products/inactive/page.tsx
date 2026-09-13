// src/app/admin/products/inactive/page.tsx
import { prisma } from '@/lib/db/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { RestoreProductButton } from '@/components/admin/RestoreProductButton';
import { AlertCircle, PackageX, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import './inactive-products.css';

export default async function InactiveProductsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: false },
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
    orderBy: { updatedAt: 'desc' },
  });

  const productsWithSet = products.map((product) => {
    let setInfo = null;

    if (product.card) {
      setInfo = product.card.set;
    } else if (product.pack) {
      setInfo = product.pack.set;
    } else if (product.box) {
      setInfo = product.box.set;
    }

    return {
      ...product,
      set: setInfo,
    };
  });

  return (
    <div className="inactive-products-page">
      <div className="inactive-products-header">
        <div>
          <h1 className="inactive-products-title">Productos Inactivos</h1>
          <p className="inactive-products-count">{productsWithSet.length} productos desactivados</p>
        </div>
        <Button asChild variant="outline" className="inactive-products-back">
          <Link href="/admin/products">
            <ArrowLeft className="icon" />
            Volver al catálogo
          </Link>
        </Button>
      </div>

      {productsWithSet.length === 0 ? (
        <Card className="inactive-products-empty">
          <CardContent className="inactive-products-empty-content">
            <div className="inactive-products-empty-icon">
              <PackageX />
            </div>
            <h3 className="inactive-products-empty-title">No hay productos inactivos</h3>
            <p className="inactive-products-empty-text">
              Todos los productos están activos en el catálogo
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="inactive-products-card">
          <CardHeader className="inactive-products-card-header">
            <CardTitle className="inactive-products-card-title">
              Lista de Productos Inactivos
            </CardTitle>
          </CardHeader>
          <CardContent className="inactive-products-card-content">
            <div className="inactive-products-table-wrap">
              <Table>
                <TableHeader>
                  <TableRow className="inactive-products-table-header">
                    <TableHead className="inactive-products-table-th">Producto</TableHead>
                    <TableHead className="inactive-products-table-th">Categoría</TableHead>
                    <TableHead className="inactive-products-table-th">Precio</TableHead>
                    <TableHead className="inactive-products-table-th">Colección</TableHead>
                    <TableHead className="inactive-products-table-th">Razón</TableHead>
                    <TableHead className="inactive-products-table-th text-right">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productsWithSet.map((product) => {
                    let categoryLabel = 'Producto';
                    if (product.card) categoryLabel = '🃏 Carta';
                    else if (product.pack) categoryLabel = '📦 Sobre';
                    else if (product.box) categoryLabel = '📦 Caja';

                    return (
                      <TableRow key={product.id} className="inactive-products-table-row">
                        <TableCell className="inactive-products-table-cell">
                          <div>
                            <p className="inactive-product-name">{product.name}</p>
                            <span className="inactive-product-id">
                              ID: {product.id.slice(0, 8)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="inactive-products-table-cell">
                          <Badge variant="outline" className="inactive-product-badge">
                            {categoryLabel}
                          </Badge>
                        </TableCell>
                        <TableCell className="inactive-products-table-cell inactive-product-price">
                          {formatPrice(product.price)}
                        </TableCell>
                        <TableCell className="inactive-products-table-cell inactive-product-set">
                          {product.set?.name || '-'}
                        </TableCell>
                        <TableCell className="inactive-products-table-cell">
                          <div className="inactive-product-reason">
                            <AlertCircle className="inactive-product-reason-icon" />
                            <span className="inactive-product-reason-text">
                              {product.inactiveReason || 'Sin motivo especificado'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="inactive-products-actions">
                          <RestoreProductButton productId={product.id} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
