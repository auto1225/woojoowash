"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

const STATUS_TABS = [
  { value: "", label: "전체" },
  { value: "CONFIRMED", label: "예약 확정" },
  { value: "DONE", label: "완료" },
  { value: "CANCELED", label: "취소" },
] as const;

const TYPE_TABS = [
  { value: "", label: "전체 유형" },
  { value: "SELF", label: "셀프세차" },
  { value: "HAND", label: "손세차" },
  { value: "PICKUP", label: "배달세차" },
  { value: "VISIT", label: "출장세차" },
] as const;

export function ReservationsFilter({
  totalCount,
  filteredCount,
  filteredRevenue,
  statusBreakdown,
}: {
  totalCount: number;
  filteredCount: number;
  filteredRevenue: number;
  statusBreakdown: Record<string, number>;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [status, setStatus] = useState<string>(sp.get("status") ?? "");
  const [type, setType] = useState<string>(sp.get("type") ?? "");
  const [q, setQ] = useState<string>(sp.get("q") ?? "");

  // URL 변경 시 외부 동기화
  useEffect(() => {
    setStatus(sp.get("status") ?? "");
    setType(sp.get("type") ?? "");
    setQ(sp.get("q") ?? "");
  }, [sp]);

  function applyFilters(overrides?: {
    status?: string;
    type?: string;
    q?: string;
  }) {
    const s = overrides?.status ?? status;
    const t = overrides?.type ?? type;
    const k = (overrides?.q ?? q).trim();
    const next = new URLSearchParams(sp.toString());
    setOrDel(next, "status", s);
    setOrDel(next, "type", t);
    setOrDel(next, "q", k);
    const qs = next.toString();
    startTransition(() => {
      router.push(qs ? `?${qs}` : "?");
    });
  }

  function reset() {
    setStatus("");
    setType("");
    setQ("");
    const next = new URLSearchParams(sp.toString());
    next.delete("status");
    next.delete("type");
    next.delete("q");
    startTransition(() => {
      const qs = next.toString();
      router.push(qs ? `?${qs}` : "?");
    });
  }

  const hasFilters = !!(status || type || q.trim());

  return (
    <div className="bg-white border border-fog rounded-[20px] p-5 mb-5 flex flex-col gap-4">
      {/* 상태 */}
      <div>
        <div className="text-[11px] font-bold text-slate mb-2">상태</div>
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((t) => {
            const active = status === t.value;
            const count = t.value
              ? statusBreakdown[t.value] ?? 0
              : totalCount;
            return (
              <button
                key={t.value || "all"}
                type="button"
                onClick={() => {
                  setStatus(t.value);
                  applyFilters({ status: t.value });
                }}
                className={`h-9 px-4 rounded-full text-[12px] font-bold transition border inline-flex items-center gap-2 ${
                  active
                    ? "bg-ink text-white border-ink"
                    : "bg-white text-graphite border-fog hover:border-ink hover:text-ink"
                }`}
              >
                {t.label}
                <span
                  className={`text-[10px] ww-num font-semibold ${
                    active ? "text-white/70" : "text-slate"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 유형 */}
      <div>
        <div className="text-[11px] font-bold text-slate mb-2">상품 유형</div>
        <div className="flex flex-wrap gap-2">
          {TYPE_TABS.map((t) => {
            const active = type === t.value;
            return (
              <button
                key={t.value || "all"}
                type="button"
                onClick={() => {
                  setType(t.value);
                  applyFilters({ type: t.value });
                }}
                className={`h-9 px-4 rounded-full text-[12px] font-bold transition border ${
                  active
                    ? "bg-ink text-white border-ink"
                    : "bg-white text-graphite border-fog hover:border-ink hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 검색 + 초기화 + 통계 */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate pointer-events-none"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyFilters();
              }
            }}
            placeholder="고객명·전화번호·상품명 검색"
            className="w-full h-10 pl-9 pr-3 bg-paper border border-fog rounded-full text-[13px] outline-none focus:border-ink"
          />
        </div>
        <button
          type="button"
          onClick={() => applyFilters()}
          disabled={pending}
          className="h-10 px-5 rounded-full bg-ink text-white text-[12px] font-bold disabled:opacity-50"
        >
          검색
        </button>
        {hasFilters && (
          <button
            type="button"
            onClick={reset}
            className="h-10 px-4 rounded-full border border-fog bg-white text-graphite text-[12px] font-bold hover:border-ink hover:text-ink transition"
          >
            초기화
          </button>
        )}
        <div className="flex items-baseline gap-3 ml-auto text-[12px]">
          <span className="text-slate">필터 결과</span>
          <span className="ww-num font-extrabold text-[16px]">
            {filteredCount}
          </span>
          <span className="text-slate">/ {totalCount} 건</span>
          {filteredRevenue > 0 && (
            <span className="ml-2 text-slate">예상 매출</span>
          )}
          {filteredRevenue > 0 && (
            <span className="ww-num font-extrabold text-[14px]">
              {filteredRevenue.toLocaleString("ko-KR")}원
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function setOrDel(p: URLSearchParams, key: string, val: string) {
  if (val) p.set(key, val);
  else p.delete(key);
}
