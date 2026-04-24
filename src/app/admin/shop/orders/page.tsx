import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";
import type { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "결제 대기",
  PAID: "결제 완료",
  PREPARING: "준비중",
  SHIPPED: "배송중",
  DELIVERED: "배송 완료",
  CANCELED: "취소",
  REFUNDED: "환불",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  PENDING: "bg-fog text-slate",
  PAID: "bg-accent/10 text-accent-deep",
  PREPARING: "bg-warning/10 text-warning",
  SHIPPED: "bg-accent text-white",
  DELIVERED: "bg-success/10 text-success",
  CANCELED: "bg-danger/10 text-danger",
  REFUNDED: "bg-ash/20 text-slate",
};

export default async function OrdersAdminPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string };
}) {
  const me = await requireAdmin();
  const filter = searchParams.status;
  const q = (searchParams.q ?? "").trim();
  const validStatus =
    filter &&
    [
      "PENDING",
      "PAID",
      "PREPARING",
      "SHIPPED",
      "DELIVERED",
      "CANCELED",
      "REFUNDED",
    ].includes(filter);

  const orders = await db.order.findMany({
    where: {
      AND: [
        validStatus ? { status: filter as OrderStatus } : {},
        q
          ? {
              OR: [
                { recipientName: { contains: q, mode: "insensitive" } },
                { phone: { contains: q } },
                { id: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { name: true, email: true } },
      items: { take: 1 },
      _count: { select: { items: true } },
    },
  });

  const counts = await db.order.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count._all]));

  return (
    <AdminConsoleShell
      title="주문 관리"
      subtitle="마켓 상품 주문 전체를 조회·상태 변경합니다"
      userName={me.name || me.email}
    >
      <div className="flex flex-wrap gap-2 mb-5 items-center">
        {[
          { k: "", l: "전체" },
          { k: "PAID", l: "결제 완료" },
          { k: "PREPARING", l: "준비중" },
          { k: "SHIPPED", l: "배송중" },
          { k: "DELIVERED", l: "배송 완료" },
          { k: "CANCELED", l: "취소" },
        ].map((t) => {
          const active = (filter ?? "") === t.k;
          const count = t.k ? countMap[t.k as OrderStatus] ?? 0 : undefined;
          return (
            <a
              key={t.l}
              href={t.k ? `?status=${t.k}` : "?"}
              className={`text-[13px] font-semibold px-4 py-[7px] rounded-full border flex items-center gap-2 ${
                active
                  ? "bg-ink text-white border-ink"
                  : "bg-white border-fog text-graphite"
              }`}
            >
              {t.l}
              {typeof count === "number" && count > 0 && (
                <span className={`text-[10px] font-bold ww-num ${active ? "text-white" : "text-slate"}`}>
                  {count}
                </span>
              )}
            </a>
          );
        })}
        <form className="ml-auto">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="주문번호·받는사람·전화 검색"
            className="h-9 px-4 bg-white border border-fog rounded-full text-[13px] w-[260px]"
          />
        </form>
      </div>

      <div className="bg-white border border-fog rounded-[20px] overflow-hidden">
        {orders.length === 0 ? (
          <div className="py-16 text-center text-slate text-[14px]">
            조회된 주문이 없어요.
          </div>
        ) : (
          <table className="w-full text-[14px]">
            <thead className="bg-paper">
              <tr className="text-left text-slate">
                <Th>주문</Th>
                <Th>고객</Th>
                <Th>상품</Th>
                <Th>금액</Th>
                <Th>상태</Th>
                <Th>주문일</Th>
                <Th className="text-right">관리</Th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const first = o.items[0];
                const extra = o._count.items - 1;
                return (
                  <tr key={o.id} className="border-t border-fog align-top">
                    <Td>
                      <div className="font-bold ww-num text-[12px]">
                        #{o.id.slice(-8).toUpperCase()}
                      </div>
                      <div className="text-[11px] text-slate mt-[2px]">
                        {o.paymentMethod === "card" ? "카드" : "간편결제"}
                      </div>
                    </Td>
                    <Td>
                      <div className="text-[13px] font-bold">
                        {o.recipientName}
                      </div>
                      <div className="text-[11px] text-slate ww-num">
                        {o.phone}
                      </div>
                      {o.user && (
                        <div className="text-[10px] text-slate mt-1">
                          {o.user.email}
                        </div>
                      )}
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        {first?.productImage && (
                          <div className="relative w-[44px] h-[44px] rounded-[8px] overflow-hidden shrink-0 bg-cloud">
                            <Image
                              src={first.productImage}
                              alt={first.productName}
                              fill
                              className="object-cover"
                              sizes="50px"
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-[13px] truncate max-w-[220px]">
                            {first?.productName}
                          </div>
                          {extra > 0 && (
                            <div className="text-[11px] text-slate">
                              외 {extra}건
                            </div>
                          )}
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <span className="ww-num font-semibold">
                        {o.total.toLocaleString("ko-KR")}원
                      </span>
                    </Td>
                    <Td>
                      <span
                        className={`text-[11px] font-bold px-2 py-[3px] rounded-full ${STATUS_COLOR[o.status]}`}
                      >
                        {STATUS_LABEL[o.status]}
                      </span>
                    </Td>
                    <Td>
                      <span className="text-[12px] text-slate ww-num">
                        {format(o.createdAt, "M/d HH:mm", { locale: ko })}
                      </span>
                    </Td>
                    <Td className="text-right">
                      <Link
                        href={`/admin/shop/orders/${o.id}`}
                        className="text-[12px] font-semibold text-accent hover:underline"
                      >
                        상세
                      </Link>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </AdminConsoleShell>
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
