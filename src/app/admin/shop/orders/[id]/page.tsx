import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { requireAdmin } from "@/lib/console";
import { db } from "@/lib/db";
import { OrderStatusControl } from "./OrderStatusControl";
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

export default async function AdminOrderDetail({
  params,
}: {
  params: { id: string };
}) {
  const me = await requireAdmin();
  const order = await db.order.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      items: true,
      shipment: true,
    },
  });
  if (!order) return notFound();

  return (
    <AdminConsoleShell
      title={`주문 #${order.id.slice(-8).toUpperCase()}`}
      subtitle={`${STATUS_LABEL[order.status]} · ${format(order.createdAt, "yyyy-MM-dd HH:mm", { locale: ko })}`}
      userName={me.name || me.email}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <section className="bg-white border border-fog rounded-[20px] p-6">
            <div className="text-[15px] font-extrabold mb-4">주문 상품</div>
            <ul className="flex flex-col gap-4">
              {order.items.map((it) => (
                <li key={it.id} className="flex items-center gap-3">
                  {it.productImage && (
                    <div className="relative w-[64px] h-[64px] rounded-[10px] overflow-hidden shrink-0 bg-cloud">
                      <Image
                        src={it.productImage}
                        alt={it.productName}
                        fill
                        className="object-cover"
                        sizes="70px"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="text-[14px] font-bold">
                      {it.productName}
                    </div>
                    <div className="text-[12px] text-slate ww-num mt-1">
                      {it.price.toLocaleString("ko-KR")}원 × {it.quantity}
                    </div>
                  </div>
                  <div className="text-[14px] ww-num font-semibold">
                    {(it.price * it.quantity).toLocaleString("ko-KR")}원
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white border border-fog rounded-[20px] p-6">
            <div className="text-[15px] font-extrabold mb-4">배송지</div>
            <div className="text-[14px] font-bold">{order.recipientName}</div>
            <div className="text-[12px] text-slate ww-num mt-1">
              {order.phone}
            </div>
            <div className="text-[13px] mt-2">
              ({order.postalCode}) {order.addr1} {order.addr2 ?? ""}
            </div>
            {order.memo && (
              <div className="text-[12px] text-slate mt-3 pt-3 border-t border-fog">
                요청사항: {order.memo}
              </div>
            )}
          </section>

          <section className="bg-white border border-fog rounded-[20px] p-6">
            <div className="text-[15px] font-extrabold mb-4">결제 정보</div>
            <Row l="상품 합계" v={order.subtotal} />
            <Row l="배송비" v={order.shippingFee} />
            {order.discount > 0 && <Row l="할인" v={-order.discount} />}
            <div className="h-px bg-fog my-3" />
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-bold">총 결제금액</span>
              <span className="ww-disp text-[22px] ww-num">
                {order.total.toLocaleString("ko-KR")}원
              </span>
            </div>
            <div className="text-[11px] text-slate mt-3">
              결제 수단:{" "}
              {order.paymentMethod === "card" ? "신용/체크카드" : "간편결제"}
              {order.paidAt &&
                ` · ${format(order.paidAt, "yyyy-MM-dd HH:mm")} 결제`}
            </div>
          </section>

          <section className="bg-white border border-fog rounded-[20px] p-6">
            <div className="text-[15px] font-extrabold mb-3">고객</div>
            <div className="text-[13px]">
              {order.user.name || "(이름 없음)"}
              <span className="text-slate ml-2">{order.user.email}</span>
            </div>
            {order.user.phone && (
              <div className="text-[12px] text-slate ww-num mt-1">
                {order.user.phone}
              </div>
            )}
          </section>
        </div>

        <aside className="flex flex-col gap-6">
          <OrderStatusControl
            orderId={order.id}
            currentStatus={order.status}
            shipment={{
              carrier: order.shipment?.carrier ?? "",
              trackingNumber: order.shipment?.trackingNumber ?? "",
              shippedAt: order.shipment?.shippedAt?.toISOString() ?? null,
              deliveredAt: order.shipment?.deliveredAt?.toISOString() ?? null,
            }}
          />
        </aside>
      </div>
    </AdminConsoleShell>
  );
}

function Row({ l, v }: { l: string; v: number }) {
  const negative = v < 0;
  return (
    <div className="flex items-center justify-between py-[6px] text-[13px]">
      <span className="text-slate">{l}</span>
      <span
        className={`ww-num font-semibold ${negative ? "text-danger" : ""}`}
      >
        {negative ? "- " : ""}
        {Math.abs(v).toLocaleString("ko-KR")}원
      </span>
    </div>
  );
}
