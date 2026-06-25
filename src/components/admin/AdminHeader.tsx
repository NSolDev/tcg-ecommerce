// src/components/admin/AdminHeader.tsx
'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut, Home, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function AdminHeader() {
  return (
    <header className="border-b border-white/10 bg-[#1a1a2e]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pokemon-red to-pokemon-yellow rounded-full blur-lg opacity-50" />
            <div className="relative bg-gradient-to-r from-pokemon-red to-pokemon-yellow p-2 rounded-full">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-pokemon-red to-pokemon-blue bg-clip-text text-transparent">
              Panel Admin
            </span>
            <span className="hidden md:inline ml-2 text-xs text-muted-foreground">
              ⚡ Gestión de la tienda
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-white/10 hover:border-primary/50 bg-white/5 backdrop-blur-sm"
          >
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Volver a la web</span>
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => signOut({ redirectTo: '/' })}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </Button>
        </div>
      </div>
    </header>
  )
}