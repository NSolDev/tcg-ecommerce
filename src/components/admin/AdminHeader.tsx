// src/components/admin/AdminHeader.tsx
'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut, Home, Sparkles } from 'lucide-react'
import Link from 'next/link'
import './admin-header.css'

export function AdminHeader() {
  return (
    <header className="admin-header">
      <div className="admin-header-container">
        {/* Logo */}
        <div className="admin-header-left">
          <Link href="/admin" className="admin-header-logo">
            <div className="admin-header-logo-wrapper">
              <div className="admin-header-logo-glow" />
              <div className="admin-header-logo-icon">
                <Sparkles />
              </div>
            </div>
            <div>
              <span className="admin-header-logo-text">
                Panel Admin
              </span>
              <span className="admin-header-logo-badge">
                ⚡ Gestión de la tienda
              </span>
            </div>
          </Link>
        </div>

        {/* Acciones */}
        <div className="admin-header-right">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="admin-header-btn admin-header-btn-back"
          >
            <Link href="/">
              <Home className="icon" />
              <span className="text">Volver a la web</span>
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => signOut({ redirectTo: '/' })}
            className="admin-header-btn admin-header-btn-logout"
          >
            <LogOut className="icon" />
            <span className="text">Cerrar Sesión</span>
          </Button>
        </div>
      </div>
    </header>
  )
}