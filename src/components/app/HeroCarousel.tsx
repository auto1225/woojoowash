"use client";

import * as React from "react";
import Image from "next/image";
import { useEffect, useState } from "react";

const AUTO_MS = 3000;

export function HeroCarousel({
  slides,
}: {
  slides: Array<{ src: string; title: string; subtitle?: string }>;
}) {
  const [idx, setIdx] = useState(0);
  const n = slides.length;

  useEffect(() => {
    if (n <= 1) return;
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % n);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [idx, n]);

  return (
    <div className="relative w-full aspect-[3/1] bg-ink overflow-hidden">
      {slides.map((slide, i) => {
        const active = i === idx;
        return (
          <div
            key={i}
            aria-hidden={!active}
            className={`absolute inset-0 transition-opacity duration-[700ms] ease-in-out ${
              active ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.title}
              fill
              priority={i === 0}
              className="object-cover"
              sizes="(max-width: 480px) 100vw, 428px"
            />
            {/* 텍스트가 잘 보이도록 위→아래 어둠 + 인디케이터를 위한 아래쪽 어둠 */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/45" />
            <div className="absolute top-5 left-5 right-5 text-white">
              {slide.subtitle && (
                <div className="text-[12px] font-bold mb-1 opacity-90">
                  {slide.subtitle}
                </div>
              )}
              <div
                className="ww-disp"
                style={{
                  fontSize: 24,
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  textShadow: "0 1px 6px rgba(0,0,0,0.35)",
                }}
              >
                {slide.title}
              </div>
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-[6px]">
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
