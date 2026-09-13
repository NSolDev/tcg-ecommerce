#!/bin/sh
set -e

echo "→ Applying database migrations..."
npx prisma migrate deploy

# Seed only when the catalog is empty, so restarts never duplicate data.
echo "→ Checking whether the database needs seeding..."
PRODUCT_COUNT=$(node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.product.count()
  .then((c) => { console.log(c); return p.\$disconnect(); })
  .catch(() => { console.log('0'); return p.\$disconnect(); });
")

if [ "$PRODUCT_COUNT" = "0" ]; then
  echo "→ Empty database detected — seeding..."
  npm run db:seed
else
  echo "→ Database already has $PRODUCT_COUNT product(s) — skipping seed."
fi

echo "→ Starting Next.js..."
exec "$@"
