// 우주워시 — App Screen: Home (메인)

const AppHome = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: WW.white }}>
    <WWStatus />
    
    {/* Header */}
    <div style={{
      padding: '4px 20px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: WW.white, flexShrink: 0,
    }}>
      <WWLogo size={18} compact />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <IconBell size={22} stroke={1.6} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: 6, height: 6, borderRadius: 3, background: WW.accent }} />
        </div>
      </div>
    </div>

    <div style={{ flex: 1, overflow: 'auto', paddingBottom: 90 }}>
      {/* Location + Search */}
      <div style={{ padding: '0 20px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
          <IconPin size={16} stroke={1.8} />
          <div style={{ fontSize: 13, fontWeight: 600, color: WW.ink }}>서울 강남구 역삼동</div>
          <IconDown size={14} stroke={2} style={{ color: WW.slate }} />
        </div>
        <div className="ww-disp" style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.7, lineHeight: 1.15, color: WW.ink }}>
          오늘도 빛나는<br/>드라이브 되세요
        </div>
      </div>

      {/* Search bar */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{
          height: 48, background: WW.cloud, borderRadius: 12,
          display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px',
        }}>
          <IconSearch size={18} stroke={1.8} style={{ color: WW.slate }} />
          <div style={{ fontSize: 14, color: WW.slate, flex: 1 }}>내 주변 세차장을 찾아보세요</div>
        </div>
      </div>

      {/* Service grid */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { name: '셀프세차', icon: IconSpray, hint: 'BAY 예약' },
            { name: '손세차', icon: IconBucket, hint: '매장 방문' },
            { name: '배달세차', icon: IconTruck, hint: '픽업·딜리버리', accent: true },
            { name: '출장세차', icon: IconCarWash, hint: '방문 서비스' },
            { name: '프리미엄', icon: IconSparkle, hint: '자동세차' },
            { name: '마켓', icon: IconGift, hint: '세차용품' },
          ].map((s, i) => (
            <div key={i} style={{
              aspectRatio: '1/1', borderRadius: 16, padding: 14,
              background: s.accent ? WW.ink : WW.cloud,
              color: s.accent ? WW.white : WW.ink,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              position: 'relative',
            }}>
              <div style={{ color: s.accent ? WW.white : WW.ink }}>
                <s.icon size={22} stroke={1.5} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: -0.3 }}>{s.name}</div>
                <div style={{ fontSize: 10, fontWeight: 500, opacity: 0.55, marginTop: 2 }}>{s.hint}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Banner: 할인패스 */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{
          borderRadius: 16, padding: '20px 22px',
          background: `linear-gradient(135deg, ${WW.ink} 0%, ${WW.charcoal} 100%)`,
          color: WW.white, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, borderRadius: '50%', border: `1px solid rgba(255,255,255,0.08)` }} />
          <div style={{ position: 'absolute', right: -40, top: -40, width: 180, height: 180, borderRadius: '50%', border: `1px solid rgba(255,255,255,0.05)` }} />
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5, opacity: 0.6, marginBottom: 6 }}>MEMBERSHIP</div>
          <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.3, marginBottom: 10, letterSpacing: -0.3 }}>
            할인패스 구독하고<br/>세차비 최대 50% 할인
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '7px 12px', borderRadius: 999,
            background: WW.white, color: WW.ink,
            fontSize: 12, fontWeight: 700,
          }}>
            자세히 보기 <IconArrow size={12} stroke={2.2} />
          </div>
        </div>
      </div>

      {/* 내 차량 */}
      <div style={{ padding: '0 20px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.4 }}>내 차량</div>
          <div style={{ fontSize: 12, color: WW.slate, fontWeight: 500 }}>관리</div>
        </div>
        <WWCard padding={16} style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: WW.cloud, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconCar size={22} stroke={1.6} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>현대 그랜저 IG</div>
              <div style={{ fontSize: 11, color: WW.slate, fontWeight: 500 }}>12가 3456 · 펄 화이트</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: WW.slate, fontWeight: 500 }}>최근 세차</div>
              <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2 }}>4일 전</div>
            </div>
          </div>
        </WWCard>
      </div>

      {/* Nearby 매장 */}
      <div style={{ padding: '24px 20px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: WW.slate, letterSpacing: 0.5, marginBottom: 2 }}>NEARBY</div>
            <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.4 }}>지금 예약 가능한 매장</div>
          </div>
          <div style={{ fontSize: 12, color: WW.slate, fontWeight: 500 }}>전체</div>
        </div>

        {[
          { name: '우주워시 강남점', dist: '0.8km', rating: 4.9, reviews: 284, type: '손세차·출장', price: 25000, slots: '오늘 14:30 가능' },
          { name: '우주워시 역삼점', dist: '1.2km', rating: 4.8, reviews: 512, type: '셀프세차·마켓', price: 8000, slots: '즉시 이용 가능' },
        ].map((s, i) => (
          <div key={i} style={{
            marginBottom: 12, padding: 14, borderRadius: 16,
            border: `1px solid ${WW.fog}`, background: WW.white,
            display: 'flex', gap: 14,
          }}>
            <div style={{
              width: 82, height: 82, borderRadius: 12, flexShrink: 0,
              background: `linear-gradient(135deg, ${WW.cloud}, ${WW.fog})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 30% 30%, ${WW.white}, transparent 60%)`, opacity: 0.6 }}/>
              <IconCarWash size={32} stroke={1.2} style={{ color: WW.graphite, opacity: 0.6 }}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{s.name}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <IconStarFill size={11} style={{ color: WW.ink }}/>
                <span style={{ fontSize: 11, fontWeight: 600 }}>{s.rating}</span>
                <span style={{ fontSize: 11, color: WW.slate }}>({s.reviews})</span>
                <span style={{ fontSize: 11, color: WW.ash }}>·</span>
                <span style={{ fontSize: 11, color: WW.slate }}>{s.dist}</span>
                <span style={{ fontSize: 11, color: WW.ash }}>·</span>
                <span style={{ fontSize: 11, color: WW.slate }}>{s.type}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 11, color: WW.accent, fontWeight: 700 }}>{s.slots}</div>
                <div style={{ fontSize: 13, fontWeight: 800 }} className="ww-num">{s.price.toLocaleString()}원~</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <WWTabBar active="home" />
  </div>
);

window.AppHome = AppHome;
