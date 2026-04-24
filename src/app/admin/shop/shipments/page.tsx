import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ShipmentsPage() {
  const me = await requireAdmin();

  const orders = await db.order.findMany({
    where: {
      status: { in: ["PAID", "PREPARING", "SHIPPED"] },
    },
    orderBy: [{ status: "asc" }, { createdAt: "asc" }],
    include: {
      shipment: true,
      items: { take: 1 },
      _count: { select: { items: true } },
    },
  });

  const groups = {
    PAID: orders.filter((o) => o.status === "PAID"),
    PREPARING: orders.filter((o) => o.status === "PREPARING"),
    SHIPPED: orders.filter((o) => o.status === "SHIPPED"),
  };

  return (
    <AdminConsoleShell
      title="배송 관리"
      subtitle="출고 대기 → 준비중 → 배송중 단계를 한눈에 관리"
      userName={me.name || me.email}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Column
          title="출고 대기"
          subtitle="결제가 완료되고 아직 운송장이 등록되지 않은 주문"
          orders={groups.PAID}
          tone="accent"
        />
        <Column
          title="준비중"
          subtitle="운송장 등록 완료, 출고 전"
          orders={groups.PREPARING}
          tone="warning"
        />
        <Column
          title="배송중"
          subtitle="출고되어 고객에게 배송되는 주문"
          orders={groups.SHIPPED}
          tone="ink"
        />
      </div>
    </AdminConsoleShell>
  );
}

function Column({
  title,
  subtitle,
  orders,
  tone,
}: {
  title: string;
  subtitle: string;
  orders: Array<{
    id: string;
    recipientName: string;
    phone: string;
    addr1: string;
    addr2: string | null;
    total: number;
    createdAt: Date;
    shipment: { carrier: string | null; trackingNumber: string | null } | null;
    items: Array<{ productName: string; productImage: string | null }>;
    _count: { items: number };
  }>;
  tone: "accent" | "warning" | "ink";
}) {
  const toneBar =
    tone === "accent"
      ? "bg-accent"
      : tone === "warning"
        ? "bg-warning"
        : "bg-ink";
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-[3px] h-5 rounded ${toneBar}`} />
        <h2 className="text-[15px] font-extrabold">{title}</h2>
        <span className="ml-auto text-[12px] text-slate ww-num">
          {orders.length}
        </span>
      </div>
      <div className="text-[11px] text-slate mb-3">{subtitle}</div>
      <div className="flex flex-col gap-3">
        {orders.length === 0 ? (
          <div className="bg-white border border-fog rounded-[14px] py-10 text-center text-slate text-[12px]">
            항목 없음
          </div>
        ) : (
          orders.map((o) => {
            const first = o.items[0];
            const extra = o._count.items - 1;
            return (
              <Link
                key={o.id}
                href={`/admin/shop/orders/${o.id}`}
                className="bg-white border border-fog rounded-[14px] p-4 hover:shadow-ww-card transition"
              >
                <div className="text-[11px] ww-num text-slate mb-1">
                  #{o.id.slice(-8).toUpperCase()} ·{" "}
                  {format(o.createdAt, "M/d", { locale: ko })}
                </div>
                <div className="text-[13px] font-bold">{o.recipientName}</div>
                <div className="text-[11px] text-slate ww-num">{o.phone}</div>
                <div className="text-[11px] text-slate mt-1 truncate">
                  {o.addr1} {o.addr2 ?? ""}
                </div>
                {first && (
                  <div className="text-[11px] mt-2 truncate">
                    {first.productName}
                    {extra > 0 && (
                      <span className="text-slate"> 외 {extra}건</span>
                    )}
                  </div>
                )}
                <div className="mt-2 pt-2 border-t border-fog flex items-center justify-between">
                  <span className="text-[11px] ww-num text-slate">
                    {o.shipment?.trackingNumber
                      ? `${o.shipment.carrier ?? ""} ${o.shipment.trackingNumber}`
                      : "운송장 미등록"}
                  </span>
                  <span className="text-[12px] ww-num font-bold">
                    {o.total.toLocaleString("ko-KR")}원
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
