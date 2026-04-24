"use client";

import Image from "next/image";
import Link from "next/link";
import { AppBar } from "@/components/app/AppBar";
import { useCart } from "@/lib/cart";

export function CartClient() {
  const { items, setQty, remove, subtotal } = useCart();
  const shippingFee = subtotal >= 50000 || subtotal === 0 ? 0 : 3000;
  const total = subtotal + shippingFee;

  return (
    <div className="min-h-screen bg-paper pb-[140px]">
      <AppBar title="장바구니" />

      {items.length === 0 ? (
        <div className="px-5 pt-20 text-center">
          <div className="text-[14px] text-slate mb-4">
            장바구니가 비어있어요.
          </div>
          <Link
            href="/app/market"
            className="inline-flex h-11 items-center px-5 rounded-full bg-ink text-white text-[13px] font-bold"
          >
            마켓 둘러보기
          </Link>
        </div>
      ) : (
        <>
          <section className="px-5 pt-4 flex flex-col gap-3">
            {items.map((it) => (
              <div
                key={it.productId}
                className="bg-white rounded-[14px] border border-fog p-3 flex gap-3"
              >
                <div className="relative w-[80px] h-[80px] rounded-[10px] overflow-hidden shrink-0 bg-cloud">
                  <Image
                    src={it.imageUrl}
                    alt={it.name}
                    fill
                    className="object-cover"
                    sizes="90px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold truncate">
                    {it.name}
                  </div>
                  <div className="text-[14px] font-extrabold ww-num mt-1">
                    {it.price.toLocaleString("ko-KR")}원
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => setQty(it.productId, it.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-fog text-[14px]"
                    >
                      −
                    </button>
                    <span className="ww-num min-w-[28px] text-center font-semibold">
                      {it.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(it.productId, it.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-fog text-[14px]"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(it.productId)}
                      className="ml-auto text-[12px] text-slate hover:text-danger"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="px-5 pt-5">
            <div className="bg-white rounded-[14px] border border-fog p-5">
              <Row l="상품 합계" v={subtotal} />
              <Row
                l="배송비"
                v={shippingFee}
                sub={
                  shippingFee === 0 && subtotal > 0
                    ? "5만원 이상 무료배송"
                    : shippingFee === 0
                      ? undefined
                      : `5만원 이상 무료배송`
                }
              />
              <div className="h-px bg-fog my-3" />
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-bold">총 결제금액</span>
                <span className="ww-disp text-[22px] ww-num">
                  {total.toLocaleString("ko-KR")}원
                </span>
              </div>
            </div>
          </section>

          <div className="fixed left-0 right-0 bottom-0 flex justify-center">
            <div className="w-full max-w-app bg-white border-t border-fog px-4 py-3">
              <Link
                href="/app/market/checkout"
                className="h-14 w-full rounded-full bg-accent text-white font-bold text-[15px] flex items-center justify-center shadow-ww-blue"
              >
                {total.toLocaleString("ko-KR")}원 주문하기
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Row({
  l,
  v,
  sub,
}: {
  l: string;
  v: number;
  sub?: string;
}) {
  return (
    <div className="flex items-center justify-between py-[6px]">
      <div className="text-[13px] text-slate">
        {l}
        {sub && <span className="text-[11px] text-success ml-2">{sub}</span>}
      </div>
      <div className="text-[14px] font-semibold ww-num">
        {v === 0 && l === "배송비"
          ? "무료"
          : `${v.toLocaleString("ko-KR")}원`}
      </div>
    </div>
  );
}
