// src/lib/actions/wishlist.actions.ts
'use server';

import { prisma } from '@/lib/db/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

/** Product ids in the current user's wishlist (empty for guests). */
export async function getWishlistProductIds(): Promise<string[]> {
  const session = await auth();
  if (!session?.user) return [];

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: session.user.id },
    select: { items: { select: { productId: true } } },
  });
  return wishlist?.items.map((i) => i.productId) ?? [];
}

/**
 * Adds/removes a product from the current user's wishlist. Ownership is derived
 * from the session — a user can only ever modify their own wishlist.
 */
export async function toggleWishlist(productId: string): Promise<{ added: boolean }> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Debes iniciar sesión para guardar favoritos');
  }
  const userId = session.user.id;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });
  if (!product) {
    throw new Error('Producto no encontrado');
  }

  // Ensure the user has a wishlist.
  const wishlist = await prisma.wishlist.upsert({
    where: { userId },
    create: { userId },
    update: {},
    select: { id: true },
  });

  const existing = await prisma.wishlistItem.findUnique({
    where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
    select: { id: true },
  });

  let added: boolean;
  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    added = false;
  } else {
    await prisma.wishlistItem.create({ data: { wishlistId: wishlist.id, productId } });
    added = true;
  }

  revalidatePath('/wishlist');
  return { added };
}
