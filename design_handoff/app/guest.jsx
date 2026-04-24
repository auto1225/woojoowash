// 우주워시 — Guest Mode Screens (로그인 안 한 상태에서 둘러보기)

const AppHomeGuest = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: WW.white }}>
    <WWStatus />
    
    {/* Header */}
    <div style={{
      padding: '4px 20px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: WW.white, flexShrink: 0,
    }}>
      <WWLogo size={18} compact />
      <div style={{
        padding: '7px 12px', borderRadius: 999,
        background: WW.ink, color: WW.white,
        fontSize: 11.5, fontWeight: 700,
      }}>로그인</div>
    </div>

    <div style={{ flex: 1, overflow: 'auto', paddingBottom: 160 }}>
      {/* Guest banner */}
      <div style={{ padding: '0 20px 14px' }}>
        <div style={{
          padding: '10px 14px', borderRadius: 10, background: WW.cloud,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: WW.white,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid ${WW.fog}`,
          }}>
            <IconSparkle size={14} stroke={1.8}/>
          </div>
          <div style={{ flex: 1, fontSize: 11.5, color: WW.graphite, lineHeight: 1.4 }}>
            <b>둘러보기 모드</b> · 가입 없이 체험 중이에요
          </div>
          <div style={{ fontSize: 11, color: WW.accent, fontWeight: 700 }}>가입</div>
        </div>
      </div>

      {/* Location + Headline */}
      <div style={{ padding: '0 20px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
          <IconPin size={16} stroke={1.8} />
          <div style={{ fontSize: 13, fontWeight: 600, color: WW.ink }}>서울 강남구 역삼동</div>
          <IconDown size={14} stroke={2} style={{ color: WW.slate }} />
        </div>
        <div className="ww-disp" style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.7, lineHeight: 1.15 }}>
          내 주변 450개<br/>세차장을 둘러보세요
        </div>
      </div>

      {/* Search bar */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{
          height: 48, background: WW.cloud, borderRadius: 12,
          display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px',
        }}>
          <IconSearch size={18} stroke={1.8} style={{ color: WW.slate }} />
          <div style={{ fontSize: 14, color: WW.slate, flex: 1 }}>세차장 이름 · 지역 검색</div>
        </div>
      </div>

      {/* Service grid */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { name: '셀프세차', icon: IconSpray },
            { name: '손세차', icon: IconBucket },
            { name: '배달세차', icon: IconTruck, accent: true },
            { name: '출장세차', icon: IconCarWash },
            { name: '프리미엄', icon: IconSparkle },
            { name: '마켓', icon: IconGift },
          ].map((s, i) => (
            <div key={i} style={{
              aspectRatio: '1/1', borderRadius: 16, padding: 14,
              background: s.accent ? WW.ink : WW.cloud,
              color: s.accent ? WW.white : WW.ink,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <s.icon size={22} stroke={1.5} />
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: -0.3 }}>{s.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Nearby stores preview */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3 }}>근처 인기 세차장</div>
          <div style={{ fontSize: 11, color: WW.slate, fontWeight: 600 }}>전체</div>
        </div>
        {[
          { name: '우주워시 강남점', rating: 4.9, dist: '0.4km', type: '셀프·손세차', price: 8000 },
          { name: '우주워시 역삼점', rating: 4.8, dist: '0.8km', type: '셀프·마켓', price: 7000 },
        ].map((s, i) => (
          <div key={i} style={{
            padding: '14px 0', borderBottom: i < 1 ? `1px solid ${WW.fog}` : 'none',
            display: 'flex', gap: 12, alignItems: 'center',
          }}>
            <div style={{
              width: 68, height: 68, borderRadius: 12, flexShrink: 0,
              background: `linear-gradient(135deg, ${WW.cloud}, ${WW.fog})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <IconCarWash size={26} stroke={1.2} style={{ color: WW.graphite, opacity: 0.5 }}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{s.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <IconStarFill size={11} style={{ color: WW.ink }}/>
                <span style={{ fontSize: 11, fontWeight: 600 }}>{s.rating}</span>
                <span style={{ fontSize: 11, color: WW.ash }}>·</span>
                <span style={{ fontSize: 11, color: WW.slate }}>{s.dist}</span>
                <span style={{ fontSize: 11, color: WW.ash }}>·</span>
                <span style={{ fontSize: 11, color: WW.slate }}>{s.type}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 800 }} className="ww-num">{s.price.toLocaleString()}원~</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Persistent guest CTA above tab bar */}
    <div style={{
      position: 'absolute', bottom: 80, left: 0, right: 0,
      padding: '0 16px', zIndex: 35,
    }}>
      <div style={{
        background: WW.ink, color: WW.white,
        borderRadius: 14, padding: '14px 18px',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 8px 24px rgba(10,10,11,0.25)',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 2 }}>3초 가입하고 시작하기</div>
          <div style={{ fontSize: 10.5, opacity: 0.6 }}>첫 결제 3,000원 쿠폰 받기</div>
        </div>
        <IconArrow size={18} stroke={2.2}/>
      </div>
    </div>

    <WWTabBar active="home" />
  </div>
);

window.AppHomeGuest = AppHomeGuest;
