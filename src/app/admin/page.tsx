// src/app/admin/page.tsx
import { prisma } from '@/lib/db/prisma';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import './admin-dashboard.css';

export default async function AdminDashboard() {
  const [productCount, orderCount, userCount, totalRevenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { total: true },
    }),
  ]);

  const stats = [
    {
      title: 'Productos',
      value: productCount,
      icon: Package,
      description: 'Total de productos en el catálogo',
    },
    {
      title: 'Pedidos',
      value: orderCount,
      icon: ShoppingCart,
      description: 'Total de pedidos realizados',
    },
    {
      title: 'Usuarios',
      value: userCount,
      icon: Users,
      description: 'Usuarios registrados',
    },
    {
      title: 'Ingresos',
      value: formatPrice(totalRevenue._sum.total || 0),
      icon: DollarSign,
      description: 'Ingresos totales de pedidos completados',
    },
  ];

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      items: true,
    },
  });

  const lowStockProducts = await prisma.product.findMany({
    where: {
      stock: { lt: 5 },
    },
    take: 5,
    orderBy: { stock: 'asc' },
  });

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h1 className="admin-dashboard-title">Dashboard</h1>
        <p className="admin-dashboard-subtitle">Resumen de tu tienda</p>
      </div>

      <div className="admin-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="admin-stat-card">
              <div className="admin-stat-header">
                <span className="admin-stat-label">{stat.title}</span>
                <Icon className="admin-stat-icon" />
              </div>
              <div className="admin-stat-value">{stat.value}</div>
              <p className="admin-stat-description">{stat.description}</p>
            </div>
          );
        })}
      </div>

      <div className="admin-activity-grid">
        {/* Pedidos Recientes */}
        <div className="admin-activity-card">
          <h3 className="admin-activity-title">Pedidos Recientes</h3>
          {recentOrders.length === 0 ? (
            <p className="admin-activity-empty">No hay pedidos recientes</p>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className="admin-activity-item">
                <div className="info">
                  <p className="name">#{order.id.slice(0, 8)}</p>
                  <p className="detail">{order.user.name || order.user.email}</p>
                </div>
                <div className="value">
                  <p className="amount">{formatPrice(order.total)}</p>
                  <p className="status">{order.status}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Productos con Bajo Stock */}
        <div className="admin-activity-card">
          <h3 className="admin-activity-title">Productos con Bajo Stock</h3>
          {lowStockProducts.length === 0 ? (
            <p className="admin-activity-empty">Todos los productos tienen stock suficiente</p>
          ) : (
            lowStockProducts.map((product) => (
              <div key={product.id} className="admin-activity-item">
                <div className="info">
                  <p className="name">{product.name}</p>
                  <p className="detail">{product.stock} unidades</p>
                </div>
                <span className="admin-stock-warning">¡Bajo stock!</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
