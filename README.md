# TCG Store

Tienda online (e-commerce) de cartas coleccionables estilo Pokémon TCG, construida como
**proyecto de portafolio/educativo** para demostrar desarrollo full‑stack moderno con
**Next.js 14 (App Router)**, **TypeScript**, **Prisma/PostgreSQL** y **Auth.js v5**.

El objetivo es que se vea y se comporte como una tienda real desde el punto de vista del
usuario, manteniendo un pago **simulado** y un despliegue sencillo con **Docker**. No
pretende ser una plataforma de comercio de nivel bancario ni procesar dinero real.

---

## Características principales

- **Catálogo** de productos con búsqueda, filtros (colección, categoría, rareza, tipo, precio) y paginación.
- **Modelo de producto relacional**: `Product` base + relaciones 1:1 `Card` / `Pack` / `Box` + `ProductImage`.
- **Detalle de producto** con productos relacionados y datos estructurados (JSON‑LD) para SEO.
- **Carrito** persistente en el cliente (Zustand + `localStorage`) con panel lateral (drawer).
- **Checkout** completo con validación de envío y **pago simulado** (o Stripe en modo test si se configuran claves).
- **Pedidos**: creación transaccional, historial del usuario y detalle de pedido.
- **Favoritos (wishlist)** por usuario.
- **Cuenta**: perfil editable.
- **Panel de administración**: gestión de productos (CRUD relacional), stock, pedidos, usuarios, colecciones y registro de auditoría.
- **Autenticación** con email/contraseña y OAuth **opcional** (Google/GitHub).
- Diseño responsive y animaciones (framer-motion / GSAP / Embla).

## Stack tecnológico

| Área             | Tecnología                                                 |
| ---------------- | ---------------------------------------------------------- |
| Framework        | Next.js 14 (App Router, Server Components, Server Actions) |
| Lenguaje         | TypeScript                                                 |
| UI               | React 18, Tailwind CSS, shadcn/ui (Radix), lucide-react    |
| Estado (cliente) | Zustand                                                    |
| Validación       | Zod                                                        |
| Base de datos    | PostgreSQL + Prisma ORM                                    |
| Autenticación    | Auth.js v5 (NextAuth), sesión JWT, bcryptjs                |
| Pagos            | Simulado; Stripe (modo test) opcional                      |
| Testing          | Vitest (unit), Playwright (E2E)                            |
| Despliegue       | Docker + Docker Compose                                    |

## Arquitectura

```
Navegador
   │  (HTML/CSS/JS, cookies de sesión httpOnly)
   ▼
Next.js (contenedor web)
   ├─ Server Components  → lecturas de datos (funciones en src/lib/actions/*.actions.ts)
   ├─ Server Actions     → mutaciones (crear pedido, wishlist, perfil, admin) con Zod + auth()
   ├─ Middleware         → protección de rutas + cabeceras de seguridad/CSP
   └─ Prisma
        ▼
PostgreSQL (contenedor db, solo accesible por la red interna de Docker)
```

- **Lecturas** → Server Components que llaman a funciones en `src/lib/actions`.
- **Mutaciones** → Server Actions (`'use server'`), validadas con Zod y con verificación de sesión/rol en el servidor.
- **Carrito** → Zustand + `localStorage` (solo cliente); el servidor **recalcula precio y stock** al crear el pedido.
- **Pago simulado** → la lógica de "pago correcto" la determina el servidor; el cliente no puede marcar un pedido como pagado.

## Autenticación

- Auth.js v5 con estrategia de **sesión JWT** y cookies `httpOnly`, `SameSite=lax` (`Secure` en producción).
- **Credenciales** (email/contraseña) con hash **bcrypt**.
- **OAuth opcional**: Google y GitHub solo se activan si se configuran sus variables de entorno.
- Rol de usuario (`USER` / `ADMIN`) incluido en el token y verificado **en el servidor** en cada acción de administración (no se confía en el estado del cliente).
- El middleware protege `/account`, `/orders`, `/cart`, `/checkout`, `/wishlist` y `/admin`.

## Base de datos

Modelo relacional con Prisma (PostgreSQL):

- **Usuarios/Auth**: `User`, `Account`, `Session`.
- **Productos**: `Product` (base) + `Card` / `Pack` / `Box` (1:1) + `ProductImage`; `Set` (colecciones).
- **Comercio**: `Cart`/`CartItem`, `Order`/`OrderItem`, `Address`, `Wishlist`/`WishlistItem`.
- **Auditoría**: `AuditLog`.

## Flujo e-commerce

1. Explorar catálogo → detalle de producto.
2. Añadir al carrito (drawer con imagen, cantidad y subtotal).
3. Checkout: datos de envío + datos de tarjeta (modo test/simulado).
4. `createOrder` (Server Action): valida sesión, revalida precio y stock en servidor, crea el pedido y descuenta stock **dentro de una transacción**.
5. Pago: PaymentIntent real de Stripe en **modo test** si hay claves; si no, éxito **simulado**. En caso de fallo se revierte el stock y se cancela el pedido.
6. Página de éxito → el carrito se vacía → el pedido aparece en el historial.

## Carrito

Cliente (Zustand + `localStorage`). Se conserva al navegar y al recargar. El servidor nunca
confía en el precio del cliente: al crear el pedido se recalcula desde la base de datos.

## Pago simulado

El proyecto usa un flujo de pago **simulado** por diseño. Si se define `STRIPE_SECRET_KEY`
(clave de **test**), el checkout crea y confirma un PaymentIntent real de Stripe en modo test;
en caso contrario, el pago se simula y el pedido pasa a `COMPLETED`. **Nunca** se procesa dinero real.

## Panel de administración

`/admin` (solo rol `ADMIN`): dashboard, alta/edición/activación de productos (construyendo el
grafo relacional Card/Pack/Box + imagen), gestión de stock, pedidos, usuarios, colecciones y
registro de auditoría.

## Seguridad

Medidas realmente implementadas en este repositorio:

- Autorización **en el servidor** en cada Server Action (verificación de sesión y de rol `ADMIN`).
- Comprobación de propiedad en recursos con ID (p. ej. `/orders/[id]` solo lo ve su dueño).
- Validación **server-side** con Zod en todas las mutaciones; precio y stock autoritativos en el servidor.
- Contraseñas con **bcrypt**; los hashes nunca se envían al cliente (consultas con `select`).
- Acceso a datos solo con Prisma parametrizado (sin SQL crudo) → sin inyección SQL.
- JSON‑LD serializado de forma segura (escape de `<`) para evitar fuga del contexto `<script>`.
- Cabeceras de seguridad y **CSP** en el middleware (sin `unsafe-eval` en producción; ver limitaciones).
- **Rate limiting** a nivel de aplicación en login y registro (en memoria, por proceso).
- Registro de **auditoría** de acciones administrativas.
- Secretos fuera del control de versiones (`.env` ignorado); imagen Docker sin secretos; contenedor **no-root**.

> Limitación honesta: el rate limiting es en memoria y por proceso (no distribuido) y **no**
> protege frente a DDoS de red — eso corresponde a un proxy inverso/CDN por delante. La CSP
> mantiene `unsafe-inline` (scripts inline de Next y estilos inline de las animaciones) porque
> no se usa una arquitectura de nonce por petición; sí se elimina `unsafe-eval` en producción.

## Puesta en marcha con Docker

Requisitos: Docker + Docker Compose.

```bash
cp .env.example .env
# Edita .env y define al menos POSTGRES_PASSWORD y NEXTAUTH_SECRET
#   NEXTAUTH_SECRET:  openssl rand -base64 32

docker compose up -d --build
```

- App: http://localhost:3000
- La base de datos **no** publica puerto en el host (solo red interna de Docker).
- Al arrancar, el contenedor aplica migraciones (`prisma migrate deploy`) y hace **seed solo si la base de datos está vacía** (idempotente entre reinicios).

Usuarios de demostración creados por el seed:

- Admin: `admin@tcgstore.com`
- Usuario: `test@tcgstore.com`

(Las contraseñas están en `prisma/seed.ts`; cámbialas para cualquier despliegue real.)

Acceso opcional a la base de datos en local (solo desarrollo), publicando el puerto 5432 en `127.0.0.1`:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

## Variables de entorno

Ver `.env.example`. Resumen:

**Requeridas**

- `DATABASE_URL` — conexión PostgreSQL (con Docker se construye a partir de las `POSTGRES_*`).
- `NEXTAUTH_URL` — URL base de la app.
- `NEXTAUTH_SECRET` — secreto de firma de sesión (**obligatorio**; la app no arranca sin él).
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` — al usar Docker Compose.

**Opcionales**

- `GITHUB_ID` / `GITHUB_SECRET`, `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — OAuth (si se omiten, solo hay login por credenciales).
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` — Stripe modo test (si se omiten, el pago se simula).

## Desarrollo local (sin Docker)

```bash
npm install
cp .env.example .env   # configura DATABASE_URL a tu PostgreSQL y NEXTAUTH_SECRET
npx prisma generate
npm run db:push        # o migraciones
npm run db:seed
npm run dev
```

## Migraciones y seed

- Migraciones: `prisma/migrations/` (en Docker se aplican con `prisma migrate deploy`).
- Seed: `npm run db:seed` (o automático al arrancar Docker con la base de datos vacía).

## Testing

```bash
npm run type-check   # TypeScript
npm run lint         # ESLint
npm test             # Vitest (unit)
npm run test:e2e     # Playwright (E2E; requiere la app en marcha, p. ej. Docker)
```

Los E2E cubren el recorrido crítico: login (válido/ inválido), rutas protegidas, catálogo,
carrito y checkout con pago simulado hasta el historial de pedidos.

## Build de producción

```bash
npm run build && npm run start   # local
# o, recomendado:
docker compose up -d --build
```

## Estructura del proyecto

```
src/
  app/
    (auth)/          # login, registro
    (shop)/          # catálogo, producto, carrito, checkout, cuenta, pedidos, wishlist
    admin/           # panel de administración
    api/             # NextAuth + webhook de Stripe
  components/        # ui (shadcn), product, cart, checkout, admin, seo, shared, account
  lib/
    actions/         # Server Actions (product, order, admin, auth, wishlist, account, set)
    db/              # cliente Prisma (singleton)
    rate-limit.ts    # limitador en memoria
    utils/ ...
  middleware.ts      # protección de rutas + cabeceras de seguridad/CSP
  store/             # Zustand (carrito)
prisma/              # schema, migraciones, seed
Dockerfile, docker-compose.yml, docker-compose.dev.yml, docker/entrypoint.sh
```

## Limitaciones conocidas

- **Pago simulado** (sin cobros reales); Stripe solo en modo test.
- **OAuth** requiere configurar credenciales; por defecto solo login por email/contraseña.
- **Email y envíos** no están integrados (no se envían correos ni hay logística real).
- **Rate limiting** en memoria (no distribuido) y sin protección DDoS de red.
- Edición de colecciones desde el admin: soportado alta/borrado seguro; la edición es limitada.

## Mejoras futuras

- Migración a una versión mayor de Next.js para cerrar los avisos de seguridad restantes.
- CSP basada en nonce para eliminar `unsafe-inline`.
- Sincronización opcional del carrito con la base de datos.
- Cobertura de tests ampliada (creación/edición de productos en admin).

## Licencia

MIT. Proyecto educativo/portafolio; sin garantías.
