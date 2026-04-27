"use client";

import { useState } from "react";

export type LegalDocView = {
  slug: "terms" | "privacy";
  label: string;
  title: string;
  body: string;
  updatedAt: string | null;
};

export function LegalTabs({ items }: { items: LegalDocView[] }) {
  const [active, setActive] = useState<LegalDocView["slug"]>(items[0]?.slug ?? "terms");
  const current = items.find((i) => i.slug === active) ?? items[0];

  return (
    <>
      <div className="px-5 pt-3 sticky top-[52px] bg-white z-10 border-b border-fog">
        <div className="grid grid-cols-2 gap-1 mb-[-1px]">
          {items.map((it) => {
            const isActive = active === it.slug;
            return (
              <button
                key={it.slug}
                type="button"
                onClick={() => setActive(it.slug)}
                className={`h-11 text-[13px] font-bold transition border-b-2 ${
                  isActive
                    ? "text-ink border-ink"
                    : "text-slate border-transparent hover:text-graphite"
                }`}
              >
                {it.label}
              </button>
            );
          })}
        </div>
      </div>

      <article className="px-5 pt-5 pb-12">
        <h1 className="text-[20px] font-extrabold tracking-[-0.3px] mb-2">
          {current.title}
        </h1>
        {current.updatedAt && (
          <div className="text-[11px] text-slate ww-num mb-4">
            최근 수정 {current.updatedAt.slice(0, 10)}
          </div>
        )}
        <div className="text-[13px] leading-[1.8] text-graphite whitespace-pre-wrap">
          {current.body}
        </div>
      </article>
    </>
  );
}
