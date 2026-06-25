// src/components/admin/AdminNav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Tag,
  FileText,
} from 'lucide-react'

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true, // Solo se activa cuando es exactamente /admin
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
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1.5 bg-[#1a1a2e]/50 rounded-xl border border-white/10 p-3 backdrop-blur-sm">
      {navItems.map((item) => {
        // Lógica de activación mejorada
        let isActive = false
        
        if (item.exact) {
          // Para Dashboard: solo activo si pathname es exactamente '/admin'
          isActive = pathname === item.href
        } else {
          // Para otras rutas: activo si pathname comienza con item.href
          isActive = pathname?.startsWith(item.href)
        }
        
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-300',
              isActive
                ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/10'
                : 'text-muted-foreground hover:text-white hover:bg-white/5 hover:border hover:border-white/10'
            )}
          >
            <Icon className={cn(
              'h-4 w-4',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )} />
            {item.title}
            {isActive && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}