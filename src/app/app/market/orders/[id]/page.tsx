import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AppBar } from "@/components/app/AppBar";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getFlag } from "@/lib/settings";

export const dynamic = "force-dynamic";

const STATUS_LABEL = {
  PENDING: "결제 대기",
  PAID: "결제 완료",
  PREPARING: "상품 준비중",
  SHIPPED: "배송중",
  DELIVERED: "배송 완료",
  CANCELED: "취소",
  REFUNDED: "환불",
} as const;

const STEPS: Array<{ k: keyof typeof STATUS_LABEL; l: string }> = [
  { k: "PAID", l: "결제 완료" },
  { k: "PREPARING", l: "준비중" },
  { k: "SHIPPED", l: "배송중" },
  { k: "DELIVERED", l: "배송 완료" },
];

function stepIndex(status: keyof typeof STATUS_LABEL): number {
  const i = STEPS.findIndex((s) => s.k === status);
  return i < 0 ? 0 : i;
}

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  if (!(await getFlag("shopEnabled"))) return notFound();
  const session = await auth();
  if (!session?.user) redirect("/app/login");

  const order = await db.order.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: {
      items: true,
      shipment: true,
    },
  });
  if (!order) return notFound();

  const idx = stepIndex(order.status);
  const canceled = order.status === "CANCELED" || order.status === "REFUNDED";

  return (
    <div className="min-h-screen bg-paper pb-[100px]">
      <AppBar title="주문 상세" />

      <section className="px-5 pt-4">
        <div className="bg-white rounded-[14px] border border-fog p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[11px] text-slate ww-num">
              주문번호 {order.id.slice(-10).toUpperCase()}
            </div>
            <span className="text-[12px] text-slate ww-num">
              {format(order.createdAt, "yyyy-MM-dd HH:mm", { locale: ko })}
            </span>
          </div>

          {canceled ? (
            <div className="text-[13px] font-bold text-danger">
              {STATUS_LABEL[order.status]}된 주문입니다.
            </div>
          ) : (
            <div className="flex items-center gap-1">
              {STEPS.map((s, i) => (
                <div key={s.k} className="flex-1 flex flex-col items-center">
                  <div className="flex items-center w-full">
                    {i > 0 && (
                      <div
                        className={`flex-1 h-[2px] ${
                          i <= idx ? "bg-accent" : "bg-fog"
                        }`}
                      />
                    )}
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        i <= idx
                          ? "bg-accent text-white"
                          : "bg-white border border-fog text-slate"
                      }`}
                    >
                      {i + 1}
                    </span>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-[2px] ${
                          i < idx ? "bg-accent" : "bg-fog"
                        }`}
                      />
                    )}
                  </div>
                  <div
                    className={`text-[11px] font-semibold mt-1 ${
                      i <= idx ? "text-ink" : "text-slate"
                    }`}
                  >
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          )}

          {order.shipment?.carrier && order.shipment.trackingNumber && (
            <div className="mt-5 pt-4 border-t border-fog">
              <div className="text-[11px] text-slate font-semibold mb-1">
                배송 정보
              </div>
              <div className="text-[13px] font-bold">
                {order.shipment.carrier} ·{" "}
                <span className="ww-num">{order.shipment.trackingNumber}</span>
              </div>
              {order.shipment.shippedAt && (
                <div className="text-[11px] text-slate mt-1 ww-num">
                  출고 {format(order.shipment.shippedAt, "yyyy-MM-dd HH:mm")}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="px-5 pt-4">
        <div className="bg-white rounded-[14px] border border-fog p-5">
          <div className="text-[13px] font-bold mb-3">주문 상품</div>
          <div className="flex flex-col gap-3">
            {order.items.map((it) => (
              <div key={it.id} className="flex gap-3">
                <div className="relative w-[64px] h-[64px] rounded-[10px] overflow-hidden shrink-0 bg-cloud">
                  {it.productImage && (
                    <Image
                      src={it.productImage}
                      alt={it.productName}
                      fill
                      className="object-cover"
                      sizes="70px"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold truncate">
                    {it.productName}
                  </div>
                  <div className="text-[12px] text-slate ww-num mt-1">
                    {it.price.toLocaleString("ko-KR")}원 × {it.quantity}
                  </div>
                  <div className="text-[13px] font-extrabold ww-num mt-1">
                    {(it.price * it.quantity).toLocaleString("ko-KR")}원
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pt-4">
        <div className="bg-white rounded-[14px] border border-fog p-5">
          <div className="text-[13px] font-bold mb-3">배송지</div>
          <div className="text-[14px] font-bold">{order.recipientName}</div>
          <div className="text-[12px] text-slate ww-num mt-1">{order.phone}</div>
          <div className="text-[13px] mt-2">
            ({order.postalCode}) {order.addr1} {order.addr2 ?? ""}
          </div>
          {order.memo && (
            <div className="text-[12px] text-slate mt-3 pt-3 border-t border-fog">
              요청사항: {order.memo}
            </div>
          )}
        </div>
      </section>

      <section className="px-5 pt-4">
        <div className="bg-white rounded-[14px] border border-fog p-5">
          <div className="text-[13px] font-bold mb-3">결제 정보</div>
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
            결제 수단: {order.paymentMethod === "card" ? "신용/체크카드" : "간편결제"}
          </div>
        </div>
      </section>

      <div className="px-5 pt-4 flex gap-2">
        <Link
          href="/app/market"
          className="flex-1 h-12 rounded-full bg-cloud text-ink font-bold text-[13px] flex items-center justify-center"
        >
          마켓 홈
        </Link>
        <Link
          href="/app/market/orders"
          className="flex-1 h-12 rounded-full bg-ink text-white font-bold text-[13px] flex items-center justify-center"
        >
          주문 내역
        </Link>
      </div>
    </div>
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
