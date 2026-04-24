import { AdminShell } from "@/components/admin/AdminShell";
import { requireOwnedStore, requireOwner } from "@/lib/admin";
import { db } from "@/lib/db";
import { CalendarReservations } from "./CalendarReservations";

export const dynamic = "force-dynamic";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function parseMonth(raw: string | undefined): string {
  if (raw && /^\d{4}-\d{2}$/.test(raw)) return raw;
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
}

function monthRange(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return {
    start: new Date(y, m - 1, 1, 0, 0, 0, 0),
    end: new Date(y, m, 1, 0, 0, 0, 0),
  };
}

export default async function ReservationsAdminPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { month?: string };
}) {
  const user = await requireOwner();
  const store = await requireOwnedStore(params.id);
  const month = parseMonth(searchParams.month);
  const { start, end } = monthRange(month);

  const reservations = await db.reservation.findMany({
    where: { storeId: store.id, startAt: { gte: start, lt: end } },
    orderBy: { startAt: "asc" },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      product: { select: { title: true } },
      car: { select: { brand: true, model: true, plate: true } },
    },
  });

  const rows = reservations.map((r) => ({
    id: r.id,
    startAt: r.startAt.toISOString(),
    durationMin: r.durationMin,
    price: r.price,
    status: r.status,
    productTitle: r.product.title,
    customerName: r.user.name || r.user.email || "고객",
    customerPhone: r.user.phone,
    carLabel: r.car ? `${r.car.brand} ${r.car.model} · ${r.car.plate}` : null,
  }));

  return (
    <AdminShell
      userName={user.name || user.email}
      storeName={store.name}
      storeId={store.id}
    >
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="ww-disp text-[24px] tracking-[-0.02em]">예약 관리</h1>
        <div className="text-[11px] text-slate">
          날짜를 선택하면 아래에 예약 목록이 나옵니다.
        </div>
      </div>

      <CalendarReservations
        storeId={store.id}
        month={month}
        reservations={rows}
      />
    </AdminShell>
  );
}
