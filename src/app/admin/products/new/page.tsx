// src/app/admin/products/new/page.tsx
import { prisma } from '@/lib/db/prisma'
import { ProductForm } from '@/components/admin/ProductForm'

export default async function NewProductPage() {
  const sets = await prisma.set.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="admin-page-section">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Nuevo Producto</h1>
        <p className="admin-page-description">Agrega una nueva carta, sobre o caja al catálogo</p>
      </div>
      <div className="admin-form-card">
        <ProductForm sets={sets} />
      </div>
    </div>
  )
}