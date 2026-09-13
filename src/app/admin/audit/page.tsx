// src/app/admin/audit/page.tsx
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
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Eye, Pencil, Trash2, RefreshCw, Package, User, AlertCircle } from 'lucide-react';
import './admin-audit.css';

const actionIcons: Record<string, any> = {
  CREATE: Package,
  UPDATE: Pencil,
  DELETE: Trash2,
  RESTORE: RefreshCw,
  DEACTIVATE: AlertCircle,
  VIEW: Eye,
  LOGIN: User,
};

const actionBadgeClasses: Record<string, string> = {
  CREATE: 'admin-audit-badge-create',
  UPDATE: 'admin-audit-badge-update',
  DELETE: 'admin-audit-badge-delete',
  RESTORE: 'admin-audit-badge-restore',
  DEACTIVATE: 'admin-audit-badge-deactivate',
  VIEW: 'admin-audit-badge-view',
  LOGIN: 'admin-audit-badge-login',
};

const actionLabels: Record<string, string> = {
  CREATE: 'Creación',
  UPDATE: 'Actualización',
  DELETE: 'Eliminación',
  RESTORE: 'Restauración',
  DEACTIVATE: 'Desactivación',
  VIEW: 'Visualización',
  LOGIN: 'Inicio de sesión',
};

export default async function AuditPage() {
  const logs = await prisma.auditLog.findMany({
    include: {
      user: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return (
    <div className="admin-audit-page">
      <div className="admin-audit-header">
        <h1 className="admin-audit-title">Auditoría</h1>
        <p className="admin-audit-subtitle">Historial de acciones de administradores</p>
      </div>

      <Card className="admin-audit-card">
        <CardHeader className="admin-audit-card-header">
          <CardTitle className="admin-audit-card-title">Registro de Actividad</CardTitle>
        </CardHeader>
        <CardContent className="admin-audit-card-content">
          {logs.length === 0 ? (
            <p className="admin-audit-empty">No hay registros de auditoría</p>
          ) : (
            <div className="admin-audit-table-wrap">
              <Table>
                <TableHeader>
                  <TableRow className="admin-audit-table-header">
                    <TableHead className="admin-audit-table-th">Fecha</TableHead>
                    <TableHead className="admin-audit-table-th">Usuario</TableHead>
                    <TableHead className="admin-audit-table-th">Acción</TableHead>
                    <TableHead className="admin-audit-table-th">Entidad</TableHead>
                    <TableHead className="admin-audit-table-th">Detalles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => {
                    const Icon = actionIcons[log.action] || Package;
                    const badgeClass =
                      actionBadgeClasses[log.action] || 'admin-audit-badge-default';
                    const label = actionLabels[log.action] || log.action;

                    return (
                      <TableRow key={log.id} className="admin-audit-table-row">
                        <TableCell className="admin-audit-table-cell">
                          <span className="admin-audit-date">{formatDate(log.createdAt)}</span>
                          <span className="admin-audit-time">
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </span>
                        </TableCell>
                        <TableCell className="admin-audit-table-cell">
                          <div className="admin-audit-user">
                            <span className="admin-audit-user-name">
                              {log.user.name || log.user.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="admin-audit-table-cell">
                          <Badge className={`admin-audit-badge ${badgeClass}`}>
                            <Icon className="admin-audit-badge-icon" />
                            {label}
                          </Badge>
                        </TableCell>
                        <TableCell className="admin-audit-table-cell">
                          <span className="admin-audit-entity">
                            {log.entityType}
                            <span className="admin-audit-entity-id">
                              ID: {log.entityId.slice(0, 8)}
                            </span>
                          </span>
                        </TableCell>
                        <TableCell className="admin-audit-table-cell">
                          <div className="admin-audit-details">
                            {log.reason || 'Sin detalles adicionales'}
                            {log.changes && (
                              <details className="admin-audit-details-details">
                                <summary className="admin-audit-details-summary">
                                  Ver cambios
                                </summary>
                                <pre className="admin-audit-details-changes">
                                  {JSON.stringify(log.changes, null, 2)}
                                </pre>
                              </details>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
