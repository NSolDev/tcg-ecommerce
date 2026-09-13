// src/app/(shop)/account/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Calendar, Shield, Edit, Package, Heart, ShoppingCart, Settings } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import './account-page.css';

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      emailVerified: true,
      _count: {
        select: {
          orders: true,
        },
      },
    },
  });

  if (!user) {
    redirect('/');
  }

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user.email?.[0].toUpperCase() || 'U';

  return (
    <div className="account-container">
      <h1 className="account-title">Mi Cuenta</h1>

      <div className="account-grid">
        {/* Perfil */}
        <Card className="account-profile-card">
          <CardHeader className="account-profile-header">
            <div className="account-avatar-wrapper">
              <Avatar className="account-avatar">
                <AvatarImage src={user.image || undefined} />
                <AvatarFallback className="account-avatar-fallback">{initials}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="account-profile-name">{user.name || 'Usuario'}</CardTitle>
            <CardDescription className="account-profile-role">
              {user.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
            </CardDescription>
          </CardHeader>
          <CardContent className="account-profile-content">
            <div className="account-profile-info">
              <div className="account-profile-row">
                <Mail className="account-profile-icon" />
                <span className="account-profile-text">{user.email}</span>
              </div>
              <div className="account-profile-row">
                <Calendar className="account-profile-icon" />
                <span className="account-profile-text">
                  Miembro desde {formatDate(user.createdAt)}
                </span>
              </div>
              <div className="account-profile-row">
                <Package className="account-profile-icon" />
                <span className="account-profile-text">
                  {user._count.orders} pedidos realizados
                </span>
              </div>
              <div className="account-profile-row">
                <Shield className="account-profile-icon" />
                <span className="account-profile-text">
                  {user.emailVerified ? '✅ Email verificado' : '❌ Email no verificado'}
                </span>
              </div>
            </div>
            <Button variant="outline" className="account-profile-edit">
              <Edit className="mr-2 h-4 w-4" />
              Editar Perfil
            </Button>
          </CardContent>
        </Card>

        {/* Acciones rápidas */}
        <div className="account-actions-wrapper">
          <Card className="account-actions-card">
            <CardHeader className="account-actions-header">
              <CardTitle className="account-actions-title">Acciones Rápidas</CardTitle>
              <CardDescription className="account-actions-description">
                Gestiona tu actividad en la tienda
              </CardDescription>
            </CardHeader>
            <CardContent className="account-actions-grid">
              <Link href="/orders" className="account-action-btn">
                <Package className="account-action-icon primary" />
                <span className="account-action-label">Mis Pedidos</span>
              </Link>
              <Link href="/wishlist" className="account-action-btn">
                <Heart className="account-action-icon wishlist" />
                <span className="account-action-label">Favoritos</span>
              </Link>
              <Link href="/cart" className="account-action-btn">
                <ShoppingCart className="account-action-icon primary" />
                <span className="account-action-label">Carrito</span>
              </Link>
              <Link href="/account/settings" className="account-action-btn">
                <Settings className="account-action-icon muted" />
                <span className="account-action-label">Configuración</span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
