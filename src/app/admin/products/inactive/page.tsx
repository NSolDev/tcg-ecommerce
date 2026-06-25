// src/app/admin/products/inactive/page.tsx
import { prisma } from '@/lib/db/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { RestoreProductButton } from '@/components/admin/RestoreProductButton'
import { AlertCircle, PackageX, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function InactiveProductsPage() {
  const inactiveProducts = await prisma.product.findMany({
    where: { isActive: false },
    include: {
      set: true,
    },
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Productos Inactivos</h1>
          <p className="text-muted-foreground">
            {inactiveProducts.length} productos desactivados
          </p>
        </div>
        <Button asChild variant="outline" className="border-white/10 hover:border-primary/50 bg-white/5 text-white">
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al catálogo
          </Link>
        </Button>
      </div>

      {inactiveProducts.length === 0 ? (
        <Card className="bg-[#1a1a2e]/50 border-white/10 backdrop-blur-sm">
          <CardContent className="px-6 py-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-green-500/10">
                <PackageX className="h-12 w-12 text-green-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No hay productos inactivos</h3>
            <p className="text-muted-foreground">
              Todos los productos están activos en el catálogo
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-[#1a1a2e]/50 border-white/10 backdrop-blur-sm">
          <CardHeader className="px-6 pt-6 pb-3">
            <CardTitle className="text-lg text-white">Lista de Productos Inactivos</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-white/60">Producto</TableHead>
                  <TableHead className="text-white/60">Categoría</TableHead>
                  <TableHead className="text-white/60">Precio</TableHead>
                  <TableHead className="text-white/60">Colección</TableHead>
                  <TableHead className="text-white/60">Razón</TableHead>
                  <TableHead className="text-white/60 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inactiveProducts.map((product) => (
                  <TableRow key={product.id} className="border-white/5 hover:bg-white/5">
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {product.id.slice(0, 8)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-white/10 text-white/70">
                        {product.category === 'CARD' ? '🃏 Carta' : 
                         product.category === 'PACK' ? '📦 Sobre' : 
                         '📦 Caja'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">{formatPrice(product.price)}</TableCell>
                    <TableCell className="text-white/80">{product.set.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-yellow-400/80">
                          {product.inactiveReason || 'Sin motivo especificado'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <RestoreProductButton productId={product.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}