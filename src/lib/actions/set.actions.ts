// src/lib/actions/set.actions.ts
'use server';

import { prisma } from '@/lib/db/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const setSchema = z.object({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres'),
  releaseDate: z.string().min(1, 'La fecha de lanzamiento es requerida'),
  logoUrl: z.string().trim().url('La URL del logo no es válida').optional().or(z.literal('')),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('No autorizado');
  }
  return session;
}

export async function createSet(data: { name: string; releaseDate: string; logoUrl?: string }) {
  const session = await requireAdmin();

  const parsed = setSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.errors.map((e) => e.message).join(', '));
  }

  const releaseDate = new Date(parsed.data.releaseDate);
  if (Number.isNaN(releaseDate.getTime())) {
    throw new Error('La fecha de lanzamiento no es válida');
  }

  const existing = await prisma.set.findUnique({ where: { name: parsed.data.name } });
  if (existing) {
    throw new Error('Ya existe una colección con ese nombre');
  }

  const set = await prisma.set.create({
    data: {
      name: parsed.data.name,
      releaseDate,
      logoUrl: parsed.data.logoUrl ? parsed.data.logoUrl : null,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'CREATE',
      entityType: 'SET',
      entityId: set.id,
      changes: { set: parsed.data },
      reason: 'Colección creada',
    },
  });

  revalidatePath('/admin/sets');
  revalidatePath('/products');
  return { success: true, set };
}

export async function deleteSet(setId: string) {
  const session = await requireAdmin();

  // Safe delete: refuse if any product references this set (no cascade in schema).
  const [cards, packs, boxes, set] = await Promise.all([
    prisma.card.count({ where: { setId } }),
    prisma.pack.count({ where: { setId } }),
    prisma.box.count({ where: { setId } }),
    prisma.set.findUnique({ where: { id: setId } }),
  ]);

  if (!set) {
    throw new Error('Colección no encontrada');
  }

  const total = cards + packs + boxes;
  if (total > 0) {
    throw new Error(
      `No se puede eliminar: la colección tiene ${total} producto(s) asociado(s). Elimina o reasigna esos productos primero.`
    );
  }

  await prisma.set.delete({ where: { id: setId } });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'DELETE',
      entityType: 'SET',
      entityId: setId,
      changes: { set },
      reason: 'Colección eliminada',
    },
  });

  revalidatePath('/admin/sets');
  return { success: true };
}
