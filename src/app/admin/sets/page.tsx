// src/app/admin/sets/page.tsx
import { prisma } from '@/lib/db/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function AdminSetsPage() {
  const sets = await prisma.set.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { releaseDate: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Colecciones</h1>
          <p className="text-muted-foreground">Gestiona las colecciones de cartas</p>
        </div>
        <Button asChild>
          <Link href="/admin/sets/new">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Colección
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Colecciones</CardTitle>
        </CardHeader>
        <CardContent>
          {sets.length === 0 ? (
            <p className="text-muted-foreground">No hay colecciones registradas</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Fecha de Lanzamiento</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sets.map((set) => (
                  <TableRow key={set.id}>
                    <TableCell className="font-medium">
                      {set.name}
                    </TableCell>
                    <TableCell>{formatDate(set.releaseDate)}</TableCell>
                    <TableCell>{set._count.products}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/sets/${set.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}