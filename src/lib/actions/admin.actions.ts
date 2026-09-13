// src/lib/actions/admin.actions.ts
'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/lib/auth';

// Product form input. `type` is the ProductType enum; type-specific fields live
// on the Card/Pack/Box relations, not on Product itself.
const productSchema = z
  .object({
    name: z.string().min(1, 'El nombre es requerido'),
    slug: z
      .string()
      .min(1, 'El slug es requerido')
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'El slug solo puede contener minúsculas, números y guiones'
      ),
    description: z.string().min(1, 'La descripción es requerida'),
    price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
    stock: z.number().int().min(0, 'El stock debe ser mayor o igual a 0'),
    imageUrl: z.string().url('La URL de la imagen es inválida'),
    type: z.enum(['CARD', 'PACK', 'BOX'], {
      errorMap: () => ({ message: 'Tipo de producto inválido' }),
    }),
    setId: z.string().min(1, 'La colección es requerida'),
    rarity: z.enum(['COMUN', 'NORMAL', 'RARA', 'SUPER_RARA', 'SECRETA']).optional(),
    condition: z.enum(['MINT', 'NEAR_MINT', 'PLAYED', 'DAMAGED']).optional(),
    cardsPerPack: z.number().int().min(1).optional().nullable(),
    packsPerBox: z.number().int().min(1).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'CARD') {
      if (!data.rarity)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['rarity'],
          message: 'La rareza es requerida para cartas',
        });
      if (!data.condition)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['condition'],
          message: 'La condición es requerida para cartas',
        });
    }
  });

type ProductInput = z.infer<typeof productSchema>;

// Helper para crear logs de auditoría
async function createAuditLog(
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  changes?: any,
  reason?: string,
  ipAddress?: string,
  userAgent?: string
) {
  return prisma.auditLog.create({
    data: {
      userId,
      action,
      entityType,
      entityId,
      changes: changes || null,
      reason: reason || null,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
    },
  });
}

// Type-specific relation payloads (kept as concrete shapes so Prisma types narrow).
const cardData = (input: ProductInput) => ({
  setId: input.setId,
  rarity: input.rarity!,
  condition: input.condition!,
});
const packData = (input: ProductInput) => ({
  setId: input.setId,
  cardsPerPack: input.cardsPerPack ?? null,
});
const boxData = (input: ProductInput) => ({
  setId: input.setId,
  packsPerBox: input.packsPerBox ?? null,
});

function toProductError(error: unknown): Error {
  if (error instanceof z.ZodError) {
    return new Error('Datos inválidos: ' + error.errors.map((e) => e.message).join(', '));
  }
  return new Error(error instanceof Error ? error.message : 'Error al guardar el producto');
}

export async function createProduct(data: ProductInput) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('No autorizado');
  }

  try {
    const input = productSchema.parse(data);

    const product = await prisma.product.create({
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description,
        price: input.price,
        stock: input.stock,
        type: input.type,
        isActive: true,
        images: { create: { url: input.imageUrl, isPrimary: true, order: 0 } },
        ...(input.type === 'CARD' && { card: { create: cardData(input) } }),
        ...(input.type === 'PACK' && { pack: { create: packData(input) } }),
        ...(input.type === 'BOX' && { box: { create: boxData(input) } }),
      },
    });

    await createAuditLog(
      session.user.id,
      'CREATE',
      'PRODUCT',
      product.id,
      { product: input },
      'Producto creado'
    );

    revalidatePath('/admin/products');
    revalidatePath('/products');
    return { success: true, product };
  } catch (error) {
    throw toProductError(error);
  }
}

export async function updateProduct(id: string, data: ProductInput) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('No autorizado');
  }

  try {
    const oldProduct = await prisma.product.findUnique({ where: { id } });
    if (!oldProduct) {
      throw new Error('Producto no encontrado');
    }

    const input = productSchema.parse(data);

    const product = await prisma.$transaction(async (tx) => {
      const updated = await tx.product.update({
        where: { id },
        data: {
          name: input.name,
          slug: input.slug,
          description: input.description,
          price: input.price,
          stock: input.stock,
          type: input.type,
        },
      });

      // Primary image (create if missing).
      const primary = await tx.productImage.findFirst({
        where: { productId: id, isPrimary: true },
      });
      if (primary) {
        await tx.productImage.update({ where: { id: primary.id }, data: { url: input.imageUrl } });
      } else {
        await tx.productImage.create({
          data: { productId: id, url: input.imageUrl, isPrimary: true, order: 0 },
        });
      }

      // Type-specific relation: drop any that no longer matches, upsert the current one.
      if (input.type !== 'CARD') await tx.card.deleteMany({ where: { productId: id } });
      if (input.type !== 'PACK') await tx.pack.deleteMany({ where: { productId: id } });
      if (input.type !== 'BOX') await tx.box.deleteMany({ where: { productId: id } });

      if (input.type === 'CARD') {
        const d = cardData(input);
        await tx.card.upsert({
          where: { productId: id },
          create: { productId: id, ...d },
          update: d,
        });
      } else if (input.type === 'PACK') {
        const d = packData(input);
        await tx.pack.upsert({
          where: { productId: id },
          create: { productId: id, ...d },
          update: d,
        });
      } else {
        const d = boxData(input);
        await tx.box.upsert({
          where: { productId: id },
          create: { productId: id, ...d },
          update: d,
        });
      }

      return updated;
    });

    await createAuditLog(
      session.user.id,
      'UPDATE',
      'PRODUCT',
      product.id,
      { before: oldProduct, after: product },
      'Producto actualizado'
    );

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath(`/products/${product.slug}`);
    return { success: true, product };
  } catch (error) {
    throw toProductError(error);
  }
}

export async function deactivateProduct(id: string, reason: string) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('No autorizado');
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error('Producto no encontrado');
    }

    const orderItems = await prisma.orderItem.findMany({
      where: { productId: id },
      take: 1,
    });

    const hasOrders = orderItems.length > 0;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        isActive: false,
        inactiveReason: hasOrders
          ? `Producto con pedidos asociados. Motivo: ${reason}`
          : reason || 'Producto desactivado',
        stock: 0,
      },
    });

    await createAuditLog(
      session.user.id,
      'DEACTIVATE',
      'PRODUCT',
      product.id,
      {
        reason: updatedProduct.inactiveReason,
        hadOrders: hasOrders,
      },
      `Producto desactivado: ${reason || 'Sin motivo especificado'}`
    );

    revalidatePath('/admin/products');
    revalidatePath('/admin/products/inactive');
    revalidatePath('/products');
    return { success: true, product: updatedProduct };
  } catch (error) {
    console.error('Error desactivando producto:', error);
    throw new Error('Error al desactivar el producto');
  }
}

export async function restoreProduct(id: string) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('No autorizado');
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error('Producto no encontrado');
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        isActive: true,
        inactiveReason: null,
      },
    });

    await createAuditLog(
      session.user.id,
      'RESTORE',
      'PRODUCT',
      product.id,
      { restored: true },
      'Producto restaurado'
    );

    revalidatePath('/admin/products');
    revalidatePath('/admin/products/inactive');
    revalidatePath('/products');
    return { success: true, product: updatedProduct };
  } catch (error) {
    console.error('Error restaurando producto:', error);
    throw new Error('Error al restaurar el producto');
  }
}

export async function deleteProduct(id: string) {
  return deactivateProduct(id, 'Eliminado por administrador');
}

export async function updateStock(productId: string, stock: number) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('No autorizado');
  }

  try {
    const oldProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    const product = await prisma.product.update({
      where: { id: productId },
      data: { stock },
    });

    await createAuditLog(
      session.user.id,
      'UPDATE',
      'PRODUCT',
      product.id,
      {
        before: { stock: oldProduct?.stock },
        after: { stock: product.stock },
      },
      'Stock actualizado'
    );

    revalidatePath('/admin/products');
    revalidatePath('/products');
    return { success: true, product };
  } catch (error) {
    console.error('Error actualizando stock:', error);
    throw new Error('Error al actualizar el stock');
  }
}

// ============================================
// FUNCIONES DE GESTIÓN DE USUARIOS
// ============================================

export async function updateUserRole(userId: string, newRole: 'USER' | 'ADMIN') {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('No autorizado');
  }

  if (session.user.id === userId && newRole === 'USER') {
    throw new Error('No puedes quitarte el rol de administrador a ti mismo');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  if (newRole === 'USER') {
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' },
    });

    if (adminCount <= 1) {
      throw new Error('No puedes eliminar el último administrador del sistema');
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  await createAuditLog(
    session.user.id,
    'UPDATE',
    'USER',
    userId,
    {
      before: { role: user.role },
      after: { role: newRole },
    },
    `Rol de usuario actualizado de ${user.role} a ${newRole}`
  );

  revalidatePath('/admin/users');
  return { success: true, user: updatedUser };
}

export async function deleteUser(userId: string) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('No autorizado');
  }

  if (session.user.id === userId) {
    throw new Error('No puedes eliminarte a ti mismo');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  if (user.role === 'ADMIN') {
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' },
    });

    if (adminCount <= 1) {
      throw new Error('No puedes eliminar el último administrador del sistema');
    }
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  await createAuditLog(
    session.user.id,
    'DELETE',
    'USER',
    userId,
    { user: user },
    `Usuario ${user.email} eliminado`
  );

  revalidatePath('/admin/users');
  return { success: true };
}
