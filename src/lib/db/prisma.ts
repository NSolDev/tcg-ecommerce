// src/lib/db/prisma.ts

import { PrismaClient } from '@prisma/client'

// Declaración global para evitar múltiples instancias en desarrollo
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Exportamos un tipo para usar en otros archivos
export type PrismaClientType = PrismaClient