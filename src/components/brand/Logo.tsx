import * as React from "react";
import Image from "next/image";

/**
 * 브랜드 글리프 — public/brand/logo.png (육각형 + 자동차 + 물보라)
 * 기존 SVG 글리프를 대체. 표시 크기는 입력 size 의 1.5배로 확대.
 */
const GLYPH_SCALE = 1.5;
export function WWGlyph({
  size = 24,
}: {
  size?: number;
  /** 호환을 위해 받기는 하지만 이미지에는 적용되지 않음 */
  color?: string;
}) {
  const visualSize = Math.round(size * GLYPH_SCALE);
  return (
    <Image
      src="/brand/logo.png"
      alt="우주워시"
      width={visualSize}
      height={visualSize}
      priority
      style={{
        width: visualSize,
        height: visualSize,
        objectFit: "contain",
      }}
    />
  );
}

export function WWLogo({
  size = 22,
  dark = false,
  compact = false,
}: {
  size?: number;
  dark?: boolean;
  compact?: boolean;
}) {
  const color = dark ? "#fff" : "var(--ww-ink)";
  if (compact) {
    return (
      <span
        className="ww-disp inline-flex items-center gap-[6px]"
        style={{ color }}
      >
        <WWGlyph size={size} />
        <span
          style={{
            fontSize: size * 0.86,
            fontWeight: 800,
            letterSpacing: -0.02 * size,
          }}
        >
          우주워시
        </span>
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-2"
      style={{ color }}
    >
      <WWGlyph size={size * 1.2} />
      <span className="flex flex-col leading-none">
        <span
          className="ww-disp"
          style={{
            fontSize: size,
            fontWeight: 800,
            letterSpacing: -0.02 * size,
          }}
        >
          우주워시
        </span>
        <span
          style={{
            fontSize: size * 0.42,
            fontWeight: 500,
            opacity: 0.5,
            marginTop: 2,
            letterSpacing: size * 0.015,
          }}
        >
          WOOJOO·WASH
        </span>
      </span>
    </span>
  );
}
