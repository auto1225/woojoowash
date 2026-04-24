// 우주워시 — Web Landing Page (homepage in browser frame)

const WebLanding = () => (
  <div style={{ 
    background: WW.white, fontFamily: WW.fontKR, color: WW.ink,
    minHeight: '100%', overflow: 'auto',
  }}>
    {/* Nav */}
    <div style={{
      padding: '20px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: `1px solid ${WW.fog}`, position: 'sticky', top: 0, background: WW.white, zIndex: 10,
    }}>
      <WWLogo size={20}/>
      <div style={{ display: 'flex', gap: 32, fontSize: 14, fontWeight: 600 }}>
        <span>서비스</span><span>매장 찾기</span><span>할인패스</span><span>제휴·입점</span><span>고객센터</span>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: WW.graphite }}>로그인</div>
        <div style={{ padding: '9px 16px', borderRadius: 999, background: WW.ink, color: WW.white, fontSize: 13, fontWeight: 700 }}>앱 다운로드</div>
      </div>
    </div>

    {/* HERO */}
    <div style={{ padding: '80px 48px 100px', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 60, alignItems: 'center' }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: WW.accent, letterSpacing: 1, marginBottom: 20 }}>CAR WASH RESERVATION · 세차 예약 플랫폼</div>
        <div className="ww-disp" style={{ fontSize: 62, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, marginBottom: 24 }}>
          내 차를 빛나게<br/>
          <span style={{ color: WW.ink, position: 'relative' }}>
            만드는 가장
            <svg style={{ position: 'absolute', bottom: -8, left: 0, width: '100%' }} viewBox="0 0 200 8"><path d="M2 6 Q50 2 100 4 T198 3" stroke={WW.accent} strokeWidth="3" fill="none" strokeLinecap="round"/></svg>
          </span><br/>
          쉬운 방법
        </div>
        <div style={{ fontSize: 16, color: WW.slate, lineHeight: 1.6, marginBottom: 36, maxWidth: 460 }}>
          셀프세차부터 프리미엄 손세차, 픽업 배달까지.<br/>
          전국 450개 매장을 우주워시 한 앱에서 예약하세요.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{
            padding: '16px 22px', borderRadius: 14, background: WW.ink, color: WW.white,
            display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 700,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12-.99.362-2.02 1.01-2.8.73-.87 1.99-1.54 3.154-1.85zM19.8 17.6c-.47 1.04-.71 1.5-1.32 2.42-.85 1.28-2.05 2.87-3.54 2.88-1.32.01-1.66-.86-3.45-.85-1.79.01-2.17.87-3.49.86-1.49-.01-2.63-1.45-3.48-2.73C2.16 16.35 1.86 11.45 3.64 9.1 4.89 7.36 6.89 6.4 8.75 6.4c1.9 0 3.09.99 4.66.99 1.53 0 2.45-.99 4.65-.99 1.66 0 3.42.9 4.68 2.47-4.12 2.25-3.45 8.14-2.94 8.74z"/></svg>
            App Store
          </div>
          <div style={{
            padding: '16px 22px', borderRadius: 14, background: WW.white, color: WW.ink,
            border: `1.5px solid ${WW.ink}`,
            display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 700,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5V3.5c0-.3.2-.6.5-.7L14 12 3.5 21.2c-.3-.1-.5-.4-.5-.7zM14.5 12.5l2.4 2.4-11 6.3 8.6-8.7zM16.9 9.6L14.5 12 5.9 3.3l11 6.3zM20.2 12.5c.5-.3.8-.8.8-1.3s-.3-1-.8-1.3l-2.6-1.5L15 11l2.6 2.6 2.6-1.1z"/></svg>
            Google Play
          </div>
        </div>
        <div style={{ display: 'flex', gap: 32, marginTop: 48 }}>
          {[{k: '450+', v: '전국 매장'}, {k: '24만+', v: '누적 이용자'}, {k: '4.9', v: '앱 평점'}].map((s, i) => (
            <div key={i}>
              <div className="ww-disp" style={{ fontSize: 28, fontWeight: 800 }}>{s.k}</div>
              <div style={{ fontSize: 12, color: WW.slate, marginTop: 2 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Phone mockup */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: 280, height: 560, background: WW.ink, borderRadius: 40, padding: 10,
          boxShadow: '0 40px 80px rgba(0,0,0,0.2)', transform: 'rotate(-3deg)',
        }}>
          <div style={{ width: '100%', height: '100%', background: WW.white, borderRadius: 30, overflow: 'hidden', padding: 20, position: 'relative' }}>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 30, letterSpacing: -0.5 }}>오늘도 빛나는<br/>드라이브 되세요</div>
            <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
              {['셀프', '손세차', '배달', '출장', '프리미엄', '마켓'].map((t, i) => (
                <div key={i} style={{
                  aspectRatio: 1, borderRadius: 10, padding: 8,
                  background: i === 2 ? WW.ink : WW.cloud,
                  color: i === 2 ? WW.white : WW.ink,
                  display: 'flex', alignItems: 'flex-end',
                  fontSize: 10, fontWeight: 700,
                }}>{t}</div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: 14, background: WW.ink, borderRadius: 12, color: WW.white }}>
              <div style={{ fontSize: 9, opacity: 0.6, marginBottom: 2 }}>MEMBERSHIP</div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>할인패스 50% 할인</div>
            </div>
          </div>
        </div>
        <div style={{
          position: 'absolute', right: 20, bottom: 40,
          width: 160, height: 100, background: WW.white,
          borderRadius: 14, padding: 14, border: `1px solid ${WW.fog}`,
          boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
          transform: 'rotate(5deg)',
        }}>
          <div style={{ fontSize: 10, color: WW.accent, fontWeight: 700, marginBottom: 4 }}>NEXT BOOKING</div>
          <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 4 }}>강남점 · 14:30</div>
          <div style={{ fontSize: 10, color: WW.slate }}>셀프세차 60분</div>
        </div>
      </div>
    </div>

    {/* SERVICES */}
    <div style={{ padding: '100px 48px', background: WW.cloud }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: WW.accent, letterSpacing: 1.5, marginBottom: 16 }}>OUR SERVICES</div>
        <div className="ww-disp" style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1.2, lineHeight: 1.1 }}>
          원하는 방식대로, 어디서든
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[
          { i: IconSpray, name: '셀프세차', desc: '가까운 매장에서 30분 단위로 BAY를 예약하세요' },
          { i: IconBucket, name: '손세차', desc: '전문 디테일러가 책임지는 프리미엄 손세차' },
          { i: IconTruck, name: '배달세차', desc: '차를 두고 가시면 세차해서 가져다 드려요' },
          { i: IconCarWash, name: '출장세차', desc: '주차장으로 직접 찾아가는 출장 서비스' },
        ].map((s, i) => (
          <div key={i} style={{
            background: WW.white, borderRadius: 20, padding: '36px 32px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14, background: WW.ink, color: WW.white,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
            }}>
              <s.i size={28} stroke={1.5}/>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, letterSpacing: -0.4 }}>{s.name}</div>
            <div style={{ fontSize: 14, color: WW.slate, lineHeight: 1.6, marginBottom: 20 }}>{s.desc}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700 }}>
              자세히 보기 <IconArrow size={14} stroke={2.5}/>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* HOW IT WORKS */}
    <div style={{ padding: '100px 48px' }}>
      <div style={{ marginBottom: 56 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: WW.accent, letterSpacing: 1.5, marginBottom: 16 }}>HOW IT WORKS</div>
        <div className="ww-disp" style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1.2, lineHeight: 1.1, maxWidth: 600 }}>
          단 세 번의 탭으로 끝내는 세차 예약
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
        {[
          { n: '01', t: '매장 찾기', d: '지도로 가장 가까운 매장을 빠르게 검색' },
          { n: '02', t: '시간 예약', d: '원하는 날짜·시간을 30분 단위로 선택' },
          { n: '03', t: '빛나는 결과', d: 'QR로 입장, before/after로 기록' },
        ].map((s, i) => (
          <div key={i}>
            <div style={{
              fontSize: 72, fontWeight: 800, letterSpacing: -3,
              color: WW.fog, lineHeight: 1, marginBottom: 20,
            }} className="ww-disp">{s.n}</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, letterSpacing: -0.4 }}>{s.t}</div>
            <div style={{ fontSize: 14, color: WW.slate, lineHeight: 1.6 }}>{s.d}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Membership CTA */}
    <div style={{ padding: '0 48px 100px' }}>
      <div style={{
        background: WW.ink, borderRadius: 28, padding: '72px 60px', color: WW.white,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -100, top: -100, width: 400, height: 400, borderRadius: '50%', border: `1px solid rgba(255,255,255,0.08)` }}/>
        <div style={{ position: 'absolute', right: -200, top: -200, width: 600, height: 600, borderRadius: '50%', border: `1px solid rgba(255,255,255,0.05)` }}/>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: WW.accent, letterSpacing: 1.5, marginBottom: 14 }}>MEMBERSHIP</div>
          <div className="ww-disp" style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1.2, lineHeight: 1.1, marginBottom: 20 }}>
            할인패스로<br/>세차비 반값
          </div>
          <div style={{ fontSize: 15, opacity: 0.7, lineHeight: 1.6, marginBottom: 32, maxWidth: 360 }}>
            월 9,900원부터 시작하는 세차 정기권.<br/>
            첫 달은 50% 할인된 가격으로 경험하세요.
          </div>
          <div style={{ display: 'inline-flex', padding: '14px 24px', borderRadius: 999, background: WW.white, color: WW.ink, fontSize: 14, fontWeight: 700, gap: 6, alignItems: 'center' }}>
            할인패스 둘러보기 <IconArrow size={14} stroke={2.5}/>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
          {[
            { n: '라이트', p: '9,900', d: '셀프세차 30% 할인' },
            { n: '스탠다드', p: '19,900', d: '셀프·손세차 40% 할인', hot: true },
            { n: '프리미엄', p: '29,900', d: '모든 서비스 50% + 픽업 무료' },
          ].map((p, i) => (
            <div key={i} style={{
              background: p.hot ? WW.white : 'rgba(255,255,255,0.08)',
              color: p.hot ? WW.ink : WW.white,
              borderRadius: 14, padding: '18px 22px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 2 }}>{p.n}</div>
                <div style={{ fontSize: 11, opacity: 0.65 }}>{p.d}</div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800 }} className="ww-num">{p.p}원</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Partner CTA */}
    <div style={{ padding: '80px 48px', background: WW.cloud }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: WW.accent, letterSpacing: 1.5, marginBottom: 14 }}>PARTNERSHIP</div>
          <div className="ww-disp" style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1, lineHeight: 1.15, marginBottom: 16 }}>
            사장님이세요?<br/>우주워시에 입점하세요
          </div>
          <div style={{ fontSize: 14, color: WW.slate, lineHeight: 1.6, marginBottom: 24 }}>
            월 평균 매출 142% 상승, 공실 시간대 활용도 3배 증가. 우주워시 파트너로 시작하세요.
          </div>
          <div style={{ display: 'inline-flex', padding: '14px 24px', borderRadius: 999, background: WW.ink, color: WW.white, fontSize: 14, fontWeight: 700, gap: 6, alignItems: 'center' }}>
            입점 문의하기 <IconArrow size={14} stroke={2.5}/>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { k: '142%', v: '평균 매출 상승' },
            { k: '3x', v: '공실 시간 활용' },
            { k: '24만+', v: '활성 이용자' },
            { k: '0원', v: '입점 수수료' },
          ].map((s, i) => (
            <div key={i} style={{ background: WW.white, borderRadius: 14, padding: 22 }}>
              <div className="ww-disp" style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6 }}>{s.k}</div>
              <div style={{ fontSize: 12, color: WW.slate, marginTop: 4 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* FAQ */}
    <div style={{ padding: '80px 48px', maxWidth: 920, margin: '0 auto' }}>
      <div className="ww-disp" style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1, marginBottom: 40 }}>자주 묻는 질문</div>
      {[
        { q: '예약 취소는 언제까지 가능한가요?', a: '이용 1시간 전까지 무료 취소 가능합니다.' },
        { q: 'Before / After 사진은 어떻게 저장되나요?' },
        { q: '할인패스는 중도 해지할 수 있나요?' },
        { q: '출장세차는 어느 지역까지 되나요?' },
        { q: '결제한 금액의 영수증을 받을 수 있나요?' },
      ].map((f, i) => (
        <div key={i} style={{
          padding: '24px 4px', borderTop: `1px solid ${WW.fog}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
        }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{f.q}</div>
          <IconPlus size={20} stroke={2} style={{ color: WW.slate }}/>
        </div>
      ))}
    </div>

    {/* Footer */}
    <div style={{ padding: '60px 48px 40px', background: WW.ink, color: WW.white }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
        <div>
          <WWLogo size={20} dark/>
          <div style={{ fontSize: 12, opacity: 0.5, lineHeight: 1.6, marginTop: 16, maxWidth: 280 }}>
            (주) 우주워시 · 대표 김우주<br/>
            서울 강남구 테헤란로 123, 12층<br/>
            사업자 123-45-67890 · 통신판매 2026-서울강남-0000
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12, opacity: 0.5 }}>서비스</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
            <span>셀프세차</span><span>손세차</span><span>배달세차</span><span>출장세차</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12, opacity: 0.5 }}>회사</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
            <span>회사 소개</span><span>제휴·입점</span><span>채용</span><span>뉴스룸</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12, opacity: 0.5 }}>앱 다운로드</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
            <div style={{ padding: '10px 14px', border: `1px solid rgba(255,255,255,0.2)`, borderRadius: 10, fontSize: 12 }}>App Store</div>
            <div style={{ padding: '10px 14px', border: `1px solid rgba(255,255,255,0.2)`, borderRadius: 10, fontSize: 12 }}>Google Play</div>
          </div>
        </div>
      </div>
      <div style={{ borderTop: `1px solid rgba(255,255,255,0.1)`, paddingTop: 20, display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.4 }}>
        <div>© 2026 WoojooWash Inc. All rights reserved.</div>
        <div style={{ display: 'flex', gap: 20 }}><span>이용약관</span><span>개인정보처리방침</span><span>위치기반서비스</span></div>
      </div>
    </div>
  </div>
);

window.WebLanding = WebLanding;
