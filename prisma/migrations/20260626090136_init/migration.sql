/*
  Warnings:

  - You are about to drop the column `attack` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `condition` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `evolution` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `hp` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `rarity` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `setId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `weakness` on the `products` table. All the data in the column will be lost.
  - Changed the type of `type` on the `products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('CARD', 'PACK', 'BOX');

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_setId_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "attack",
DROP COLUMN "category",
DROP COLUMN "condition",
DROP COLUMN "evolution",
DROP COLUMN "hp",
DROP COLUMN "imageUrl",
DROP COLUMN "rarity",
DROP COLUMN "setId",
DROP COLUMN "weakness",
DROP COLUMN "type",
ADD COLUMN     "type" "ProductType" NOT NULL;

-- DropEnum
DROP TYPE "ProductCategory";

-- CreateTable
CREATE TABLE "cards" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "setId" TEXT NOT NULL,
    "rarity" "ProductRarity" NOT NULL,
    "condition" "ProductCondition" NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'Español',

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packs" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "setId" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'Español',
    "cardsPerPack" INTEGER,

    CONSTRAINT "packs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boxes" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "setId" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'Español',
    "packsPerBox" INTEGER,

    CONSTRAINT "boxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cards_productId_key" ON "cards"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "packs_productId_key" ON "packs"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "boxes_productId_key" ON "boxes"("productId");

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_setId_fkey" FOREIGN KEY ("setId") REFERENCES "sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packs" ADD CONSTRAINT "packs_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packs" ADD CONSTRAINT "packs_setId_fkey" FOREIGN KEY ("setId") REFERENCES "sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boxes" ADD CONSTRAINT "boxes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boxes" ADD CONSTRAINT "boxes_setId_fkey" FOREIGN KEY ("setId") REFERENCES "sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
