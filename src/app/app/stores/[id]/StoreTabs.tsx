"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={n <= rating ? "#FFB400" : "#E5E5EA"}
        >
          <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8l-5.8 3.1 1.1-6.5L2.6 9.8l6.5-.9L12 3z" />
        </svg>
      ))}
    </span>
  );
}

export type InfoSection = {
  title: string;
  subtitle: string;
  content: string;
  images: string[];
};

export type ReviewItem = {
  id: string;
  rating: number;
  body: string | null;
  photos: string[];
  createdAt: string; // ISO
  authorName: string;
  reply: string | null;
  repliedAt: string | null;
};

export function StoreTabs({
  productsSlot,
  infoSections,
  reviews = [],
  defaultTab,
}: {
  productsSlot: ReactNode;
  infoSections: InfoSection[];
  reviews?: ReviewItem[];
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
                {s.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {s.images.map((url, j) => (
                      <div
                        key={j}
                        className="relative aspect-square w-full rounded-[10px] overflow-hidden bg-cloud"
                      >
                        <Image
                          src={url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 480px) 50vw, 240px"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {active === "reviews" && (
        <div className="px-5 pt-5 flex flex-col gap-4">
          {reviews.length === 0 ? (
            <div className="py-12 text-center text-slate text-[13px]">
              아직 등록된 리뷰가 없어요.
            </div>
          ) : (
            reviews.map((r) => (
              <div
                key={r.id}
                className="rounded-[14px] border border-fog bg-white p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Stars rating={r.rating} />
                    <span className="text-[12px] font-bold text-graphite">
                      {r.authorName}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate ww-num">
                    {r.createdAt.slice(0, 10)}
                  </span>
                </div>
                {r.body && (
                  <div className="text-[13px] leading-[1.7] text-graphite whitespace-pre-wrap">
                    {r.body}
                  </div>
                )}
                {r.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-1 mt-2">
                    {r.photos.map((src, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-[8px] overflow-hidden bg-cloud"
                      >
                        <Image
                          src={src}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 480px) 33vw, 160px"
                        />
                      </div>
                    ))}
                  </div>
                )}
                {r.reply && (
                  <div className="mt-3 rounded-[10px] bg-paper border border-fog p-3">
                    <div className="text-[10px] font-bold text-brand-deep tracking-[0.05em] mb-1">
                      매장 답글
                      {r.repliedAt && (
                        <span className="ml-2 text-slate font-medium ww-num">
                          {r.repliedAt.slice(0, 10)}
                        </span>
                      )}
                    </div>
                    <div className="text-[12px] leading-[1.6] text-graphite whitespace-pre-wrap">
                      {r.reply}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
