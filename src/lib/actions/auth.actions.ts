// src/lib/actions/auth.actions.ts
'use server'

import { prisma } from '@/lib/db/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { signIn } from '@/lib/auth'
import { redirect } from 'next/navigation'

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export async function registerUser(formData: FormData) {
  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  try {
    // Validar datos
    const validated = registerSchema.parse(rawData)

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    })

    if (existingUser) {
      throw new Error('El email ya está registrado')
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(validated.password, 10)

    // Crear usuario
    await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
      },
    })

    // Iniciar sesión automáticamente
    await signIn('credentials', {
      email: validated.email,
      password: validated.password,
      redirect: false,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Error de validación:', error.errors)
      throw new Error('Datos inválidos')
    }
    console.error('Error en registro:', error)
    throw error
  }

  redirect('/')
}