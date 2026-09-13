// src/lib/actions/account.actions.ts
'use server';

import { prisma } from '@/lib/db/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres').max(80),
  image: z.string().trim().url('La URL del avatar no es válida').optional().or(z.literal('')),
});

export async function updateProfile(data: { name: string; image?: string }) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Debes iniciar sesión');
  }

  const parsed = profileSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.errors.map((e) => e.message).join(', '));
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      image: parsed.data.image ? parsed.data.image : null,
    },
  });

  revalidatePath('/account');
  revalidatePath('/account/settings');
  return { success: true };
}
