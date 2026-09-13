# CLAUDE.md — TCG Store

Portfolio/educational Next.js e-commerce (Pokémon-style TCG). Goal: **look and behave like real e-commerce**, not be production-grade. Simulated is fine (payments, email, shipping); the UX must feel real. **Deploy target is Docker, not Vercel — never suggest Vercel.**

## Commands

```bash
npm run dev          # dev server
npm run build        # prod build
npm run type-check   # tsc --noEmit  ← run before declaring TS work done
npm run lint         # eslint
npm run format       # prettier --write
npm test             # vitest (unit)
npm run test:e2e     # playwright
npm run db:push      # prisma db push
npm run db:seed      # seed (admin@tcgstore.com/Admin123!, test@tcgstore.com/Test123!)
npm run db:studio    # prisma studio
```

## Stack

Next.js 14 App Router · React 18 · TS · Prisma + PostgreSQL · Auth.js v5 (JWT) · Stripe (test) · Zustand · Zod · Tailwind + shadcn/ui (Radix).

## Architecture conventions

- **Reads** → Server Components calling functions in `src/lib/actions/*.actions.ts`.
- **Mutations** → Server Actions (`'use server'`). Do NOT add REST route handlers for mutations that a Server Action can do. (The one exception, Stripe webhook, stays a route.)
- **Every mutation validates input with Zod and re-checks auth** (`await auth()`, role gate) — never trust middleware alone.
- **Cart** = Zustand + localStorage (`src/store/cartStore.ts`), client-only by design. `src/store/uiStore.ts` is dead — don't use it.
- **Products are relational**: `Product` (base) + 1:1 `Card`/`Pack`/`Box` + `ProductImage`. `Product.type` is the enum `CARD|PACK|BOX`. Card-specific fields (rarity, condition, set) live on `Card`, **not** on `Product`.
- Styling is per-route `.css` files + Tailwind + shadcn. Match the existing file's paradigm; don't introduce a new one.
- Prisma singleton: `src/lib/db/prisma.ts`. Use it, don't `new PrismaClient()`.
- Code/comments/UI copy are in **Spanish** — keep new copy consistent.

## Known-broken (see scratchpad `AUDIT_ROADMAP.md` for full detail; fix in this order)

1. **Admin product create/edit** (`admin.actions.ts`) passes card fields to `prisma.product.create` — those columns don't exist on `Product`. Must build the relational graph.
2. **Checkout**: `PaymentForm` POSTs to `/api/checkout*` (empty dirs, 404). The real `createOrder` action is orphaned. Wire it directly.
3. **Payment**: hybrid — real Stripe test mode when keys present, realistic fake fallback when absent.
4. **`createOrder`** not transactional; strip emoji `console.log`s.
5. **Wishlist** reads `WishlistItem` but nothing writes it — needs a toggle action.

Don't "fix" a symptom in one caller — these route through shared actions; fix at the source.

## What NOT to build

Real payment capture, real email/shipping/ERP, Cloudinary/`@vercel/blob` (installed but unused — safe to remove), Kubernetes, microservices, heavy CI/CD, observability. Simulate instead.

## Skills to use

- **`ponytail`** — active by default; laziest working solution, no speculative abstractions.
- **`code-review`** — run on the diff before wrapping a feature (`/code-review`).
- **`security-review`** — before touching auth, Stripe, or the webhook.
- The **`run`** skill to verify a change in the actual app, not just tests.

## Hooks

Configured in `.claude/settings.local.json`:

- **PostToolUse (Edit/Write)** → Prettier-formats the edited `.ts/.tsx/.css` file, so Claude's edits match the repo style immediately.

Commit-time `npm run lint` + `npm run format` is already enforced by Husky `pre-commit` (don't duplicate it as a hook). If you want a stricter gate, add `npm run type-check` to `.husky/pre-push`.

## Definition of done

`npm run type-check` clean + `npm run lint` clean. Add/adjust a Vitest or Playwright test for non-trivial logic. Report failures honestly.
