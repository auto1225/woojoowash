"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type FaqItem = {
  id: string;
  category: string | null;
  question: string;
  answer: string;
};

export function FaqList({ items }: { items: FaqItem[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const it of items) {
      if (it.category) set.add(it.category);
    }
    return ["전체", ...Array.from(set)];
  }, [items]);

  const [active, setActive] = useState<string>("전체");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (active !== "전체" && it.category !== active) return false;
      if (!q) return true;
      return (
        it.question.toLowerCase().includes(q) ||
        it.answer.toLowerCase().includes(q)
      );
    });
  }, [items, active, query]);

  return (
    <>
      {/* 검색 + 카테고리 칩 */}
      <div className="px-5 pt-4 pb-3 sticky top-[52px] bg-white z-10 border-b border-fog">
        <div className="relative mb-3">
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="궁금한 내용을 검색해보세요"
            className="w-full h-11 pl-9 pr-3 bg-cloud rounded-full text-[14px] outline-none focus:bg-paper"
          />
        </div>
        <div className="flex gap-[6px] overflow-x-auto ww-scroll-x">
          {categories.map((c) => {
            const isActive = active === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                className={`shrink-0 h-8 px-3 rounded-full text-[12px] font-bold border transition ${
                  isActive
                    ? "bg-ink text-white border-ink"
                    : "bg-white text-graphite border-fog"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="px-5 pt-12 text-center text-slate text-[13px]">
          {query
            ? "검색 결과가 없어요. 다른 키워드로 시도해보세요."
            : "이 카테고리에는 등록된 질문이 없어요."}
        </div>
      ) : (
        <ul className="divide-y divide-fog">
          {filtered.map((it) => (
            <FaqRow key={it.id} item={it} />
          ))}
        </ul>
      )}

      {/* 하단 안내 + 1:1 문의 링크 */}
      <div className="px-5 pt-8 pb-6">
        <div className="rounded-[14px] bg-cloud p-5 text-center">
          <div className="text-[14px] font-bold mb-1">
            원하는 답을 찾지 못했나요?
          </div>
          <div className="text-[12px] text-slate mb-3">
            1:1 문의로 더 자세히 안내해 드려요.
          </div>
          <Link
            href="/app/support"
            className="inline-flex h-10 px-5 items-center rounded-full bg-ink text-white text-[12px] font-bold"
          >
            1:1 문의하기
          </Link>
        </div>
      </div>
    </>
  );
}

function FaqRow({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full px-5 py-4 flex items-center gap-3 text-left active:bg-paper transition"
      >
        <span className="w-6 h-6 rounded-full bg-ink text-white flex items-center justify-center text-[12px] font-extrabold shrink-0">
          Q
        </span>
        <span className="flex-1 text-[14px] font-bold leading-[1.4] text-ink">
          {item.question}
        </span>
        <svg
          className={`text-slate transition-transform ${open ? "rotate-180" : ""}`}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-5 flex items-start gap-3">
          <span className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-[12px] font-extrabold shrink-0">
            A
          </span>
          <div className="flex-1 text-[13px] leading-[1.7] text-graphite whitespace-pre-wrap">
            {item.answer}
          </div>
        </div>
      )}
    </li>
  );
}
