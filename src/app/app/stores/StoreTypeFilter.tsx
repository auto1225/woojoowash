"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Chip } from "@/components/ui/Chip";

const TYPES = [
  { value: "", label: "전체" },
  { value: "self", label: "셀프" },
  { value: "hand", label: "손세차" },
  { value: "pickup", label: "배달" },
  { value: "visit", label: "출장" },
] as const;

export function StoreTypeFilter() {
  const router = useRouter();
  const sp = useSearchParams();
  const [, startTransition] = useTransition();
  const current = sp.get("type") ?? "";

  function selectType(value: string) {
    const next = new URLSearchParams(sp.toString());
    if (value) next.set("type", value);
    else next.delete("type");
    const qs = next.toString();
    startTransition(() => {
      router.push(qs ? `?${qs}` : "?");
    });
  }

  return (
    <div className="px-4 py-2 flex gap-[6px] overflow-x-auto ww-scroll-x">
      {TYPES.map((t) => (
        <button
          key={t.value || "all"}
          type="button"
          onClick={() => selectType(t.value)}
          className="shrink-0"
        >
          <Chip size="sm" active={current === t.value}>
            {t.label}
          </Chip>
        </button>
      ))}
    </div>
  );
}
