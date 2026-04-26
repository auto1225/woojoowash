-- Drop PENDING from ReservationStatus + change default to CONFIRMED.
-- Postgres 는 enum value 직접 삭제 불가 → 새 type 으로 교체.

-- 안전망: 혹시 남아있을 PENDING 행을 CONFIRMED 로 변환
UPDATE "reservations" SET "status" = 'CONFIRMED' WHERE "status" = 'PENDING';

ALTER TABLE "reservations" ALTER COLUMN "status" DROP DEFAULT;
ALTER TYPE "ReservationStatus" RENAME TO "ReservationStatus_old";
CREATE TYPE "ReservationStatus" AS ENUM ('CONFIRMED', 'DONE', 'CANCELED');
ALTER TABLE "reservations"
  ALTER COLUMN "status" TYPE "ReservationStatus"
  USING "status"::text::"ReservationStatus";
ALTER TABLE "reservations" ALTER COLUMN "status" SET DEFAULT 'CONFIRMED';
DROP TYPE "ReservationStatus_old";
