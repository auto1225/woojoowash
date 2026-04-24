"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PayButton({
  storeId,
  productId,
  startAt,
  total,
}: {
  storeId: string;
  productId: string;
  startAt: string;
  total: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, productId, startAt }),
      });
      if (res.status === 401) {
        router.push(
          `/app/login?callbackUrl=${encodeURIComponent(
            `/app/booking/payment?store=${storeId}&product=${productId}&startAt=${startAt}`,
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
      {error && (
        <div className="mb-2 text-[12px] text-danger">{error}</div>
      )}
      <button
        type="button"
        onClick={pay}
        disabled={loading}
        className="h-14 rounded-full bg-accent text-white font-bold text-[16px] w-full flex items-center justify-center disabled:opacity-50 shadow-ww-blue"
      >
        {loading
          ? "결제 진행 중…"
          : `${total.toLocaleString("ko-KR")}원 결제하기`}
      </button>
    </>
  );
}
