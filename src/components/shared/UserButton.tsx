// src/components/shared/UserButton.tsx
'use client'

import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { User, Heart, Package, Settings, LogOut, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'
import './user-button.css'

export function UserButton() {
  const { data: session } = useSession()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!session?.user) {
    return (
      <div className="user-button-guest">
        <Link href="/login" className="btn-login">
          Iniciar Sesión
        </Link>
        <Link href="/register" className="btn-register">
          Registrarse
        </Link>
      </div>
    )
  }

  const initials = session.user.name
    ? session.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : session.user.email?.[0].toUpperCase() || 'U'

  // Solo renderizar el avatar después del montaje para evitar hidratación
  if (!isMounted) {
    return (
      <div className="user-button-placeholder">
        <div className="avatar-placeholder" />
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="user-button-avatar">
          <Avatar className="avatar">
            <AvatarImage src={session.user.image || undefined} />
            <AvatarFallback className="avatar-fallback">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="user-dropdown">
        <DropdownMenuLabel className="header">
          <p className="name">{session.user.name}</p>
          <p className="email">{session.user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="separator" />
        
        <DropdownMenuItem asChild className="item">
          <Link href="/account">
            <User className="icon" />
            Mi Cuenta
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="item">
          <Link href="/wishlist">
            <Heart className="icon wishlist" />
            Favoritos
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="item">
          <Link href="/orders">
            <Package className="icon" />
            Mis Pedidos
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="item">
          <Link href="/account/settings">
            <Settings className="icon" />
            Configuración
          </Link>
        </DropdownMenuItem>

        {session.user.role === 'ADMIN' && (
          <>
            <DropdownMenuSeparator className="separator" />
            <DropdownMenuItem asChild className="item">
              <Link href="/admin">
                <Shield className="icon admin" />
                Panel Admin
                <span className="badge-admin">ADMIN</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator className="separator" />
        <DropdownMenuItem
          className="item danger"
          onClick={() => signOut({ redirectTo: '/' })}
        >
          <LogOut className="icon" />
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}