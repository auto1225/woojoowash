// 우주워시 — App Icon Showcase

const AppIconShowcase = () => (
  <div style={{ padding: 40, fontFamily: WW.fontKR, color: WW.ink, background: WW.white, minHeight: '100%' }}>
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: WW.accent, letterSpacing: 1.5, marginBottom: 10 }}>APP ICON · 앱 아이콘</div>
      <div className="ww-disp" style={{ fontSize: 34, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1.1, marginBottom: 8 }}>
        자동차 + 거품으로 빛나는 세차를 상징
      </div>
      <div style={{ fontSize: 14, color: WW.slate, maxWidth: 500, lineHeight: 1.5 }}>
        정면 차량 실루엣 위로 감싸는 거품 구름. 첨부 이미지의 형태감을 우주워시 모노크롬 스타일로 재해석했습니다.
      </div>
    </div>

    {/* Primary icon */}
    <div style={{ marginBottom: 40 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: WW.slate, letterSpacing: 1, marginBottom: 14 }}>PRIMARY</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <WWAppIcon size={200} bg={WW.ink} fg={WW.white}/>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.4, marginBottom: 4 }}>우주워시</div>
          <div style={{ fontSize: 13, color: WW.slate, marginBottom: 12 }}>Ink 배경 · 화이트 그래픽</div>
          <div style={{ display: 'inline-flex', gap: 6, flexWrap: 'wrap' }}>
            {['iOS', 'Android', 'PWA', 'Store Listing'].map((t, i) => (
              <div key={i} style={{
                padding: '4px 10px', borderRadius: 999, background: WW.cloud,
                fontSize: 11, fontWeight: 600, color: WW.graphite,
              }}>{t}</div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Color variants */}
    <div style={{ marginBottom: 40 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: WW.slate, letterSpacing: 1, marginBottom: 14 }}>COLOR VARIANTS</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18 }}>
        {[
          { bg: WW.ink, fg: WW.white, label: 'Ink / Primary' },
          { bg: WW.white, fg: WW.ink, label: 'White', outline: true },
          { bg: WW.accent, fg: WW.ink, label: 'Accent' },
          { bg: WW.cloud, fg: WW.ink, label: 'Cloud', outline: true },
          { bg: '#F5F1E8', fg: WW.ink, label: 'Cream', outline: true },
        ].map((v, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
              <WWAppIcon size={110} bg={v.bg} fg={v.fg} outline={v.outline}/>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700 }}>{v.label}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Sizes */}
    <div style={{ marginBottom: 40 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: WW.slate, letterSpacing: 1, marginBottom: 14 }}>SIZES</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24 }}>
        {[180, 120, 80, 58, 40, 28].map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <WWAppIcon size={s} bg={WW.ink} fg={WW.white}/>
            <div style={{ fontSize: 10, fontWeight: 600, color: WW.slate, marginTop: 8 }}>{s}×{s}</div>
          </div>
        ))}
      </div>
    </div>

    {/* On home screens */}
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: WW.slate, letterSpacing: 1, marginBottom: 14 }}>ON HOME SCREEN</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* iOS-style home */}
        <div style={{
          borderRadius: 24, padding: 24, aspectRatio: '9/14',
          background: 'linear-gradient(160deg, #B8C5D6 0%, #7B8BA3 50%, #3A4458 100%)',
          position: 'relative',
        }}>
          <div style={{ color: WW.white, textAlign: 'center', marginTop: 8, marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.8 }}>금요일</div>
            <div style={{ fontSize: 56, fontWeight: 300, letterSpacing: -2, lineHeight: 1 }}>24</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[
              { c: '#1DA1F2', l: 'Twitter', real: false },
              { c: '#25D366', l: 'Message', real: false },
              { c: 'ww', l: '우주워시', real: true },
              { c: '#FF3B30', l: 'Mail', real: false },
              { c: '#007AFF', l: 'Safari', real: false },
              { c: '#FFCC00', l: 'Photos', real: false },
              { c: '#FF9500', l: 'Music', real: false },
              { c: '#5856D6', l: 'Camera', real: false },
            ].map((a, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                {a.real ? (
                  <WWAppIcon size={56} bg={WW.ink} fg={WW.white}/>
                ) : (
                  <div style={{ width: 56, height: 56, borderRadius: 13, background: a.c, margin: '0 auto' }}/>
                )}
                <div style={{ fontSize: 9, color: WW.white, marginTop: 5, fontWeight: 500 }}>{a.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dark home */}
        <div style={{
          borderRadius: 24, padding: 24, aspectRatio: '9/14',
          background: 'radial-gradient(ellipse at top, #2B2432 0%, #0F0A14 100%)',
          position: 'relative',
        }}>
          <div style={{ color: WW.white, textAlign: 'center', marginTop: 8, marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.6 }}>금요일</div>
            <div style={{ fontSize: 56, fontWeight: 300, letterSpacing: -2, lineHeight: 1, opacity: 0.95 }}>24</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[
              { c: '#34C759', l: 'Maps' },
              { c: 'ww', l: '우주워시', real: true },
              { c: '#5AC8FA', l: 'Weather' },
              { c: '#AF52DE', l: 'Podcasts' },
              { c: '#FF2D55', l: 'Health' },
              { c: '#8E8E93', l: 'Notes' },
              { c: '#FF6B35', l: 'Uber' },
              { c: '#000000', l: 'Threads' },
            ].map((a, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                {a.real ? (
                  <WWAppIcon size={56} bg={WW.ink} fg={WW.white} outline/>
                ) : (
                  <div style={{ width: 56, height: 56, borderRadius: 13, background: a.c, margin: '0 auto', boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.08)' }}/>
                )}
                <div style={{ fontSize: 9, color: WW.white, marginTop: 5, fontWeight: 500 }}>{a.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

window.AppIconShowcase = AppIconShowcase;
