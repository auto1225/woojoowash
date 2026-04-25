"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function StoreCoverGallery({
  images,
  storeName,
}: {
  images: string[];
  storeName: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // 스크롤 이벤트로 active index 추적
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setActive(Math.max(0, Math.min(images.length - 1, idx)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [images.length]);

  function jump(i: number) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div className="relative h-[260px] bg-cloud overflow-hidden">
      <div
        ref={trackRef}
        className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory ww-no-scrollbar"
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="relative shrink-0 w-full h-full snap-center"
          >
            <Image
              src={src}
              alt={`${storeName} 사진 ${i + 1}`}
              fill
              priority={i === 0}
              className="object-cover"
              sizes="(max-width: 480px) 100vw, 480px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent pointer-events-none" />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          {/* 우측 하단 카운터 */}
          <span className="absolute right-4 top-3 text-[10px] font-semibold bg-black/45 text-white rounded-full px-2 py-[3px] ww-num pointer-events-none">
            {active + 1} / {images.length}
          </span>
          {/* 인디케이터 */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[8px] flex gap-1 pointer-events-auto">
            {images.map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => jump(i)}
                aria-label={`이미지 ${i + 1}`}
                className={`h-[6px] rounded-full transition ${
                  i === active ? "w-[18px] bg-white" : "w-[6px] bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
