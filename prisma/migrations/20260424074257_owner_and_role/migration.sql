-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'OWNER', 'ADMIN');

-- AlterTable
ALTER TABLE "stores" ADD COLUMN     "ownerId" TEXT,
ADD COLUMN     "promo" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "store_closed_days" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "reason" TEXT,

    CONSTRAINT "store_closed_days_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "store_closed_days_storeId_date_key" ON "store_closed_days"("storeId", "date");

-- CreateIndex
CREATE INDEX "stores_ownerId_idx" ON "stores"("ownerId");

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_closed_days" ADD CONSTRAINT "store_closed_days_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
