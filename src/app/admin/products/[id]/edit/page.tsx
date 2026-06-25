// src/app/admin/products/[id]/edit/page.tsx
import { prisma } from '@/lib/db/prisma'
import { ProductForm } from '@/components/admin/ProductForm'
import { notFound } from 'next/navigation'

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const [product, sets] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
    }),
    prisma.set.findMany({
      orderBy: { name: 'asc' },
    }),
  ])

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Producto</h1>
        <p className="text-muted-foreground">Actualiza la información del producto</p>
      </div>

      <ProductForm product={product} sets={sets} />
    </div>
  )
}