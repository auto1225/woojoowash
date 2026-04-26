"use client";

import { useState, type ReactNode } from "react";

export type InfoSection = {
  title: string;
  subtitle: string;
  content: string;
};

export function StoreTabs({
  productsSlot,
  infoSections,
  defaultTab,
}: {
  productsSlot: ReactNode;
  infoSections: InfoSection[];
  defaultTab: "products" | "info" | "reviews";
}) {
  const [active, setActive] = useState<"products" | "info" | "reviews">(
    defaultTab,
  );

  const tabs = [
    { key: "products" as const, label: "상품" },
    { key: "info" as const, label: "정보" },
    { key: "reviews" as const, label: "리뷰" },
  ];

  return (
    <>
      <div className="mt-6 px-5 flex gap-[2px] border-b border-fog">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActive(t.key)}
            className={`flex-1 text-center py-3 text-[14px] font-bold transition ${
              active === t.key
                ? "text-ink border-b-2 border-ink"
                : "text-slate hover:text-graphite"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active === "products" && (
        <div className="px-5 pt-5 flex flex-col gap-3">{productsSlot}</div>
      )}

      {active === "info" && (
        <div className="px-5 pt-5 flex flex-col gap-3">
          {infoSections.length === 0 ? (
            <div className="py-12 text-center text-slate text-[13px]">
              등록된 매장 정보가 없어요.
            </div>
          ) : (
            infoSections.map((s, i) => (
              <div
                key={i}
                className="rounded-[14px] border border-fog bg-white p-4"
              >
                {s.title && (
                  <div className="text-[15px] font-extrabold tracking-[-0.3px] text-ink leading-[1.4]">
                    {s.title}
                  </div>
                )}
                {s.subtitle && (
                  <div className="text-[13px] font-bold text-graphite mt-1 leading-[1.5]">
                    {s.subtitle}
                  </div>
                )}
                {s.content && (
                  <div className="text-[13px] text-slate leading-[1.7] mt-2 whitespace-pre-wrap">
                    {s.content}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {active === "reviews" && (
        <div className="px-5 pt-5">
          <div className="py-12 text-center text-slate text-[13px]">
            아직 등록된 리뷰가 없어요.
          </div>
        </div>
      )}
    </>
  );
}
