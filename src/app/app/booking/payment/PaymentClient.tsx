"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  EMPTY_CARD,
  isCardValid,
  PaymentMethodSelector,
  type CardInfo,
  type PayMethod,
} from "./PaymentMethodSelector";

export function PaymentClient({
  storeId,
  productId,
  startAt,
  optionIds,
  total,
}: {
  storeId: string;
  productId: string;
  startAt: string;
  optionIds: string[];
  total: number;
}) {
  const router = useRouter();
  const [method, setMethod] = useState<PayMethod>("EASY");
  const [card, setCard] = useState<CardInfo>(EMPTY_CARD);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardOk = method === "EASY" || isCardValid(card);

  async function pay() {
    setError(null);
    if (!cardOk) {
      setError("카드 정보를 모두 정확히 입력해 주세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          productId,
          startAt,
          optionIds,
          paymentMethod: method,
        }),
      });
      if (res.status === 401) {
        const callback = new URLSearchParams({
          store: storeId,
          product: productId,
          startAt,
        });
        if (optionIds.length > 0) callback.set("options", optionIds.join(","));
        router.push(
          `/app/login?callbackUrl=${encodeURIComponent(
            `/app/booking/payment?${callback.toString()}`,
          )}`,
        );
        return;
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? "결제에 실패했어요.");
        return;
      }
      const { id } = (await res.json()) as { id: string };
      router.replace(`/app/booking/${id}/confirmed`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PaymentMethodSelector
        method={method}
        onMethodChange={setMethod}
        card={card}
        onCardChange={setCard}
      />

      <div className="fixed left-0 right-0 bottom-0 flex justify-center z-30">
        <div className="w-full max-w-app bg-paper px-4 py-3">
          {error && (
            <div className="mb-2 text-[12px] text-danger">{error}</div>
          )}
          <button
            type="button"
            onClick={pay}
            disabled={loading || !cardOk}
            className="h-14 rounded-full bg-accent text-white font-bold text-[16px] w-full flex items-center justify-center disabled:opacity-50 shadow-ww-blue"
          >
            {loading
              ? "결제 진행 중…"
              : `${total.toLocaleString("ko-KR")}원 결제하기`}
          </button>
        </div>
      </div>
    </>
  );
}
