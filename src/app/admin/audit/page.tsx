// src/app/admin/audit/page.tsx
import { prisma } from '@/lib/db/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { 
  Eye, 
  Pencil, 
  Trash2, 
  RefreshCw, 
  Package, 
  User,
  AlertCircle
} from 'lucide-react'

const actionIcons: Record<string, any> = {
  CREATE: Package,
  UPDATE: Pencil,
  DELETE: Trash2,
  RESTORE: RefreshCw,
  DEACTIVATE: AlertCircle,
  VIEW: Eye,
  LOGIN: User,
}

const actionColors: Record<string, string> = {
  CREATE: 'bg-green-500/20 text-green-400 border-green-500/20',
  UPDATE: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
  DELETE: 'bg-red-500/20 text-red-400 border-red-500/20',
  RESTORE: 'bg-green-500/20 text-green-400 border-green-500/20',
  DEACTIVATE: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
  VIEW: 'bg-gray-500/20 text-gray-400 border-gray-500/20',
  LOGIN: 'bg-purple-500/20 text-purple-400 border-purple-500/20',
}

const actionLabels: Record<string, string> = {
  CREATE: 'Creación',
  UPDATE: 'Actualización',
  DELETE: 'Eliminación',
  RESTORE: 'Restauración',
  DEACTIVATE: 'Desactivación',
  VIEW: 'Visualización',
  LOGIN: 'Inicio de sesión',
}

export default async function AuditPage() {
  const logs = await prisma.auditLog.findMany({
    include: {
      user: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Auditoría</h1>
        <p className="text-muted-foreground">
          Historial de acciones de administradores
        </p>
      </div>

      <Card className="bg-[#1a1a2e]/50 border-white/10 backdrop-blur-sm">
        <CardHeader className="px-6 pt-6 pb-3">
          <CardTitle className="text-lg text-white">Registro de Actividad</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No hay registros de auditoría</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-white/60">Fecha</TableHead>
                  <TableHead className="text-white/60">Usuario</TableHead>
                  <TableHead className="text-white/60">Acción</TableHead>
                  <TableHead className="text-white/60">Entidad</TableHead>
                  <TableHead className="text-white/60">Detalles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => {
                  const Icon = actionIcons[log.action] || Package
                  const colorClass = actionColors[log.action] || 'bg-gray-500/20 text-gray-400 border-gray-500/20'
                  const label = actionLabels[log.action] || log.action

                  return (
                    <TableRow key={log.id} className="border-white/5 hover:bg-white/5">
                      <TableCell className="text-white/80 text-sm">
                        {formatDate(log.createdAt)}
                        <span className="block text-xs text-muted-foreground">
                          {new Date(log.createdAt).toLocaleTimeString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-white">{log.user.name || log.user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={colorClass}>
                          <Icon className="h-3 w-3 mr-1" />
                          {label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-white/80">
                          {log.entityType}
                          <span className="block text-xs text-muted-foreground">
                            ID: {log.entityId.slice(0, 8)}
                          </span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground max-w-xs">
                          {log.reason || 'Sin detalles adicionales'}
                          {log.changes && (
                            <details className="mt-1">
                              <summary className="text-xs text-primary cursor-pointer hover:text-primary/80">
                                Ver cambios
                              </summary>
                              <pre className="text-xs bg-white/5 p-2 rounded mt-1 overflow-x-auto">
                                {JSON.stringify(log.changes, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}