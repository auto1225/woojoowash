"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type BookingOption = {
  id: string;
  label: string;
  price: number;
  priceMode?: "amount" | "free" | "ask";
  durationMin?: number;
};

export function BookingControls({
  storeId,
  productId,
  basePrice,
  startAtIso,
  options,
}: {
  storeId: string;
  productId: string;
  basePrice: number;
  startAtIso: string | null;
  options: BookingOption[];
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelectedIds((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // 협의(ask) 모드 옵션은 가격 합산에서 제외 — 추후 매장에서 별도 안내
  const optionsTotal = useMemo(() => {
    let sum = 0;
    for (const o of options) {
      if (!selectedIds.has(o.id)) continue;
      const mode = o.priceMode ?? "amount";
      if (mode === "amount" && o.price > 0) sum += o.price;
    }
    return sum;
  }, [options, selectedIds]);

  const totalPrice = basePrice + optionsTotal;

  const checkoutHref = useMemo(() => {
    const params = new URLSearchParams();
    params.set("store", storeId);
    params.set("product", productId);
    if (selectedIds.size > 0) {
      params.set("options", Array.from(selectedIds).join(","));
    }
    if (startAtIso) params.set("startAt", startAtIso);
    return `/app/booking/payment?${params.toString()}`;
  }, [storeId, productId, selectedIds, startAtIso]);

  return (
    <>
      {options.length > 0 && (
        <section className="px-5 mt-7">
          <div className="text-[14px] font-bold mb-3">추가 옵션</div>
          <div className="flex flex-col rounded-[14px] border border-fog overflow-hidden">
            {options.map((o, i) => {
              const mode = o.priceMode ?? "amount";
              const isFree = mode !== "ask" && (!o.price || o.price <= 0);
              const priceLabel =
                mode === "ask"
                  ? "가격 협의"
                  : isFree
                    ? "무료"
                    : `+${o.price.toLocaleString("ko-KR")}원`;
              const checked = selectedIds.has(o.id);
              return (
                <button
                  type="button"
                  key={o.id}
                  onClick={() => toggle(o.id)}
                  className={`flex items-center justify-between px-4 py-4 text-left transition ${
                    checked ? "bg-cloud" : "bg-white hover:bg-paper"
                  } ${i < options.length - 1 ? "border-b border-fog" : ""}`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span
                      className={`w-5 h-5 rounded border inline-flex items-center justify-center shrink-0 transition ${
                        checked
                          ? "bg-ink border-ink"
                          : "bg-white border-fog"
                      }`}
                    >
                      {checked && (
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12l5 5L20 7" />
                        </svg>
                      )}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[14px] truncate">{o.label}</div>
                      {o.durationMin && o.durationMin > 0 && (
                        <div className="text-[11px] text-slate ww-num mt-[2px]">
                          소요 +{o.durationMin}분
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className={`text-[13px] font-bold ww-num shrink-0 ml-3 ${
                      mode === "ask"
                        ? "text-slate"
                        : isFree
                          ? "text-success"
                          : ""
                    }`}
                  >
                    {priceLabel}
                  </div>
                </button>
              );
            })}
          </div>
          {selectedIds.size > 0 && (
            <div className="mt-2 text-[12px] text-slate">
              선택{" "}
              <span className="font-bold text-ink ww-num">
                {selectedIds.size}
              </span>
              건{optionsTotal > 0 && (
                <>
                  {" · "}
                  <span className="font-bold text-ink ww-num">
                    +{optionsTotal.toLocaleString("ko-KR")}원
                  </span>
                </>
              )}
            </div>
          )}
        </section>
      )}

      {/* 하단 결제 바 — 옵션 가격 반영된 총 결제금액 */}
      <div className="fixed left-0 right-0 bottom-0 z-30 flex justify-center">
        <div className="w-full max-w-app bg-white border-t border-fog px-4 py-3 flex gap-2">
          <div className="flex-1 h-14 rounded-full bg-cloud flex items-center justify-between px-5">
            <span className="text-[12px] text-slate">총 결제금액</span>
            <span className="ww-disp text-[18px] ww-num">
              {totalPrice.toLocaleString("ko-KR")}원
            </span>
          </div>
          <Link
            href={checkoutHref}
            className="h-14 px-7 rounded-full bg-ink text-white font-bold text-[15px] flex items-center hover:bg-accent-deep transition"
          >
            예약하기
          </Link>
        </div>
      </div>
    </>
  );
}
