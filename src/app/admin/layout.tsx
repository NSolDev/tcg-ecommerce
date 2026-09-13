// src/app/admin/layout.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminNav } from '@/components/admin/AdminNav';
import { AdminHeader } from '@/components/admin/AdminHeader';
import './admin.css';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="admin-layout">
      <AdminHeader />
      <div className="admin-layout-body">
        <aside className="admin-layout-sidebar">
          <AdminNav />
        </aside>
        <main className="admin-layout-main">
          <div className="admin-content-wrapper">{children}</div>
        </main>
      </div>
    </div>
  );
}
