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

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-fog text-slate",
  PAID: "bg-accent/10 text-accent-deep",
  PREPARING: "bg-warning/10 text-warning",
  SHIPPED: "bg-accent text-white",
  DELIVERED: "bg-success/10 text-success",
  CANCELED: "bg-danger/10 text-danger",
  REFUNDED: "bg-ash/20 text-slate",
};

export default async function OrdersPage() {
  if (!(await getFlag("shopEnabled"))) return notFound();
  const session = await auth();
  if (!session?.user) redirect("/app/login?callbackUrl=/app/market/orders");

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: { take: 1 },
      _count: { select: { items: true } },
    },
  });

  return (
    <div className="min-h-screen bg-paper pb-[100px]">
      <AppBar title="주문 내역" />
      <section className="px-5 pt-4">
        {orders.length === 0 ? (
          <div className="pt-20 text-center">
            <div className="text-[14px] text-slate mb-4">
              주문 내역이 없어요.
            </div>
            <Link
              href="/app/market"
              className="inline-flex h-11 items-center px-5 rounded-full bg-ink text-white text-[13px] font-bold"
            >
              마켓 둘러보기
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((o) => {
              const first = o.items[0];
              const extra = o._count.items - 1;
              return (
                <Link
                  key={o.id}
                  href={`/app/market/orders/${o.id}`}
                  className="bg-white rounded-[14px] border border-fog p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[11px] font-bold px-2 py-[3px] rounded-full ${STATUS_COLOR[o.status]}`}
                    >
                      {STATUS_LABEL[o.status]}
                    </span>
                    <span className="text-[11px] text-slate ww-num">
                      {format(o.createdAt, "yyyy-MM-dd", { locale: ko })}
                    </span>
                  </div>
                  {first && (
                    <div className="flex gap-3">
                      <div className="relative w-[64px] h-[64px] rounded-[10px] overflow-hidden shrink-0 bg-cloud">
                        {first.productImage && (
                          <Image
                            src={first.productImage}
                            alt={first.productName}
                            fill
                            className="object-cover"
                            sizes="70px"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-bold truncate">
                          {first.productName}
                          {extra > 0 && (
                            <span className="text-slate font-medium">
                              {" "}
                              외 {extra}건
                            </span>
                          )}
                        </div>
                        <div className="text-[13px] font-extrabold ww-num mt-2">
                          {o.total.toLocaleString("ko-KR")}원
                        </div>
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
