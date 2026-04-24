// 우주워시 (WoojooWash) Design Tokens
// Minimal/Monochrome — White + Black with a single accent

const WW = {
  // Brand palette — monochrome with deep ink accents
  ink:       '#0A0A0B',   // primary text, primary CTA
  charcoal:  '#1C1C1F',
  graphite:  '#3A3A3D',
  slate:     '#6E6E73',   // secondary text
  ash:       '#A8A8AD',
  mist:      '#D4D4D9',
  fog:       '#E8E8EB',
  cloud:     '#F2F2F4',   // surface
  paper:     '#F7F7F8',
  white:     '#FFFFFF',

  // Accent — single electric accent for CTAs, badges
  // A very cold, near-neutral blue so it reads "ink+" rather than a second color
  accent:    '#1E40FF',
  accentSoft:'#E6EAFF',
  
  // Semantic
  danger:    '#E4002B',
  success:   '#0A7D32',
  warning:   '#B76E00',

  // Shadows
  shadowCard: '0 1px 2px rgba(10,10,11,0.04), 0 4px 20px rgba(10,10,11,0.04)',
  shadowPop:  '0 8px 32px rgba(10,10,11,0.12)',
  shadowBtn:  '0 1px 3px rgba(10,10,11,0.08)',

  // Radii
  r_xs: 6,
  r_sm: 10,
  r_md: 14,
  r_lg: 20,
  r_xl: 28,
  
  // Fonts
  fontKR: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  fontEN: "'Inter', -apple-system, system-ui, sans-serif",
  fontDisp: "'Pretendard', -apple-system, system-ui, sans-serif",
  fontMono: "'JetBrains Mono', ui-monospace, monospace",
};

window.WW = WW;

// Global font injection
if (typeof document !== 'undefined' && !document.getElementById('ww-fonts')) {
  const link = document.createElement('link');
  link.id = 'ww-fonts';
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css';
  document.head.appendChild(link);
  
  const s = document.createElement('style');
  s.textContent = `
    * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    body { font-family: ${WW.fontKR}; color: ${WW.ink}; margin: 0; }
    .ww-disp { font-family: ${WW.fontDisp}; font-weight: 800; letter-spacing: -0.02em; }
    .ww-num { font-variant-numeric: tabular-nums; font-feature-settings: 'tnum'; }
  `;
  document.head.appendChild(s);
}
