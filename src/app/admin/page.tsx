import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function startOfMonth(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export default async function AdminDashboardPage() {
  const user = await requireAdmin();

  const [
    userCount,
    storeCount,
    reservationCount,
    openInquiries,
    monthRevenue,
    monthSignups,
    recentInquiries,
    recentReservations,
  ] = await Promise.all([
    db.user.count({ where: { role: "USER" } }),
    db.store.count(),
    db.reservation.count(),
    db.partnerInquiry.count({ where: { status: "NEW" } }),
    db.reservation.aggregate({
      where: { status: "DONE", startAt: { gte: startOfMonth() } },
      _sum: { price: true },
    }),
    db.user.count({
      where: { role: "USER", createdAt: { gte: startOfMonth() } },
    }),
    db.partnerInquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.reservation.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        store: { select: { name: true } },
        user: { select: { name: true, email: true } },
        product: { select: { title: true } },
      },
    }),
  ]);

  return (
    <AdminConsoleShell  userName={user.name || user.email}>
      <div className="mb-8">
        <div className="text-[12px] font-bold text-accent tracking-[0.15em] mb-2">
          DASHBOARD
        </div>
        <h1 className="ww-disp text-[32px] tracking-[-0.02em]">
          서비스 운영 현황
        </h1>
      </div>

      <section className="grid gap-3 md:grid-cols-3 lg:grid-cols-6 mb-10">
        <Stat label="누적 회원" value={userCount.toLocaleString("ko-KR")} />
        <Stat label="이번 달 가입" value={monthSignups.toLocaleString("ko-KR")} />
        <Stat label="입점 매장" value={storeCount.toLocaleString("ko-KR")} />
        <Stat label="누적 예약" value={reservationCount.toLocaleString("ko-KR")} />
        <Stat
          label="이번 달 매출"
          value={`${(monthRevenue._sum.price ?? 0).toLocaleString("ko-KR")}원`}
        />
        <Stat
          label="새 제휴 문의"
          value={openInquiries.toLocaleString("ko-KR")}
          alert={openInquiries > 0}
        />
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="최근 제휴 문의" href="/admin/inquiries" empty="문의가 없어요.">
          <ul className="divide-y divide-fog">
            {recentInquiries.map((i) => (
              <li key={i.id} className="py-3 flex items-center gap-3">
                <StatusDot status={i.status} />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold truncate">
                    {i.storeName}
                  </div>
                  <div className="text-[12px] text-slate truncate">
                    {i.contactName} · {i.phone}
                  </div>
                </div>
                <div className="text-[11px] text-slate ww-num">
                  {format(i.createdAt, "M/d", { locale: ko })}
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card
          title="최근 예약"
          href="/admin/revenue"
          empty="예약이 없어요."
        >
          <ul className="divide-y divide-fog">
            {recentReservations.map((r) => (
              <li key={r.id} className="py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold truncate">
                    {r.store.name}
                  </div>
                  <div className="text-[12px] text-slate truncate">
                    {r.product.title} · {r.user.name || r.user.email}
                  </div>
                </div>
                <div className="text-[12px] ww-num font-semibold">
                  {r.price.toLocaleString("ko-KR")}원
                </div>
                <div className="text-[11px] text-slate ww-num">
                  {format(r.startAt, "M/d", { locale: ko })}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AdminConsoleShell>
  );
}

function Stat({
  label,
  value,
  alert,
}: {
  label: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`bg-white border rounded-[16px] p-5 ${
        alert ? "border-accent" : "border-fog"
      }`}
    >
      <div className="text-[11px] text-slate font-semibold mb-2">{label}</div>
      <div className={`ww-disp text-[24px] ww-num ${alert ? "text-accent" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function Card({
  title,
  href,
  children,
  empty,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
  empty?: string;
}) {
  const isEmpty =
    Array.isArray((children as any)?.props?.children) &&
    (children as any).props.children.length === 0;
  return (
    <div className="bg-white border border-fog rounded-[20px] p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[16px] font-extrabold tracking-[-0.3px]">
          {title}
        </div>
        <Link
          href={href}
          className="text-[12px] text-slate font-semibold hover:text-ink"
        >
          전체
        </Link>
      </div>
      {isEmpty && empty ? (
        <div className="py-10 text-center text-slate text-[13px]">{empty}</div>
      ) : (
        children
      )}
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === "NEW"
      ? "bg-accent"
      : status === "CONTACTED"
        ? "bg-warning"
        : status === "APPROVED"
          ? "bg-success"
          : "bg-slate";
  return <span className={`w-[8px] h-[8px] rounded-full ${color}`} />;
}
