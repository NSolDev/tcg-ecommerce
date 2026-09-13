// src/components/admin/AdminNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Tag,
  FileText,
} from 'lucide-react';
import './admin-nav.css';

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: 'Productos',
    href: '/admin/products',
    icon: Package,
  },
  {
    title: 'Colecciones',
    href: '/admin/sets',
    icon: Tag,
  },
  {
    title: 'Pedidos',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Usuarios',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Auditoría',
    href: '/admin/audit',
    icon: FileText,
  },
  {
    title: 'Configuración',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="admin-nav">
      {navItems.map((item) => {
        let isActive = false;

        if (item.exact) {
          isActive = pathname === item.href;
        } else {
          isActive = pathname?.startsWith(item.href) || false;
        }

        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn('admin-nav-item', isActive && 'active')}
          >
            <Icon className="icon" />
            {item.title}
            {isActive && <span className="indicator" />}
          </Link>
        );
      })}
    </nav>
  );
}
