"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Chip } from "@/components/ui/Chip";

export type TypeCounts = {
  all: number;
  self: number;
  hand: number;
  visit: number;
  pickup: number;
};

const TYPES: ReadonlyArray<{
  value: "" | "self" | "hand" | "visit" | "pickup";
  label: string;
}> = [
  { value: "", label: "전체" },
  { value: "self", label: "셀프" },
  { value: "hand", label: "손세차" },
  { value: "visit", label: "출장" },
  { value: "pickup", label: "배달" },
];

export function StoreTypeFilter({ counts }: { counts: TypeCounts }) {
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

  function countFor(value: typeof TYPES[number]["value"]): number {
    if (value === "") return counts.all;
    return counts[value];
  }

  return (
    <div className="px-4 py-2 flex gap-[6px] overflow-x-auto ww-scroll-x">
      {TYPES.map((t) => {
        const active = current === t.value;
        return (
          <button
            key={t.value || "all"}
            type="button"
            onClick={() => selectType(t.value)}
            className="shrink-0"
          >
            <Chip size="sm" active={active}>
              <span>{t.label}</span>
              {countFor(t.value) > 0 && (
                <span
                  className={`ml-1.5 ww-num text-[11px] font-semibold ${
                    active ? "text-white/70" : "text-slate"
                  }`}
                >
                  {countFor(t.value)}
                </span>
              )}
            </Chip>
          </button>
        );
      })}
    </div>
  );
}
