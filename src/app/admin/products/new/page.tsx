// src/app/admin/products/new/page.tsx
import { prisma } from '@/lib/db/prisma'
import { ProductForm } from '@/components/admin/ProductForm'

export default async function NewProductPage() {
  const sets = await prisma.set.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nuevo Producto</h1>
        <p className="text-muted-foreground">Agrega una nueva carta al catálogo</p>
      </div>

      <ProductForm sets={sets} />
    </div>
  )
}