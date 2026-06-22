# TCG Store - E-commerce de Cartas Coleccionables

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.14-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Stripe](https://img.shields.io/badge/Stripe-6772E5?logo=stripe)](https://stripe.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel)](https://vercel.com/)

## Descripción

TCG Store es una aplicación web de e-commerce profesional para la venta de cartas coleccionables estilo Pokémon. Desarrollada con el stack tecnológico más moderno, está diseñada para ser escalable, mantenible y lista para producción.

### Características Principales

-  **Catálogo completo** con paginación y carga progresiva
-  **Búsqueda avanzada** y filtros por colección, rareza, tipo y precio
-  **Carrito de compras** persistente con Zustand
-  **Sistema de pagos** con Stripe en modo test
-  **Autenticación** con email/contraseña y OAuth (Google, GitHub)
-  **Panel de administración** con CRUD de productos
-  **Gestión de stock** y pedidos
-  **Lista de favoritos**
-  **Diseño responsive** completo

##  Stack Tecnológico

### Frontend
- **Framework:** Next.js 14 con App Router
- **Lenguaje:** TypeScript
- **UI:** Tailwind CSS + shadcn/ui
- **Estado:** Zustand (cliente)
- **Formularios:** React Hook Form + Zod

### Backend
- **Base de datos:** PostgreSQL
- **ORM:** Prisma
- **Autenticación:** Auth.js (NextAuth)
- **Pagos:** Stripe
- **Archivos:** Cloudinary / Vercel Blob

### Testing & Despliegue
- **Testing:** Vitest + React Testing Library + Playwright
- **Linting:** ESLint + Prettier
- **Despliegue:** Vercel

##  Estructura del Proyecto

```
tcg-ecommerce/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── (auth)/             # Rutas de autenticación
│   │   ├── (shop)/             # Rutas de la tienda
│   │   ├── admin/              # Panel de administración
│   │   └── api/                # API Routes
│   ├── components/             # Componentes reutilizables
│   │   ├── ui/                 # Componentes shadcn/ui
│   │   ├── product/            # Componentes de productos
│   │   ├── cart/               # Componentes del carrito
│   │   ├── checkout/           # Componentes del checkout
│   │   └── shared/             # Componentes compartidos
│   ├── lib/                    # Lógica de negocio
│   │   ├── actions/            # Server Actions
│   │   ├── db/                 # Cliente Prisma
│   │   └── validations/        # Esquemas Zod
│   ├── store/                  # Stores de Zustand
│   └── types/                  # Tipos TypeScript
├── prisma/
│   ├── schema.prisma           # Esquema de base de datos
│   └── seed.ts                 # Datos de prueba
└── public/                     # Archivos estáticos
```

##  Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/tcg-ecommerce.git
cd tcg-ecommerce
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```env
# Base de datos
DATABASE_URL="postgresql://postgres:password@localhost:5432/tcg_ecommerce"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secreto"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# OAuth (opcional)
GITHUB_ID=""
GITHUB_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 4. Configurar base de datos

```bash
# Ejecutar migraciones
npx prisma migrate dev --name init

# Generar cliente Prisma
npx prisma generate

# Poblar con datos de prueba
npx prisma db seed
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

##  Testing

```bash
# Tests unitarios
npm run test

# Tests E2E
npm run test:e2e

# Linting
npm run lint

# Type checking
npm run type-check
```

##  Despliegue en Vercel

### 1. Preparar el proyecto

```bash
# Verificar build
npm run build

# Verificar variables de entorno
# Asegúrate de tener todas las variables configuradas en Vercel
```

### 2. Desplegar con Vercel

1. Conecta tu repositorio de GitHub a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente con cada push

### 3. Variables de entorno necesarias

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | URL de PostgreSQL (Neon.tech, Supabase, etc.) |
| `NEXTAUTH_URL` | URL de producción |
| `NEXTAUTH_SECRET` | Secreto para JWT |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe |
| `STRIPE_WEBHOOK_SECRET` | Webhook secret de Stripe |

##  Usuarios de Prueba

| Email | Contraseña | Rol |
|-------|------------|-----|
| `admin@tcgstore.com` | `Admin123!` | Administrador |
| `test@tcgstore.com` | `Test123!` | Usuario |

##  Licencia

MIT

##  Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios.

---

**Desarrollado con ❤️ usando Next.js y TypeScript**
