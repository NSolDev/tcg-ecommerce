// src/app/admin/layout.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminNav } from '@/components/admin/AdminNav'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Verificar que el usuario es administrador
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <AdminHeader />
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar de navegación */}
          <aside className="w-64 flex-shrink-0 sticky top-24 self-start">
            <AdminNav />
          </aside>

          {/* Contenido principal */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}