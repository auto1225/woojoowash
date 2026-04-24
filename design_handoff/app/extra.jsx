// 우주워시 — App: 예약내역 + 즐겨찾기

const AppReservations = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: WW.white }}>
    <WWStatus />
    <div style={{ padding: '0 20px 8px', background: WW.white }}>
      <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.4 }}>예약</div>
    </div>
    <div style={{ padding: '8px 16px 12px', display: 'flex', gap: 8, borderBottom: `1px solid ${WW.fog}` }}>
      <WWChip size="sm" active>예정 1</WWChip>
      <WWChip size="sm">이용 완료</WWChip>
      <WWChip size="sm">취소됨</WWChip>
    </div>

    <div style={{ flex: 1, overflow: 'auto', padding: '20px', background: WW.cloud, paddingBottom: 100 }}>
      {/* Upcoming */}
      <div style={{
        background: WW.white, borderRadius: 16, overflow: 'hidden',
        border: `1px solid ${WW.fog}`, marginBottom: 16,
      }}>
        <div style={{ padding: '16px 18px', background: WW.ink, color: WW.white, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <IconClock size={18} stroke={2}/>
            <div style={{ fontSize: 13, fontWeight: 700 }}>3시간 12분 후 이용</div>
          </div>
          <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 600 }}>D-day</div>
        </div>
        <div style={{ padding: 18 }}>
          <div style={{ fontSize: 11, color: WW.accent, fontWeight: 700, marginBottom: 6, letterSpacing: 0.5 }}>WJ-20260424-8821</div>
          <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 2, letterSpacing: -0.3 }}>우주워시 강남점</div>
          <div style={{ fontSize: 12, color: WW.slate, marginBottom: 14 }}>셀프세차 · BAY 3 · 60분</div>
          <div style={{ display: 'flex', gap: 8, borderTop: `1px solid ${WW.fog}`, paddingTop: 14 }}>
            <div style={{ flex: 1 }}><WWCTA variant="secondary" size="sm">취소</WWCTA></div>
            <div style={{ flex: 2 }}><WWCTA size="sm">QR 보기</WWCTA></div>
          </div>
        </div>
      </div>

      {/* Past example */}
      <div style={{ fontSize: 11, fontWeight: 700, color: WW.slate, letterSpacing: 0.5, margin: '20px 0 10px 4px' }}>LAST MONTH</div>
      {[
        { d: '4/20 금', t: '오후 3:00', name: '우주워시 강남점', type: '셀프 60분', done: true },
        { d: '4/12 목', t: '오전 11:30', name: '우주워시 역삼점', type: '손세차 프리미엄', done: true },
      ].map((r, i) => (
        <div key={i} style={{
          background: WW.white, borderRadius: 14, padding: 16, marginBottom: 10,
          border: `1px solid ${WW.fog}`, display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{ textAlign: 'center', width: 44 }}>
            <div style={{ fontSize: 11, color: WW.slate }}>{r.d.split(' ')[0]}</div>
            <div style={{ fontSize: 11, fontWeight: 700, marginTop: 2 }}>{r.d.split(' ')[1]}</div>
          </div>
          <div style={{ width: 1, alignSelf: 'stretch', background: WW.fog }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{r.name}</div>
            <div style={{ fontSize: 12, color: WW.slate }}>{r.t} · {r.type}</div>
          </div>
          <div style={{ fontSize: 11, color: WW.slate, fontWeight: 600 }}>리뷰 쓰기</div>
        </div>
      ))}
    </div>

    <WWTabBar active="res"/>
  </div>
);

const AppFav = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: WW.white }}>
    <WWStatus />
    <div style={{ padding: '0 20px 16px' }}>
      <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.4 }}>즐겨찾기</div>
    </div>

    <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 100px' }}>
      {[
        { name: '우주워시 강남점', dist: '0.4km', rating: 4.9, type: '셀프·손세차', visits: 12 },
        { name: '우주워시 역삼점', dist: '0.8km', rating: 4.8, type: '셀프·마켓', visits: 8 },
        { name: '우주워시 선릉점', dist: '1.2km', rating: 4.7, type: '프리미엄', visits: 2 },
      ].map((s, i) => (
        <div key={i} style={{
          padding: '14px 0', borderBottom: i < 2 ? `1px solid ${WW.fog}` : 'none',
          display: 'flex', gap: 12, alignItems: 'center',
        }}>
          <div style={{
            width: 68, height: 68, borderRadius: 12, flexShrink: 0,
            background: `linear-gradient(135deg, ${WW.cloud}, ${WW.fog})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconCarWash size={28} stroke={1.2} style={{ color: WW.graphite, opacity: 0.5 }}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{s.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <IconStarFill size={11} style={{ color: WW.ink }}/>
              <span style={{ fontSize: 11, fontWeight: 600 }}>{s.rating}</span>
              <span style={{ fontSize: 11, color: WW.ash }}>·</span>
              <span style={{ fontSize: 11, color: WW.slate }}>{s.dist}</span>
              <span style={{ fontSize: 11, color: WW.ash }}>·</span>
              <span style={{ fontSize: 11, color: WW.slate }}>{s.type}</span>
            </div>
            <div style={{ fontSize: 10, color: WW.accent, fontWeight: 700 }}>{s.visits}회 방문</div>
          </div>
          <IconHeartFill size={22} style={{ color: WW.ink }}/>
        </div>
      ))}
    </div>

    <WWTabBar active="fav"/>
  </div>
);

Object.assign(window, { AppReservations, AppFav });
