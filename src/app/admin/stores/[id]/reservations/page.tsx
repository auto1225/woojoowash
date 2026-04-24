import { revalidatePath } from "next/cache";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireOwnedStore, requireOwner } from "@/lib/admin";
import { db } from "@/lib/db";
import type { ReservationStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<ReservationStatus, string> = {
  PENDING: "결제 대기",
  CONFIRMED: "예약 확정",
  DONE: "완료",
  CANCELED: "취소",
};

async function updateStatus(
  storeId: string,
  reservationId: string,
  formData: FormData,
) {
  "use server";
  await requireOwnedStore(storeId);
  const status = String(formData.get("status") ?? "") as ReservationStatus;
  if (!STATUS_LABEL[status]) return;
  await db.reservation.update({
    where: { id: reservationId },
    data: { status },
  });
  revalidatePath(`/admin/stores/${storeId}/reservations`);
  revalidatePath(`/admin/stores/${storeId}`);
}

export default async function ReservationsAdminPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { filter?: string };
}) {
  const user = await requireOwner();
  const store = await requireOwnedStore(params.id);

  const filter = searchParams.filter;
  const whereStatus: ReservationStatus[] =
    filter === "confirmed"
      ? ["CONFIRMED"]
      : filter === "done"
        ? ["DONE"]
        : filter === "canceled"
          ? ["CANCELED"]
          : ["PENDING", "CONFIRMED", "DONE", "CANCELED"];

  const reservations = await db.reservation.findMany({
    where: { storeId: store.id, status: { in: whereStatus } },
    orderBy: { startAt: "desc" },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      product: { select: { title: true } },
      car: { select: { brand: true, model: true, plate: true } },
    },
  });

  return (
    <AdminShell
      userName={user.name || user.email}
      storeName={store.name}
      storeId={store.id}
    >
      <h1 className="ww-disp text-[24px] tracking-[-0.02em] mb-6">
        예약 관리
      </h1>

      <div className="flex gap-2 mb-5">
        {[
          { k: "", l: "전체" },
          { k: "confirmed", l: "확정" },
          { k: "done", l: "완료" },
          { k: "canceled", l: "취소" },
        ].map((t) => {
          const active = (filter ?? "") === t.k;
          return (
            <a
              key={t.l}
              href={`?${t.k ? `filter=${t.k}` : ""}`}
              className={`text-[13px] font-semibold px-4 py-[7px] rounded-full border ${
                active
                  ? "bg-ink text-white border-ink"
                  : "bg-white border-fog text-graphite"
              }`}
            >
              {t.l}
            </a>
          );
        })}
      </div>

      <div className="bg-white border border-fog rounded-[20px] overflow-hidden">
        {reservations.length === 0 ? (
          <div className="py-16 text-center text-slate text-[14px]">
            예약이 없어요.
          </div>
        ) : (
          <table className="w-full text-[14px]">
            <thead className="bg-paper">
              <tr className="text-left text-slate">
                <Th>일시</Th>
                <Th>고객 / 차량</Th>
                <Th>상품</Th>
                <Th>금액</Th>
                <Th>상태</Th>
                <Th className="text-right">처리</Th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} className="border-t border-fog align-top">
                  <Td>
                    <div className="ww-num font-bold">
                      {format(r.startAt, "M/d (EEE)", { locale: ko })}
                    </div>
                    <div className="ww-num text-[12px] text-slate mt-[2px]">
                      {format(r.startAt, "HH:mm")} · {r.durationMin}분
                    </div>
                  </Td>
                  <Td>
                    <div className="font-bold">
                      {r.user.name || r.user.email}
                    </div>
                    <div className="text-[12px] text-slate ww-num">
                      {r.user.phone ?? "전화 없음"}
                    </div>
                    {r.car && (
                      <div className="text-[11px] text-slate mt-1">
                        {r.car.brand} {r.car.model} · {r.car.plate}
                      </div>
                    )}
                  </Td>
                  <Td>{r.product.title}</Td>
                  <Td>
                    <span className="ww-num font-semibold">
                      {r.price.toLocaleString("ko-KR")}원
                    </span>
                  </Td>
                  <Td>
                    <span
                      className={`text-[11px] font-bold px-2 py-[3px] rounded-full ${
                        r.status === "CONFIRMED"
                          ? "bg-accent/10 text-accent-deep"
                          : r.status === "DONE"
                            ? "bg-success/10 text-success"
                            : r.status === "CANCELED"
                              ? "bg-danger/10 text-danger"
                              : "bg-fog text-slate"
                      }`}
                    >
                      {STATUS_LABEL[r.status]}
                    </span>
                  </Td>
                  <Td className="text-right">
                    <form
                      action={updateStatus.bind(null, store.id, r.id)}
                      className="inline-flex gap-2 items-center"
                    >
                      <select
                        name="status"
                        defaultValue={r.status}
                        className="h-9 px-2 bg-paper border border-fog rounded-[8px] text-[12px]"
                      >
                        <option value="PENDING">결제 대기</option>
                        <option value="CONFIRMED">예약 확정</option>
                        <option value="DONE">완료</option>
                        <option value="CANCELED">취소</option>
                      </select>
                      <button
                        type="submit"
                        className="h-9 px-3 rounded-full bg-ink text-white text-[12px] font-bold"
                      >
                        변경
                      </button>
                    </form>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`text-[11px] font-semibold uppercase tracking-wider py-3 px-4 ${className ?? ""}`}
    >
      {children}
    </th>
  );
}
function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`py-4 px-4 ${className ?? ""}`}>{children}</td>;
}
