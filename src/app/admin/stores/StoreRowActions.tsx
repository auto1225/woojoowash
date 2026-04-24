"use client";

import { useTransition } from "react";
import { setStoreOpen, setStoreOwner } from "./actions";

export function StoreRowActions({
  storeId,
  ownerId,
  open,
  owners,
}: {
  storeId: string;
  ownerId: string | null;
  open: boolean;
  owners: Array<{ id: string; name: string | null; email: string | null }>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="inline-flex gap-2 items-center">
      <select
        defaultValue={ownerId ?? ""}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value || null;
          startTransition(() => setStoreOwner(storeId, next));
        }}
        className="h-8 px-2 bg-paper border border-fog rounded-[8px] text-[12px] max-w-[180px]"
      >
        <option value="">소유자 미지정</option>
        {owners.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name || o.email}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => setStoreOpen(storeId, !open))}
        className={`h-8 px-3 rounded-full text-[12px] font-bold ${
          open
            ? "bg-fog text-slate hover:bg-mist"
            : "bg-success/10 text-success hover:bg-success/20"
        } disabled:opacity-40`}
      >
        {open ? "영업종료" : "영업재개"}
      </button>
    </div>
  );
}
