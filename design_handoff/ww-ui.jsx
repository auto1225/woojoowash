// 우주워시 — Shared app UI primitives (phone screens)
// Monochrome / Minimal / Bold typography

// ─────────────────────────────────────────────────────────────
// Status bar (iOS)
// ─────────────────────────────────────────────────────────────
const WWStatus = ({ dark = false }) => {
  const c = dark ? '#fff' : WW.ink;
  return (
    <div style={{ height: 54, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 28px 10px', flexShrink: 0 }}>
      <div style={{ fontSize: 16, fontWeight: 600, color: c, letterSpacing: -0.2 }}>9:41</div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="18" height="11" viewBox="0 0 18 11" fill={c}>
          <rect x="0" y="7" width="3" height="4" rx="0.5"/>
          <rect x="5" y="4.5" width="3" height="6.5" rx="0.5"/>
          <rect x="10" y="2" width="3" height="9" rx="0.5"/>
          <rect x="15" y="0" width="3" height="11" rx="0.5"/>
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill={c}>
          <path d="M7.5 3C9.3 3 10.9 3.6 12.2 4.7l1-1A8.5 8.5 0 007.5 2a8.5 8.5 0 00-5.7 1.7l1 1C4.1 3.6 5.7 3 7.5 3z"/>
          <path d="M7.5 6c1.1 0 2.1.4 2.8 1.1l1-1a5 5 0 00-7.6 0l1 1c.7-.7 1.7-1.1 2.8-1.1z"/>
          <circle cx="7.5" cy="9.5" r="1.2"/>
        </svg>
        <svg width="24" height="11" viewBox="0 0 24 11" fill="none">
          <rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke={c} strokeOpacity="0.35"/>
          <rect x="2" y="2" width="17" height="7" rx="1.5" fill={c}/>
          <path d="M22 3.5V7.5c.7-.2 1.2-1 1.2-2s-.5-1.8-1.2-2z" fill={c} fillOpacity="0.5"/>
        </svg>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// App navbar (in-app, no large title) — variations by page
// ─────────────────────────────────────────────────────────────
const WWNav = ({ title, showBack = true, right, dark = false, onBack, border = true }) => {
  const c = dark ? '#fff' : WW.ink;
  const bg = dark ? 'transparent' : WW.white;
  return (
    <div style={{
      height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px', background: bg, flexShrink: 0,
      borderBottom: border ? `1px solid ${WW.fog}` : 'none',
    }}>
      <div style={{ width: 40, display: 'flex', alignItems: 'center' }}>
        {showBack && (
          <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: c }}>
            <IconBack size={24} stroke={2} />
          </button>
        )}
      </div>
      <div style={{ fontSize: 17, fontWeight: 600, color: c, letterSpacing: -0.3 }}>{title}</div>
      <div style={{ width: 40, display: 'flex', justifyContent: 'flex-end', color: c }}>{right}</div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Bottom tab bar (4 tabs)
// ─────────────────────────────────────────────────────────────
const WWTabBar = ({ active = 'home' }) => {
  const tabs = [
    { id: 'home', label: '홈', i: IconHome, fi: IconHomeFill },
    { id: 'fav',  label: '즐겨찾기', i: IconHeart, fi: IconHeartFill },
    { id: 'res',  label: '예약', i: IconCal, fi: IconCalFill },
    { id: 'me',   label: '마이', i: IconUser, fi: IconUserFill },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: 20, background: WW.white,
      borderTop: `1px solid ${WW.fog}`,
      zIndex: 40,
    }}>
      <div style={{ display: 'flex', padding: '10px 0 6px' }}>
        {tabs.map(t => {
          const isActive = active === t.id;
          const I = isActive ? t.fi : t.i;
          const color = isActive ? WW.ink : WW.ash;
          return (
            <div key={t.id} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4, color,
            }}>
              <I size={24} stroke={1.8} />
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: -0.2 }}>{t.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Pills / chips
// ─────────────────────────────────────────────────────────────
const WWChip = ({ children, active = false, size = 'md' }) => {
  const padding = size === 'sm' ? '6px 12px' : size === 'lg' ? '14px 20px' : '10px 16px';
  const fs = size === 'sm' ? 12 : size === 'lg' ? 15 : 14;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      padding, borderRadius: 999,
      background: active ? WW.ink : WW.white,
      color: active ? WW.white : WW.graphite,
      border: `1px solid ${active ? WW.ink : WW.fog}`,
      fontSize: fs, fontWeight: active ? 600 : 500, letterSpacing: -0.3,
      whiteSpace: 'nowrap',
    }}>{children}</div>
  );
};

// Circle chip (time-picker style, like yper's round buttons)
const WWCircleChip = ({ children, active = false, disabled = false, ring = false, ringColor }) => {
  const bg = active ? WW.ink : WW.white;
  const color = disabled ? WW.ash : active ? WW.white : WW.ink;
  const border = active ? WW.ink : ring ? (ringColor || WW.ink) : WW.fog;
  return (
    <div style={{
      minWidth: 58, height: 58, padding: '0 14px',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: 999, background: bg, color,
      border: `${ring ? 1.5 : 1}px solid ${border}`,
      fontSize: 14, fontWeight: active ? 700 : 500, letterSpacing: -0.3,
      flexShrink: 0,
    }}>{children}</div>
  );
};

// ─────────────────────────────────────────────────────────────
// CTA button (full-width)
// ─────────────────────────────────────────────────────────────
const WWCTA = ({ children, variant = 'primary', disabled = false, size = 'lg' }) => {
  const palettes = {
    primary:   { bg: WW.ink,    fg: WW.white },
    secondary: { bg: WW.cloud,  fg: WW.ink },
    accent:    { bg: WW.accent, fg: WW.white },
    outline:   { bg: WW.white,  fg: WW.ink, border: `1.5px solid ${WW.ink}` },
  };
  const p = palettes[variant];
  const height = size === 'sm' ? 40 : size === 'md' ? 48 : 56;
  const fs = size === 'sm' ? 14 : size === 'md' ? 15 : 16;
  return (
    <div style={{
      height, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: disabled ? WW.fog : p.bg, color: disabled ? WW.ash : p.fg,
      border: p.border || 'none',
      fontSize: fs, fontWeight: 700, letterSpacing: -0.3,
    }}>{children}</div>
  );
};

// ─────────────────────────────────────────────────────────────
// Card (plain surface with padding)
// ─────────────────────────────────────────────────────────────
const WWCard = ({ children, padding = 20, style }) => (
  <div style={{
    background: WW.white, borderRadius: 16, padding,
    border: `1px solid ${WW.fog}`,
    ...style,
  }}>{children}</div>
);

// ─────────────────────────────────────────────────────────────
// Section divider (fat horizontal rule between sections)
// ─────────────────────────────────────────────────────────────
const WWSectionGap = ({ size = 12 }) => (
  <div style={{ height: size, background: WW.cloud }} />
);

// ─────────────────────────────────────────────────────────────
// Row (list item)
// ─────────────────────────────────────────────────────────────
const WWRow = ({ icon: I, title, meta, right, onClick }) => (
  <div style={{
    display: 'flex', alignItems: 'center', padding: '16px 20px', gap: 14,
    background: WW.white,
  }}>
    {I && <I size={22} stroke={1.6} />}
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 15, fontWeight: 500, color: WW.ink, letterSpacing: -0.3 }}>{title}</div>
      {meta && <div style={{ fontSize: 12, color: WW.slate, marginTop: 2 }}>{meta}</div>}
    </div>
    {right || <IconChev size={18} stroke={1.8} style={{ color: WW.ash }} />}
  </div>
);

// ─────────────────────────────────────────────────────────────
// Logo mark — "우주워시" minimal wordmark
// ─────────────────────────────────────────────────────────────
const WWLogo = ({ size = 22, dark = false, compact = false }) => {
  const c = dark ? '#fff' : WW.ink;
  if (compact) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <WWGlyph size={size} color={c} />
        <span style={{ fontSize: size * 0.86, fontWeight: 800, color: c, letterSpacing: -0.02 * size, fontFamily: WW.fontDisp }}>우주워시</span>
      </div>
    );
  }
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <WWGlyph size={size * 1.2} color={c} />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontSize: size, fontWeight: 800, color: c, letterSpacing: -0.02 * size, fontFamily: WW.fontDisp }}>우주워시</span>
        <span style={{ fontSize: size * 0.42, fontWeight: 500, color: c, opacity: 0.5, letterSpacing: 0.15 * size * 0.1, marginTop: 2 }}>WOOJOO·WASH</span>
      </div>
    </div>
  );
};

// Glyph: droplet + orbit ring (우주 + 물방울)
const WWGlyph = ({ size = 24, color = WW.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="12" rx="10.5" ry="4" stroke={color} strokeWidth="1.4" transform="rotate(-28 12 12)"/>
    <path d="M12 5s-4 4.8-4 8a4 4 0 108 0c0-3.2-4-8-4-8z" fill={color}/>
  </svg>
);

Object.assign(window, {
  WWStatus, WWNav, WWTabBar, WWChip, WWCircleChip, WWCTA, WWCard,
  WWSectionGap, WWRow, WWLogo, WWGlyph,
});
