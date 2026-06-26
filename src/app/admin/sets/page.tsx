// src/app/admin/sets/page.tsx
import { prisma } from '@/lib/db/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { DeleteSetButton } from '@/components/admin/DeleteSetButton'
import './admin-sets.css'

export default async function AdminSetsPage() {
  const sets = await prisma.set.findMany({
    include: {
      _count: {
        select: {
          cards: true,
          packs: true,
          boxes: true,
        },
      },
    },
    orderBy: { releaseDate: 'desc' },
  })

  const setsWithTotal = sets.map((set) => ({
    ...set,
    totalProducts: set._count.cards + set._count.packs + set._count.boxes,
  }))

  return (
    <div className="admin-sets-page">
      <div className="admin-sets-header">
        <div>
          <h1 className="admin-sets-title">Colecciones</h1>
          <p className="admin-sets-subtitle">Gestiona las colecciones de cartas</p>
        </div>
        <Button asChild className="admin-sets-btn-new">
          <Link href="/admin/sets/new">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Colección
          </Link>
        </Button>
      </div>

      <Card className="admin-sets-card">
        <CardHeader className="admin-sets-card-header">
          <CardTitle className="admin-sets-card-title">Lista de Colecciones</CardTitle>
        </CardHeader>
        <CardContent className="admin-sets-card-content">
          {setsWithTotal.length === 0 ? (
            <p className="admin-sets-empty">No hay colecciones registradas</p>
          ) : (
            <div className="admin-sets-table-wrap">
              <Table>
                <TableHeader>
                  <TableRow className="admin-sets-table-header">
                    <TableHead className="admin-sets-table-th">Nombre</TableHead>
                    <TableHead className="admin-sets-table-th">Fecha de Lanzamiento</TableHead>
                    <TableHead className="admin-sets-table-th">Productos</TableHead>
                    <TableHead className="admin-sets-table-th text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {setsWithTotal.map((set) => (
                    <TableRow key={set.id} className="admin-sets-table-row">
                      <TableCell className="admin-sets-table-cell-name">
                        {set.name}
                      </TableCell>
                      <TableCell className="admin-sets-table-cell">
                        {formatDate(set.releaseDate)}
                      </TableCell>
                      <TableCell className="admin-sets-table-cell">
                        <span className="admin-sets-product-count">
                          {set.totalProducts}
                        </span>
                        <span className="admin-sets-product-detail">
                          ({set._count.cards} cartas, {set._count.packs} sobres, {set._count.boxes} cajas)
                        </span>
                      </TableCell>
                      <TableCell className="admin-sets-table-cell-actions">
                        <Button variant="outline" size="sm" asChild className="admin-sets-btn-edit">
                          <Link href={`/admin/sets/${set.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteSetButton setId={set.id} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}