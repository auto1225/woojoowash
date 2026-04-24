import * as React from "react";

export function WWGlyph({
  size = 24,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse
        cx="12"
        cy="12"
        rx="10.5"
        ry="4"
        stroke={color}
        strokeWidth="1.4"
        transform="rotate(-28 12 12)"
      />
      <path
        d="M12 5s-4 4.8-4 8a4 4 0 108 0c0-3.2-4-8-4-8z"
        fill={color}
      />
    </svg>
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
        <WWGlyph size={size} color={color} />
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
      <WWGlyph size={size * 1.2} color={color} />
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
