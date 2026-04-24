-- CreateTable
CREATE TABLE "market_products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "tag" TEXT,
    "category" TEXT,
    "description" TEXT,
    "stock" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "market_products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "market_products_order_idx" ON "market_products"("order");

-- CreateIndex
CREATE INDEX "market_products_active_idx" ON "market_products"("active");
