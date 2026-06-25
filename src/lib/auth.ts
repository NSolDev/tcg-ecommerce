// src/lib/auth.ts
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './db/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Esquema de validación para login
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    newUser: '/register',
    error: '/login', // Redirigir a login en caso de error
  },
  providers: [
    // Proveedor de GitHub
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),

    // Proveedor de Google
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Proveedor de Credenciales (Email/Contraseña)
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Validar las credenciales con Zod
          const validated = loginSchema.parse(credentials)

          // Buscar usuario en la base de datos
          const user = await prisma.user.findUnique({
            where: { email: validated.email },
          })

          // Si no existe el usuario o no tiene contraseña (login con OAuth)
          if (!user || !user.password) {
            return null
          }

          // Verificar la contraseña
          const passwordMatch = await bcrypt.compare(
            validated.password,
            user.password
          )

          if (!passwordMatch) {
            return null
          }

          // Devolver el usuario (sin la contraseña)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('Error en authorize:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    // Añadir el rol del usuario al token JWT
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    // Añadir el rol a la sesión
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
})

// Definir tipos para extender la sesión
declare module 'next-auth' {
  interface User {
    role?: string
  }
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role?: string
      image?: string | null
    }
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    role?: string
    id?: string
  }
}