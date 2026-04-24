// yper 스타일 서비스 일러스트 — 컬러풀 배지 + 모노라인 차량
// 각 서비스마다 식별용 뱃지(BAY / SHOP / P / AUTO)와 포인트 컬러.

import * as React from "react";

type Kind = "self" | "hand" | "pickup" | "visit" | "auto" | "market";

export function ServiceIllust({
  kind,
  size = 96,
}: {
  kind: Kind;
  size?: number;
}) {
  const ICONS: Record<Kind, React.ReactNode> = {
    self: <SelfIllust />,
    hand: <HandIllust />,
    pickup: <PickupIllust />,
    visit: <VisitIllust />,
    auto: <AutoIllust />,
    market: <MarketIllust />,
  };
  return (
    <div
      className="relative flex items-end justify-center"
      style={{ width: size, height: size }}
    >
      {ICONS[kind]}
    </div>
  );
}

const CAR_BODY = (
  <>
    <path
      d="M12 70 L20 52 C22 48 26 46 30 46 L74 46 C78 46 82 48 84 52 L92 70 L92 82 C92 84 90 86 88 86 L84 86 C82 86 80 84 80 82 L80 78 L24 78 L24 82 C24 84 22 86 20 86 L16 86 C14 86 12 84 12 82 L12 70 Z"
      fill="#1D2332"
    />
    <rect x="28" y="52" width="48" height="14" rx="3" fill="#EAF0FF" />
    <circle cx="28" cy="78" r="6" fill="#0A0A0B" />
    <circle cx="76" cy="78" r="6" fill="#0A0A0B" />
    <circle cx="28" cy="78" r="2.5" fill="#4D68FF" />
    <circle cx="76" cy="78" r="2.5" fill="#4D68FF" />
  </>
);

function SelfIllust() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 104 100" fill="none">
      {CAR_BODY}
      {/* spray nozzle */}
      <rect x="68" y="14" width="6" height="28" rx="2" fill="#1D2332" />
      <rect x="64" y="10" width="14" height="8" rx="2" fill="#FFD600" />
      <text
        x="71"
        y="17"
        fontSize="7"
        fontWeight="800"
        fill="#0A0A0B"
        textAnchor="middle"
        fontFamily="Pretendard"
      >
        BAY
      </text>
      <path
        d="M71 42 L66 50 M71 42 L71 50 M71 42 L76 50"
        stroke="#4D68FF"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HandIllust() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 104 100" fill="none">
      {CAR_BODY}
      <rect x="28" y="8" width="26" height="10" rx="3" fill="#FFD600" />
      <text
        x="41"
        y="15.5"
        fontSize="7"
        fontWeight="800"
        fill="#0A0A0B"
        textAnchor="middle"
        fontFamily="Pretendard"
      >
        SHOP
      </text>
      {/* sponge */}
      <ellipse cx="58" cy="42" rx="16" ry="10" fill="#FFD600" />
      <path
        d="M48 34 Q58 24 68 34"
        stroke="#0A0A0B"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* bubbles */}
      <circle cx="44" cy="32" r="2.5" fill="#4D68FF" />
      <circle cx="72" cy="30" r="2" fill="#4D68FF" />
      <circle cx="78" cy="38" r="1.5" fill="#4D68FF" />
    </svg>
  );
}

function PickupIllust() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 104 100" fill="none">
      {CAR_BODY}
      <rect x="28" y="8" width="34" height="10" rx="3" fill="#4D68FF" />
      <text
        x="45"
        y="15.5"
        fontSize="7"
        fontWeight="800"
        fill="#fff"
        textAnchor="middle"
        fontFamily="Pretendard"
      >
        PICKUP
      </text>
      {/* road arrows */}
      <path
        d="M8 92 L96 92"
        stroke="#D4D4D9"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="4 4"
      />
      <path
        d="M92 88 L96 92 L92 96"
        stroke="#4D68FF"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VisitIllust() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 104 100" fill="none">
      {CAR_BODY}
      <circle cx="52" cy="18" r="11" fill="#4D68FF" />
      <text
        x="52"
        y="22"
        fontSize="12"
        fontWeight="800"
        fill="#fff"
        textAnchor="middle"
        fontFamily="Pretendard"
      >
        P
      </text>
      <path
        d="M52 29 L52 46"
        stroke="#4D68FF"
        strokeWidth="2"
        strokeDasharray="3 2"
      />
      {/* spray */}
      <rect x="78" y="30" width="4" height="12" rx="1" fill="#1D2332" />
      <path d="M80 30 L74 22" stroke="#4D68FF" strokeWidth="2" />
    </svg>
  );
}

function AutoIllust() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 104 100" fill="none">
      {/* tunnel */}
      <rect x="6" y="18" width="92" height="68" rx="6" fill="#EAF0FF" />
      <rect x="6" y="18" width="92" height="10" fill="#4D68FF" />
      <text
        x="52"
        y="26"
        fontSize="8"
        fontWeight="800"
        fill="#fff"
        textAnchor="middle"
        fontFamily="Pretendard"
      >
        AUTO
      </text>
      <g transform="translate(0 6)">{CAR_BODY}</g>
      {/* water drops */}
      <circle cx="18" cy="42" r="2" fill="#4D68FF" />
      <circle cx="18" cy="56" r="2" fill="#4D68FF" />
      <circle cx="90" cy="42" r="2" fill="#4D68FF" />
      <circle cx="90" cy="56" r="2" fill="#4D68FF" />
    </svg>
  );
}

function MarketIllust() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 104 100" fill="none">
      {/* bucket */}
      <path
        d="M24 36 H70 L66 86 H28 Z"
        fill="#1D2332"
        stroke="#0A0A0B"
        strokeWidth="1"
      />
      <rect x="22" y="32" width="50" height="6" rx="2" fill="#0A0A0B" />
      <rect x="46" y="22" width="4" height="14" fill="#0A0A0B" />
      <ellipse cx="48" cy="22" rx="12" ry="4" fill="none" stroke="#0A0A0B" strokeWidth="2" />
      {/* brush & spray */}
      <rect x="72" y="44" width="18" height="6" rx="2" fill="#FFD600" />
      <rect x="70" y="50" width="22" height="4" fill="#1D2332" />
      <circle cx="84" cy="66" r="8" fill="#4D68FF" />
      <path d="M82 66 L84 68 L88 64" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      {/* bubbles */}
      <circle cx="18" cy="30" r="3" fill="#4D68FF" />
      <circle cx="14" cy="42" r="2" fill="#4D68FF" />
    </svg>
  );
}
