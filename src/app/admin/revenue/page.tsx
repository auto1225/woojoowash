import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type MonthBucket = { key: string; label: string; count: number; revenue: number };

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default async function RevenuePage() {
  const me = await requireAdmin();

  const since = new Date();
  since.setMonth(since.getMonth() - 5);
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  // 최근 6개월 매출
  const reservations = await db.reservation.findMany({
    where: {
      status: { in: ["CONFIRMED", "DONE"] },
      startAt: { gte: since },
    },
    select: { startAt: true, price: true, status: true, storeId: true },
  });

  // 월별 집계
  const byMonth = new Map<string, MonthBucket>();
  for (let i = 0; i < 6; i++) {
    const d = new Date(since);
    d.setMonth(d.getMonth() + i);
    const key = monthKey(d);
    byMonth.set(key, {
      key,
      label: key.replace("-", "."),
      count: 0,
      revenue: 0,
    });
  }
  for (const r of reservations) {
    const key = monthKey(r.startAt);
    const b = byMonth.get(key);
    if (!b) continue;
    b.count += 1;
    if (r.status === "DONE") b.revenue += r.price;
  }
  const buckets = Array.from(byMonth.values());
  const maxRevenue = Math.max(1, ...buckets.map((b) => b.revenue));

  // 매장별 매출 TOP
  const byStore = new Map<string, number>();
  for (const r of reservations) {
    if (r.status !== "DONE") continue;
    byStore.set(r.storeId, (byStore.get(r.storeId) ?? 0) + r.price);
  }
  const topStoreIds = Array.from(byStore.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id]) => id);
  const topStores = await db.store.findMany({
    where: { id: { in: topStoreIds } },
    select: { id: true, name: true, address: true },
  });
  const topRanked = topStoreIds.map((id, i) => {
    const s = topStores.find((x) => x.id === id);
    return {
      rank: i + 1,
      id,
      name: s?.name ?? "(이름 없음)",
      address: s?.address ?? "",
      revenue: byStore.get(id) ?? 0,
    };
  });

  const totalRevenue = buckets.reduce((s, b) => s + b.revenue, 0);
  const totalCount = buckets.reduce((s, b) => s + b.count, 0);

  return (
    <AdminConsoleShell active="revenue" userName={me.name || me.email}>
      <div className="mb-8">
        <div className="text-[12px] font-bold text-accent tracking-[0.15em] mb-2">
          REVENUE
        </div>
        <h1 className="ww-disp text-[32px] tracking-[-0.02em]">매출 대시보드</h1>
      </div>

      <section className="grid gap-3 md:grid-cols-3 mb-10">
        <div className="bg-white border border-fog rounded-[16px] p-5">
          <div className="text-[11px] text-slate font-semibold mb-2">
            6개월 누적 매출
          </div>
          <div className="ww-disp text-[28px] ww-num">
            {totalRevenue.toLocaleString("ko-KR")}원
          </div>
        </div>
        <div className="bg-white border border-fog rounded-[16px] p-5">
          <div className="text-[11px] text-slate font-semibold mb-2">
            6개월 예약 건수
          </div>
          <div className="ww-disp text-[28px] ww-num">
            {totalCount.toLocaleString("ko-KR")}
          </div>
        </div>
        <div className="bg-white border border-fog rounded-[16px] p-5">
          <div className="text-[11px] text-slate font-semibold mb-2">
            평균 객단가
          </div>
          <div className="ww-disp text-[28px] ww-num">
            {(totalCount > 0
              ? Math.round(totalRevenue / totalCount)
              : 0
            ).toLocaleString("ko-KR")}원
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-[16px] font-extrabold tracking-[-0.3px] mb-4">
          월별 매출
        </h2>
        <div className="bg-white border border-fog rounded-[20px] p-6">
          <div className="grid grid-cols-6 gap-3 h-[220px] items-end">
            {buckets.map((b) => {
              const h = b.revenue > 0 ? (b.revenue / maxRevenue) * 100 : 4;
              return (
                <div
                  key={b.key}
                  className="flex flex-col items-center justify-end gap-2 h-full"
                >
                  <div className="text-[11px] text-slate ww-num">
                    {b.revenue.toLocaleString("ko-KR")}원
                  </div>
                  <div className="w-full relative flex flex-col justify-end h-full">
                    <div
                      className="w-full bg-accent rounded-t-[8px] transition-all"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                  <div className="text-[12px] font-semibold text-slate ww-num">
                    {b.label}
                  </div>
                  <div className="text-[11px] text-slate ww-num">
                    {b.count}건
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-[16px] font-extrabold tracking-[-0.3px] mb-4">
          매장별 매출 TOP {topRanked.length}
        </h2>
        <div className="bg-white border border-fog rounded-[20px] overflow-hidden">
          {topRanked.length === 0 ? (
            <div className="py-14 text-center text-slate text-[14px]">
              완료된 예약이 없어요.
            </div>
          ) : (
            <table className="w-full text-[14px]">
              <thead className="bg-paper">
                <tr className="text-left text-slate">
                  <Th>순위</Th>
                  <Th>매장</Th>
                  <Th>6개월 매출</Th>
                </tr>
              </thead>
              <tbody>
                {topRanked.map((x) => (
                  <tr key={x.id} className="border-t border-fog">
                    <Td>
                      <span className="ww-disp ww-num">{x.rank}</span>
                    </Td>
                    <Td>
                      <div className="font-bold">{x.name}</div>
                      <div className="text-[12px] text-slate">{x.address}</div>
                    </Td>
                    <Td>
                      <span className="ww-num font-semibold">
                        {x.revenue.toLocaleString("ko-KR")}원
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </AdminConsoleShell>
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
