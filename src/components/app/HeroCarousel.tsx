"use client";

import * as React from "react";
import Image from "next/image";
import { useState } from "react";

export function HeroCarousel({
  slides,
}: {
  slides: Array<{ src: string; title: string; subtitle?: string }>;
}) {
  const [idx, setIdx] = useState(0);
  const n = slides.length;
  const s = slides[idx];
  return (
    <div className="relative w-full aspect-[1/1.1] bg-ink overflow-hidden">
      <Image
        src={s.src}
        alt={s.title}
        fill
        priority
        className="object-cover"
        sizes="(max-width: 480px) 100vw, 428px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      <div className="absolute top-14 left-5 right-5 text-white">
        {s.subtitle && (
          <div className="text-[13px] font-bold mb-2 opacity-90">
            {s.subtitle}
          </div>
        )}
        <div
          className="ww-disp"
          style={{ fontSize: 34, lineHeight: 1.1, letterSpacing: "-0.03em" }}
        >
          {s.title}
        </div>
      </div>
      <div className="absolute bottom-4 left-5 bg-black/45 text-white text-[11px] font-semibold px-2 py-[3px] rounded-full ww-num">
        {idx + 1} / {n}
      </div>
      <div className="absolute bottom-4 right-5 flex gap-[6px]">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIdx(i)}
            aria-label={`slide ${i + 1}`}
            className={`w-[6px] h-[6px] rounded-full transition ${
              i === idx ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
