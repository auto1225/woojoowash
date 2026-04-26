"use client";

import { useTransition } from "react";

export function ProductDeleteButton({
  storeId,
  productId,
  productName,
  action,
}: {
  storeId: string;
  productId: string;
  productName: string;
  action: () => void | Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  function onClick() {
    if (pending) return;
    const ok = window.confirm(`"${productName}" 상품을 삭제할까요?`);
    if (!ok) return;
    startTransition(async () => {
      await action();
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="h-9 px-3 rounded-full border border-fog bg-white text-danger text-[12px] font-bold inline-flex items-center gap-1.5 hover:bg-danger/5 hover:border-danger/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
      title={`${productName} 삭제`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M6 6l1 14a2 2 0 002 2h6a2 2 0 002-2l1-14M10 11v6M14 11v6" />
      </svg>
      {pending ? "삭제 중..." : "삭제"}
    </button>
  );
}
