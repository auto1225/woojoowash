// 우주워시 — App Screen: Store Finder (지도 + 리스트)

const AppFinder = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: WW.white }}>
    <WWStatus />
    <WWNav title="매장 찾기" right={<IconFilter size={22} stroke={1.7} />} showBack border={false} />
    
    {/* Filters */}
    <div style={{ padding: '8px 16px 12px', display: 'flex', gap: 6, overflowX: 'auto', flexShrink: 0 }}>
      <WWChip size="sm" active>전체</WWChip>
      <WWChip size="sm">셀프</WWChip>
      <WWChip size="sm">손세차</WWChip>
      <WWChip size="sm">배달</WWChip>
      <WWChip size="sm">출장</WWChip>
      <WWChip size="sm">프리미엄</WWChip>
    </div>

    {/* Map */}
    <div style={{
      height: 240, position: 'relative', overflow: 'hidden',
      background: WW.cloud, flexShrink: 0,
    }}>
      {/* Fake minimalist map */}
      <svg viewBox="0 0 400 240" style={{ width: '100%', height: '100%', display: 'block' }}>
        <rect width="400" height="240" fill="#F2F2F4"/>
        {/* roads */}
        <path d="M0 80 L400 100" stroke="#E8E8EB" strokeWidth="18" fill="none"/>
        <path d="M0 180 L400 170" stroke="#E8E8EB" strokeWidth="14" fill="none"/>
        <path d="M120 0 L140 240" stroke="#E8E8EB" strokeWidth="16" fill="none"/>
        <path d="M280 0 L260 240" stroke="#E8E8EB" strokeWidth="12" fill="none"/>
        {/* blocks */}
        <rect x="20" y="105" width="100" height="60" fill="#FFFFFF" rx="2"/>
        <rect x="145" y="105" width="110" height="60" fill="#FFFFFF" rx="2"/>
        <rect x="270" y="105" width="100" height="60" fill="#FFFFFF" rx="2"/>
        <rect x="20" y="5" width="100" height="65" fill="#FFFFFF" rx="2"/>
        <rect x="145" y="10" width="110" height="75" fill="#FFFFFF" rx="2"/>
        <rect x="270" y="5" width="100" height="85" fill="#FFFFFF" rx="2"/>
        <rect x="20" y="180" width="100" height="55" fill="#FFFFFF" rx="2"/>
        <rect x="145" y="180" width="110" height="55" fill="#FFFFFF" rx="2"/>
        <rect x="270" y="180" width="100" height="55" fill="#FFFFFF" rx="2"/>
        {/* 지하철 */}
        <circle cx="210" cy="140" r="7" fill="#FFFFFF" stroke="#D4D4D9" strokeWidth="1.5"/>
        <text x="225" y="144" fontSize="9" fill="#6E6E73" fontWeight="500">강남역</text>
      </svg>
      
      {/* pins */}
      {[
        { x: 85, y: 130, price: '8K', active: true },
        { x: 200, y: 75, price: '25K' },
        { x: 310, y: 160, price: '15K' },
        { x: 60, y: 60, price: '30K' },
      ].map((p, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${(p.x/400)*100}%`, top: `${(p.y/240)*100}%`,
          transform: 'translate(-50%, -100%)',
        }}>
          <div style={{
            padding: '5px 10px', borderRadius: 999,
            background: p.active ? WW.ink : WW.white,
            color: p.active ? WW.white : WW.ink,
            fontSize: 11, fontWeight: 700,
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            border: p.active ? 'none' : `1px solid ${WW.fog}`,
            whiteSpace: 'nowrap',
          }}>
            {p.price}
          </div>
          <div style={{
            width: 0, height: 0, margin: '0 auto',
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: `6px solid ${p.active ? WW.ink : WW.white}`,
          }} />
        </div>
      ))}

      {/* My location */}
      <div style={{
        position: 'absolute', top: 130, left: 150, transform: 'translate(-50%, -50%)',
        width: 14, height: 14, borderRadius: 7,
        background: WW.accent, border: `3px solid ${WW.white}`,
        boxShadow: '0 0 0 6px rgba(30,64,255,0.15)',
      }} />

      {/* Re-search button */}
      <div style={{
        position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
        padding: '8px 14px', borderRadius: 999,
        background: WW.ink, color: WW.white,
        fontSize: 12, fontWeight: 600,
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <IconSearch size={14} stroke={2} /> 이 지역 재검색
      </div>
    </div>

    {/* List header */}
    <div style={{
      padding: '16px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      <div>
        <div style={{ fontSize: 11, color: WW.slate, fontWeight: 500, marginBottom: 2 }}>반경 2km 내</div>
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.4 }}>12개 매장</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: WW.ink }}>
        거리순 <IconDown size={14} stroke={2} />
      </div>
    </div>

    {/* List */}
    <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 100px' }}>
      {[
        { name: '우주워시 강남점', dist: '0.4km', rating: 4.9, reviews: 284, type: ['셀프','손세차'], price: 8000, open: true },
        { name: '우주워시 역삼점', dist: '0.8km', rating: 4.8, reviews: 512, type: ['셀프','마켓'], price: 8000, open: true },
        { name: '우주워시 선릉점', dist: '1.2km', rating: 4.7, reviews: 198, type: ['손세차','프리미엄'], price: 25000, open: true },
        { name: '우주워시 삼성점', dist: '1.6km', rating: 4.9, reviews: 341, type: ['출장세차'], price: 35000, open: false },
      ].map((s, i) => (
        <div key={i} style={{
          padding: '14px 0', borderBottom: i < 3 ? `1px solid ${WW.fog}` : 'none',
          display: 'flex', gap: 12,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: 12, flexShrink: 0,
            background: `linear-gradient(135deg, ${WW.cloud}, ${WW.fog})`,
            position: 'relative', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconCarWash size={30} style={{ color: WW.graphite, opacity: 0.55 }} stroke={1.2}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{s.name}</div>
              <div style={{
                fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                background: s.open ? WW.ink : WW.fog,
                color: s.open ? WW.white : WW.slate,
              }}>{s.open ? '영업중' : '영업종료'}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <IconStarFill size={11} style={{ color: WW.ink }}/>
              <span style={{ fontSize: 11, fontWeight: 600 }}>{s.rating}</span>
              <span style={{ fontSize: 11, color: WW.slate }}>({s.reviews})</span>
              <span style={{ fontSize: 11, color: WW.ash }}>·</span>
              <span style={{ fontSize: 11, color: WW.slate }}>{s.dist}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {s.type.map(t => (
                  <span key={t} style={{
                    fontSize: 10, fontWeight: 600, padding: '2px 7px',
                    borderRadius: 4, background: WW.cloud, color: WW.graphite,
                  }}>{t}</span>
                ))}
              </div>
              <div style={{ fontSize: 13, fontWeight: 800 }} className="ww-num">{s.price.toLocaleString()}원~</div>
            </div>
          </div>
        </div>
      ))}
    </div>

    <WWTabBar active="home" />
  </div>
);

window.AppFinder = AppFinder;
