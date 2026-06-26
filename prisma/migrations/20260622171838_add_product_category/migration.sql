-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('CARD', 'PACK', 'BOX');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "category" "ProductCategory" NOT NULL DEFAULT 'CARD';

-- RenameForeignKey
ALTER TABLE "audit_logs" RENAME CONSTRAINT "audit_log_product_fkey" TO "audit_logs_entityId_fkey";
