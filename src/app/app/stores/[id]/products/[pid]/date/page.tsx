import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { normalizeHours } from "@/app/partner/stores/[id]/schedule/types";
import { DatePickerClient } from "./DatePickerClient";

export const dynamic = "force-dynamic";

export default async function DatePickerPage({
  params,
}: {
  params: { id: string; pid: string };
}) {
  const [store, product] = await Promise.all([
    db.store.findUnique({ where: { id: params.id } }),
    db.product.findFirst({
      where: { id: params.pid, storeId: params.id },
      select: { durationMin: true },
    }),
  ]);
  if (!store || !product) return notFound();

  const hours = normalizeHours(store.hours);

  // 향후 14일 휴무일 + 예약(취소 제외) 동시 조회
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const horizon = new Date(todayStart);
  horizon.setDate(horizon.getDate() + 14);

  const [closedRows, reservationRows] = await Promise.all([
    db.storeClosedDay.findMany({
      where: {
        storeId: store.id,
        date: { gte: todayStart, lt: horizon },
      },
      select: { date: true },
    }),
    db.reservation.findMany({
      where: {
        storeId: store.id,
        startAt: { gte: todayStart, lt: horizon },
        status: { not: "CANCELED" },
      },
      select: { startAt: true, durationMin: true },
    }),
  ]);

  const closedDates = closedRows.map((r) => {
    const d = r.date;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const reservations = reservationRows.map((r) => ({
    startAt: r.startAt.toISOString(),
    durationMin: r.durationMin,
  }));

  return (
    <DatePickerClient
      hours={hours}
      closedDates={closedDates}
      reservations={reservations}
      productDuration={product.durationMin}
    />
  );
}
