"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";

const RATING_TABS = [
  { value: "", label: "전체" },
  { value: "5", label: "★5" },
  { value: "4", label: "★4" },
  { value: "3", label: "★3" },
  { value: "2", label: "★2" },
  { value: "1", label: "★1" },
] as const;

export function ReviewsFilter({
  totalCount,
  filteredCount,
}: {
  totalCount: number;
  filteredCount: number;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [rating, setRating] = useState<string>(sp.get("rating") ?? "");
  const [from, setFrom] = useState<string>(sp.get("from") ?? "");
  const [to, setTo] = useState<string>(sp.get("to") ?? "");
  const [q, setQ] = useState<string>(sp.get("q") ?? "");

  // URL 변경 시 외부에서 들어온 값 동기화 (뒤로가기 등)
  useEffect(() => {
    setRating(sp.get("rating") ?? "");
    setFrom(sp.get("from") ?? "");
    setTo(sp.get("to") ?? "");
    setQ(sp.get("q") ?? "");
  }, [sp]);

  function applyFilters(overrides?: {
    rating?: string;
    from?: string;
    to?: string;
    q?: string;
  }) {
    const next = new URLSearchParams();
    const r = overrides?.rating ?? rating;
    const f = overrides?.from ?? from;
    const t = overrides?.to ?? to;
    const k = overrides?.q ?? q;
    if (r) next.set("rating", r);
    if (f) next.set("from", f);
    if (t) next.set("to", t);
    if (k.trim()) next.set("q", k.trim());
    const qs = next.toString();
    startTransition(() => {
      router.push(qs ? `?${qs}` : "?");
    });
  }

  function reset() {
    setRating("");
    setFrom("");
    setTo("");
    setQ("");
    startTransition(() => {
      router.push("?");
    });
  }

  function setQuickRange(days: number | null) {
    if (days === null) {
      setFrom("");
      setTo("");
      applyFilters({ from: "", to: "" });
      return;
    }
    const today = new Date();
    const startD = new Date();
    startD.setDate(today.getDate() - days);
    const f = formatDate(startD);
    const t = formatDate(today);
    setFrom(f);
    setTo(t);
    applyFilters({ from: f, to: t });
  }

  const hasFilters = !!(rating || from || to || q.trim());

  return (
    <div className="bg-white border border-fog rounded-[20px] p-5 mb-5 flex flex-col gap-4">
      {/* 별점 탭 */}
      <div>
        <div className="text-[11px] font-bold text-slate mb-2">별점</div>
        <div className="flex flex-wrap gap-2">
          {RATING_TABS.map((t) => {
            const active = rating === t.value;
            return (
              <button
                key={t.value || "all"}
                type="button"
                onClick={() => {
                  setRating(t.value);
                  applyFilters({ rating: t.value });
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

      {/* 기간 */}
      <div>
        <div className="text-[11px] font-bold text-slate mb-2">기간</div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            onBlur={() => applyFilters()}
            className="h-9 px-3 bg-paper border border-fog rounded-[10px] text-[12px] ww-num"
          />
          <span className="text-slate text-[12px]">~</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            onBlur={() => applyFilters()}
            className="h-9 px-3 bg-paper border border-fog rounded-[10px] text-[12px] ww-num"
          />
          <div className="flex gap-1 ml-2">
            <QuickBtn onClick={() => setQuickRange(7)}>최근 7일</QuickBtn>
            <QuickBtn onClick={() => setQuickRange(30)}>최근 30일</QuickBtn>
            <QuickBtn onClick={() => setQuickRange(90)}>최근 90일</QuickBtn>
            <QuickBtn onClick={() => setQuickRange(null)}>전체</QuickBtn>
          </div>
        </div>
      </div>

      {/* 검색 + 초기화 */}
      <div className="flex gap-2 flex-wrap items-center">
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
            placeholder="리뷰 본문·답글·작성자 이름 검색"
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
        <div className="text-[12px] text-slate ml-auto">
          {hasFilters ? (
            <>
              <span className="font-bold text-ink ww-num">
                {filteredCount}
              </span>
              <span className="ml-1">/ {totalCount} 건</span>
            </>
          ) : (
            <>
              총 <span className="font-bold text-ink ww-num">{totalCount}</span>건
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-9 px-3 rounded-full border border-fog bg-white text-[11px] font-bold text-graphite hover:border-ink hover:text-ink transition"
    >
      {children}
    </button>
  );
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
