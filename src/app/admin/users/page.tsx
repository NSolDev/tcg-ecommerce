// src/app/admin/users/page.tsx
import { prisma } from '@/lib/db/prisma'
import { auth } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Shield, ShieldOff, UserX } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { UpdateUserRoleButton } from '@/components/admin/UpdateUserRoleButton'
import { DeleteUserButton } from '@/components/admin/DeleteUserButton'
import './admin-users.css'

export default async function AdminUsersPage() {
  const session = await auth()
  const currentUserId = session?.user?.id

  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          orders: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="admin-users-page">
      <div className="admin-users-header">
        <h1 className="admin-users-title">Usuarios</h1>
        <p className="admin-users-subtitle">Gestiona los usuarios de la tienda</p>
      </div>

      <Card className="admin-users-card">
        <CardHeader className="admin-users-card-header">
          <CardTitle className="admin-users-card-title">Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent className="admin-users-card-content">
          {users.length === 0 ? (
            <p className="admin-users-empty">No hay usuarios registrados</p>
          ) : (
            <div className="admin-users-table-wrap">
              <Table>
                <TableHeader>
                  <TableRow className="admin-users-table-header">
                    <TableHead className="admin-users-table-th">Usuario</TableHead>
                    <TableHead className="admin-users-table-th">Email</TableHead>
                    <TableHead className="admin-users-table-th">Rol</TableHead>
                    <TableHead className="admin-users-table-th">Pedidos</TableHead>
                    <TableHead className="admin-users-table-th">Fecha de Registro</TableHead>
                    <TableHead className="admin-users-table-th text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const isCurrentUser = user.id === currentUserId
                    const isAdmin = user.role === 'ADMIN'

                    return (
                      <TableRow key={user.id} className="admin-users-table-row">
                        <TableCell data-label="Usuario" className="admin-users-table-cell-name">
                          {user.name || 'Sin nombre'}
                          {isCurrentUser && (
                            <span className="admin-users-badge-current">Tú</span>
                          )}
                        </TableCell>
                        <TableCell data-label="Email" className="admin-users-table-cell-email">
                          {user.email}
                        </TableCell>
                        <TableCell data-label="Rol">
                          <Badge className={isAdmin ? 'admin-users-badge-admin' : 'admin-users-badge-user'}>
                            {isAdmin ? 'Administrador' : 'Usuario'}
                          </Badge>
                        </TableCell>
                        <TableCell data-label="Pedidos" className="admin-users-table-cell-orders">
                          {user._count.orders}
                        </TableCell>
                        <TableCell data-label="Fecha de Registro" className="admin-users-table-cell-date">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell data-label="Acciones" className="admin-users-table-cell-actions">
                          <Button variant="outline" size="sm" asChild className="admin-users-btn-view">
                            <Link href={`/admin/users/${user.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>

                          {!isCurrentUser && (
                            <UpdateUserRoleButton 
                              userId={user.id} 
                              currentRole={user.role} 
                            />
                          )}

                          {!isCurrentUser && (
                            <DeleteUserButton userId={user.id} isAdmin={isAdmin} />
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}