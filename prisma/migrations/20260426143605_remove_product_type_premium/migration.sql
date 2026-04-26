-- Drop PREMIUM from ProductType enum.
-- Postgres doesn't support removing enum values directly, so we recreate the type.
-- Existing PREMIUM rows must be migrated to another value before this runs (handled manually).

ALTER TYPE "ProductType" RENAME TO "ProductType_old";

CREATE TYPE "ProductType" AS ENUM ('SELF', 'HAND', 'PICKUP', 'VISIT');

ALTER TABLE "products"
  ALTER COLUMN "type" TYPE "ProductType"
  USING "type"::text::"ProductType";

DROP TYPE "ProductType_old";
