import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default async function AnalyticsPage() {
  const me = await requireAdmin();

  const since = new Date();
  since.setDate(since.getDate() - 29);
  since.setHours(0, 0, 0, 0);

  const [events, signupsRaw, reservationsRaw] = await Promise.all([
    db.siteEvent.findMany({
      where: { kind: "page_view", createdAt: { gte: since } },
      select: { createdAt: true, path: true },
    }),
    db.user.findMany({
      where: { role: "USER", createdAt: { gte: since } },
      select: { createdAt: true },
    }),
    db.reservation.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    }),
  ]);

  // 30일 버킷 초기화
  const days: Array<{
    key: string;
    label: string;
    pv: number;
    signups: number;
    reservations: number;
  }> = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    days.push({
      key: dayKey(d),
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      pv: 0,
      signups: 0,
      reservations: 0,
    });
  }
  const byKey = new Map(days.map((d) => [d.key, d]));
  for (const e of events) {
    const b = byKey.get(dayKey(e.createdAt));
    if (b) b.pv += 1;
  }
  for (const u of signupsRaw) {
    const b = byKey.get(dayKey(u.createdAt));
    if (b) b.signups += 1;
  }
  for (const r of reservationsRaw) {
    const b = byKey.get(dayKey(r.createdAt));
    if (b) b.reservations += 1;
  }

  const totalPV = days.reduce((s, d) => s + d.pv, 0);
  const totalSignups = days.reduce((s, d) => s + d.signups, 0);
  const totalReservations = days.reduce((s, d) => s + d.reservations, 0);

  // 경로별 PV
  const byPath = new Map<string, number>();
  for (const e of events) {
    if (!e.path) continue;
    byPath.set(e.path, (byPath.get(e.path) ?? 0) + 1);
  }
  const topPaths = Array.from(byPath.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const maxPathPV = Math.max(1, ...topPaths.map(([, v]) => v));

  const maxPv = Math.max(1, ...days.map((d) => d.pv));

  return (
    <AdminConsoleShell
      title="방문자 통계"
      subtitle="최근 30일 홈페이지·웹앱 페이지 뷰와 전환 지표"
      userName={me.name || me.email}
    >
      <section className="grid gap-3 md:grid-cols-3 mb-8">
        <Stat label="30일 페이지뷰" value={totalPV.toLocaleString("ko-KR")} />
        <Stat label="30일 신규 가입" value={totalSignups.toLocaleString("ko-KR")} />
        <Stat
          label="30일 예약"
          value={totalReservations.toLocaleString("ko-KR")}
        />
      </section>

      <section className="mb-8">
        <div className="text-[15px] font-extrabold mb-3">일별 페이지뷰</div>
        <div className="bg-white border border-fog rounded-[16px] p-5">
          <div className="flex items-end gap-1 h-[180px]">
            {days.map((d) => {
              const h = (d.pv / maxPv) * 100;
              return (
                <div
                  key={d.key}
                  className="flex-1 group relative h-full flex flex-col justify-end"
                  title={`${d.label} · PV ${d.pv} · 가입 ${d.signups} · 예약 ${d.reservations}`}
                >
                  <div
                    className="w-full bg-accent/70 hover:bg-accent rounded-t-[3px]"
                    style={{ height: `${h}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-slate ww-num">
            <span>{days[0].label}</span>
            <span>{days[Math.floor(days.length / 2)].label}</span>
            <span>{days[days.length - 1].label}</span>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-fog rounded-[16px] p-5">
          <div className="text-[15px] font-extrabold mb-4">가입·예약 추이</div>
          <div className="flex flex-col gap-3">
            {days.slice(-7).map((d) => (
              <div key={d.key} className="flex items-center gap-3 text-[12px]">
                <span className="w-10 text-slate ww-num">{d.label}</span>
                <div className="flex-1 flex gap-2 items-center">
                  <span className="text-success font-bold ww-num w-8 text-right">
                    {d.signups}
                  </span>
                  <div className="h-2 flex-1 bg-success/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success"
                      style={{
                        width: `${Math.min(100, (d.signups / Math.max(1, totalSignups)) * 1000)}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex-1 flex gap-2 items-center">
                  <span className="text-accent font-bold ww-num w-8 text-right">
                    {d.reservations}
                  </span>
                  <div className="h-2 flex-1 bg-brand-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent"
                      style={{
                        width: `${Math.min(100, (d.reservations / Math.max(1, totalReservations)) * 1000)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-[11px] text-slate">
            <span className="flex items-center gap-1">
              <span className="w-[8px] h-[8px] rounded-full bg-success" /> 가입
            </span>
            <span className="flex items-center gap-1">
              <span className="w-[8px] h-[8px] rounded-full bg-accent" /> 예약
            </span>
          </div>
        </div>

        <div className="bg-white border border-fog rounded-[16px] p-5">
          <div className="text-[15px] font-extrabold mb-4">경로별 페이지뷰</div>
          {topPaths.length === 0 ? (
            <div className="py-8 text-center text-slate text-[13px]">
              기록된 이벤트가 없어요.
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {topPaths.map(([p, v]) => (
                <li key={p} className="flex items-center gap-3 text-[13px]">
                  <span className="w-[120px] truncate font-semibold">{p}</span>
                  <div className="flex-1 h-2 bg-cloud rounded-full overflow-hidden">
                    <div
                      className="h-full bg-ink"
                      style={{ width: `${(v / maxPathPV) * 100}%` }}
                    />
                  </div>
                  <span className="ww-num text-slate w-12 text-right">
                    {v.toLocaleString("ko-KR")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </AdminConsoleShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-fog rounded-[16px] p-5">
      <div className="text-[11px] text-slate font-semibold mb-2">{label}</div>
      <div className="ww-disp text-[26px] ww-num">{value}</div>
    </div>
  );
}
