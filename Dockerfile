# syntax=docker/dockerfile:1
# Multi-stage build for the TCG Store Next.js app.

FROM node:20-alpine AS base
WORKDIR /app
# openssl is required by Prisma; libc6-compat helps some native deps on Alpine.
RUN apk add --no-cache libc6-compat openssl

# ---- Dependencies (incl. dev: needed for build, Prisma CLI and the seed) ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- Build ----
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ---- Runtime ----
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# App + tooling required at runtime (Prisma CLI + ts-node seed run on startup).
# Files are owned by the non-root `node` user (uid 1000, present in the base image)
# so the runtime can write .next/cache without needing root.
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/.next ./.next
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/prisma ./prisma
COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/package-lock.json ./package-lock.json
COPY --from=build --chown=node:node /app/next.config.js ./next.config.js
COPY --from=build --chown=node:node /app/tsconfig.json ./tsconfig.json
COPY --from=build --chown=node:node /app/prisma.config.ts ./prisma.config.ts
COPY --chown=node:node docker/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Drop root: the Next.js process and the migrate/seed entrypoint run as `node`.
USER node

EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]
CMD ["npm", "run", "start"]
