// 우주워시 — App Icon (정면 자동차 + 거품 버블) — v2, 원본 참고 리디자인

const WWAppIcon = ({ size = 180, bg = '#0A0A0B', fg = '#FFFFFF', radius, outline = false }) => {
  const r = radius ?? size * 0.225;
  return (
    <div style={{
      width: size, height: size, borderRadius: r, background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', position: 'relative',
      boxShadow: outline ? 'inset 0 0 0 1px rgba(0,0,0,0.08)' : 'none',
    }}>
      <svg viewBox="0 0 200 200" width={size * 0.82} height={size * 0.82}>
        {/* =============================================
            FOAM CLOUD — scalloped wreath around the car
            Built from connected bumps. Stroke weight is
            thick to read like a bold outlined cloud.
            ============================================= */}
        <g fill="none" stroke={fg} strokeWidth="7" strokeLinejoin="round" strokeLinecap="round">
          <path d="
            M 36 92
            a 10 10 0 0 1 -2 -16
            a 11 11 0 0 1 8 -14
            a 12 12 0 0 1 16 -4
            a 11 11 0 0 1 14 -10
            a 12 12 0 0 1 16 0
            a 11 11 0 0 1 16 -2
            a 11 11 0 0 1 14 4
            a 12 12 0 0 1 16 4
            a 11 11 0 0 1 12 10
            a 11 11 0 0 1 6 14
            a 10 10 0 0 1 -4 14
            L 160 110
            a 11 11 0 0 1 8 14
            a 11 11 0 0 1 -4 14
            a 12 12 0 0 1 -10 12
            a 11 11 0 0 1 -14 6
            L 44 160
            a 12 12 0 0 1 -14 -6
            a 11 11 0 0 1 -10 -12
            a 11 11 0 0 1 -4 -14
            a 10 10 0 0 1 8 -14
            Z
          "/>
        </g>

        {/* Small floating bubbles (ring shapes as in original) */}
        <g fill="none" stroke={fg} strokeWidth="6">
          <circle cx="44" cy="40" r="9"/>
          <circle cx="132" cy="22" r="7"/>
          <circle cx="164" cy="36" r="5.5"/>
        </g>

        {/* =============================================
            CAR — front view, chunky solid silhouette
            Drawn as one path so it reads as a single mass.
            Windshield, headlights, grille carved with bg.
            ============================================= */}
        {/* Car body fill */}
        <path
          d="M 54 98
             Q 62 78 82 76
             L 118 76
             Q 138 78 146 98
             L 152 104
             Q 160 108 160 118
             L 160 148
             Q 160 154 154 154
             L 144 154
             Q 138 154 138 148
             L 138 142
             L 62 142
             L 62 148
             Q 62 154 56 154
             L 46 154
             Q 40 154 40 148
             L 40 118
             Q 40 108 48 104
             Z"
          fill={fg}
        />

        {/* Windshield — single rounded trapezoid (like original) */}
        <path
          d="M 74 102
             Q 80 86 94 84
             L 106 84
             Q 120 86 126 102
             L 126 112
             Q 100 110 74 112
             Z"
          fill={bg}
        />

        {/* Side mirrors — small notches making body feel wider */}
        <path
          d="M 40 116
             Q 34 116 34 120
             L 34 124
             Q 34 128 40 128
             Z"
          fill={fg}
        />
        <path
          d="M 160 116
             Q 166 116 166 120
             L 166 124
             Q 166 128 160 128
             Z"
          fill={fg}
        />

        {/* Headlights — two round circles */}
        <circle cx="60" cy="124" r="5.5" fill={bg}/>
        <circle cx="140" cy="124" r="5.5" fill={bg}/>

        {/* Grille slit */}
        <rect x="86" y="127" width="28" height="4" rx="2" fill={bg}/>

        {/* Lower bumper line (subtle) */}
        <rect x="70" y="136" width="60" height="2.5" rx="1.25" fill={bg} opacity="0.9"/>
      </svg>
    </div>
  );
};

window.WWAppIcon = WWAppIcon;
