import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireOwnedStore, requireOwner } from "@/lib/admin";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const STATUS_LABEL = {
  PENDING: "결제 대기",
  CONFIRMED: "예약 확정",
  DONE: "완료",
  CANCELED: "취소",
} as const;

export default async function StoreDashboardPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireOwner();
  const store = await requireOwnedStore(params.id);

  const [productCount, today, upcoming, revenueThisMonth, recent] =
    await Promise.all([
      db.product.count({ where: { storeId: store.id } }),
      db.reservation.count({
        where: {
          storeId: store.id,
          startAt: { gte: startOfDay(), lt: endOfDay() },
          status: { in: ["CONFIRMED", "DONE"] },
        },
      }),
      db.reservation.count({
        where: { storeId: store.id, status: "CONFIRMED" },
      }),
      db.reservation.aggregate({
        where: {
          storeId: store.id,
          status: "DONE",
          startAt: { gte: startOfMonth() },
        },
        _sum: { price: true },
      }),
      db.reservation.findMany({
        where: { storeId: store.id },
        orderBy: { startAt: "desc" },
        take: 5,
        include: {
          user: { select: { name: true, email: true } },
          product: { select: { title: true } },
        },
      }),
    ]);

  return (
    <AdminShell
      userName={user.name || user.email}
      storeName={store.name}
      storeId={store.id}
    >
      <div className="mb-8">
        <h1 className="ww-disp text-[28px] tracking-[-0.02em]">
          {store.name}
        </h1>
        <p className="text-slate text-[13px] mt-1">{store.address}</p>
      </div>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <StatCard label="오늘 예약" value={today} />
        <StatCard label="예정 예약" value={upcoming} />
        <StatCard label="등록 상품" value={productCount} />
        <StatCard
          label="이번 달 매출"
          value={revenueThisMonth._sum.price ?? 0}
          money
        />
      </section>

      <section className="mb-10">
        <div className="flex items-baseline justify-between mb-4">
          <div className="text-[18px] font-extrabold tracking-[-0.3px]">
            최근 예약
          </div>
          <Link
            href={`/admin/stores/${store.id}/reservations`}
            className="text-[12px] text-slate font-semibold hover:text-ink"
          >
            전체 보기
          </Link>
        </div>
        <div className="bg-white border border-fog rounded-[16px] overflow-hidden">
          {recent.length === 0 ? (
            <div className="py-14 text-center text-slate text-[14px]">
              아직 예약이 없어요.
            </div>
          ) : (
            <table className="w-full text-[14px]">
              <thead className="bg-paper">
                <tr className="text-left text-slate">
                  <Th>일시</Th>
                  <Th>상품</Th>
                  <Th>고객</Th>
                  <Th>금액</Th>
                  <Th>상태</Th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-fog"
                  >
                    <Td>
                      <span className="ww-num">
                        {format(r.startAt, "M/d (EEE) HH:mm", { locale: ko })}
                      </span>
                    </Td>
                    <Td>{r.product.title}</Td>
                    <Td>{r.user.name || r.user.email}</Td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <Tile
          href={`/admin/stores/${store.id}/profile`}
          title="매장 정보·홍보 문구"
          desc="이름·주소·커버 이미지·홍보 문구를 수정하면 앱에 즉시 반영됩니다."
        />
        <Tile
          href={`/admin/stores/${store.id}/products`}
          title="상품 관리"
          desc="상품을 추가하면 앱에서 고객이 예약 가능해져요."
        />
        <Tile
          href={`/admin/stores/${store.id}/schedule`}
          title="영업시간 · 휴무일"
          desc="휴무일 등록하면 날짜 선택 화면에서 자동 차단됩니다."
        />
        <Tile
          href={`/admin/stores/${store.id}/reservations`}
          title="예약 목록"
          desc="확정 / 완료 / 취소 상태를 여기서 변경해요."
        />
      </section>
    </AdminShell>
  );
}

function StatCard({
  label,
  value,
  money,
}: {
  label: string;
  value: number;
  money?: boolean;
}) {
  return (
    <div className="bg-white border border-fog rounded-[16px] p-5">
      <div className="text-[11px] text-slate font-semibold mb-2">{label}</div>
      <div className="ww-disp text-[24px] ww-num">
        {money ? `${value.toLocaleString("ko-KR")}원` : value}
      </div>
    </div>
  );
}

function Tile({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="block bg-white border border-fog rounded-[16px] p-6 hover:shadow-ww-card transition"
    >
      <div className="text-[15px] font-extrabold mb-1">{title}</div>
      <div className="text-[12px] text-slate leading-[1.6]">{desc}</div>
    </Link>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-[11px] font-semibold uppercase tracking-wider py-3 px-4">
      {children}
    </th>
  );
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="py-3 px-4">{children}</td>;
}

function startOfDay(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
function endOfDay(): Date {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}
function startOfMonth(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
