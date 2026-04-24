// 우주워시 — App Screen: Store Detail & Booking flow
// (매장 상세 + 날짜/시간/분 선택 + 결제)

const AppStore = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: WW.cloud }}>
    <WWStatus />

    {/* Photo header */}
    <div style={{
      height: 220, position: 'relative', flexShrink: 0,
      background: `linear-gradient(135deg, ${WW.graphite}, ${WW.ink})`,
      overflow: 'hidden',
    }}>
      {/* Stylized wash scene */}
      <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="sh" cx="60%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#3A3A3D"/>
            <stop offset="100%" stopColor="#0A0A0B"/>
          </radialGradient>
        </defs>
        <rect width="400" height="220" fill="url(#sh)"/>
        {/* Bubbles */}
        {[...Array(22)].map((_, i) => (
          <circle key={i} cx={((i*37)%400)} cy={20 + ((i*53)%180)} r={2 + (i%4)} fill="#fff" opacity={0.07 + ((i%5)*0.04)}/>
        ))}
        {/* Car silhouette */}
        <path d="M60 160 Q70 130 105 125 L140 118 Q180 110 220 115 L280 120 Q320 125 340 140 L355 160 L355 180 L60 180 Z" fill="#1C1C1F" opacity="0.85"/>
        <path d="M140 118 L155 135 L285 135 L290 120" fill="none" stroke="#6E6E73" strokeWidth="1" opacity="0.4"/>
        <circle cx="110" cy="180" r="13" fill="#0A0A0B"/>
        <circle cx="300" cy="180" r="13" fill="#0A0A0B"/>
        <circle cx="110" cy="180" r="6" fill="#3A3A3D"/>
        <circle cx="300" cy="180" r="6" fill="#3A3A3D"/>
        {/* Light reflection on car */}
        <path d="M180 125 Q200 118 230 120" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.3"/>
      </svg>
      
      {/* Nav overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '8px 16px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconBack size={20} stroke={2} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[IconHeart, IconDots].map((I, i) => (
            <div key={i} style={{
              width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <I size={20} stroke={1.7} />
            </div>
          ))}
        </div>
      </div>

      {/* Photo count */}
      <div style={{
        position: 'absolute', bottom: 12, right: 14,
        padding: '4px 10px', borderRadius: 999,
        background: 'rgba(0,0,0,0.5)', color: WW.white,
        fontSize: 11, fontWeight: 600,
      }}>1 / 8</div>
    </div>

    <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
      {/* Store info */}
      <div style={{ background: WW.white, padding: '20px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
            background: WW.ink, color: WW.white,
          }}>영업중</span>
          <span style={{ fontSize: 11, color: WW.slate, fontWeight: 500 }}>셀프세차 · 손세차 · 마켓</span>
        </div>
        <div className="ww-disp" style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginBottom: 6 }}>
          우주워시 강남점
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <IconStarFill size={14} style={{ color: WW.ink }} />
          <span style={{ fontSize: 13, fontWeight: 700 }}>4.9</span>
          <span style={{ fontSize: 13, color: WW.slate }}>(284 리뷰)</span>
          <span style={{ color: WW.ash }}>·</span>
          <span style={{ fontSize: 13, color: WW.slate }}>0.4km</span>
        </div>
        <div style={{ 
          padding: '12px 14px', borderRadius: 10, background: WW.cloud,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <IconPin size={16} stroke={1.7} style={{ color: WW.slate, flexShrink: 0 }}/>
          <div style={{ fontSize: 12, color: WW.graphite, fontWeight: 500, flex: 1 }}>서울 강남구 테헤란로 123, 지하1층</div>
          <IconArrow size={14} stroke={2} style={{ color: WW.slate }}/>
        </div>
      </div>

      <WWSectionGap size={8} />

      {/* 사용시간 */}
      <div style={{ background: WW.white, padding: '20px 0' }}>
        <div style={{ padding: '0 20px 14px', display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.3 }}>사용시간</div>
          <div style={{ fontSize: 11, color: WW.slate }}>30분 단위</div>
        </div>
        <div style={{ display: 'flex', gap: 8, padding: '0 20px', overflowX: 'auto' }}>
          {['30분', '60분', '90분', '120분', '150분', '180분'].map((t, i) => (
            <WWCircleChip key={t} active={i === 1}>{t}</WWCircleChip>
          ))}
        </div>
      </div>

      <div style={{ height: 1, background: WW.fog, margin: '0 20px' }}/>

      {/* 날짜 */}
      <div style={{ background: WW.white, padding: '20px 0 22px' }}>
        <div style={{ padding: '0 20px 14px', fontSize: 15, fontWeight: 800, letterSpacing: -0.3 }}>
          4월 24일 금요일
        </div>
        <div style={{ display: 'flex', gap: 8, padding: '0 20px', overflowX: 'auto' }}>
          {[
            { d: 24, w: '오늘', active: true },
            { d: 25, w: '토', ring: true },
            { d: 26, w: '일', ring: true, weekend: true },
            { d: 27, w: '월' },
            { d: 28, w: '화' },
            { d: 29, w: '수' },
            { d: 30, w: '목' },
          ].map((d, i) => (
            <div key={i} style={{ textAlign: 'center', flexShrink: 0 }}>
              <WWCircleChip 
                active={d.active} 
                ring={d.ring}
                ringColor={d.weekend ? WW.danger : WW.ink}
              >
                <span style={d.weekend && !d.active ? { color: WW.danger, fontWeight: 700 } : {}}>{d.d}</span>
              </WWCircleChip>
              <div style={{ 
                fontSize: 11, marginTop: 6, fontWeight: 500,
                color: d.weekend ? WW.danger : WW.slate,
              }}>{d.w}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 1, background: WW.fog, margin: '0 20px' }}/>

      {/* 시간 */}
      <div style={{ background: WW.white, padding: '20px 20px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.3 }}>시작 시간</div>
          <div style={{ display: 'flex', gap: 10, fontSize: 11, color: WW.slate }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, border: `1.5px solid ${WW.ink}`, background: WW.white }}/>
              선택 가능
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: WW.mist }}/>
              선택 불가
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <WWChip size="sm">오전</WWChip>
          <WWChip size="sm" active>오후</WWChip>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {['12시','13시','14시','15시','16시','17시','18시','19시','20시','21시','22시','23시'].map((t, i) => {
            const active = t === '14시';
            const disabled = ['19시','20시'].includes(t);
            return (
              <div key={t} style={{
                height: 44, borderRadius: 999,
                background: active ? WW.ink : disabled ? WW.cloud : WW.white,
                color: active ? WW.white : disabled ? WW.ash : WW.ink,
                border: `1px solid ${active ? WW.ink : WW.fog}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: active ? 700 : 500,
              }}>{t}</div>
            );
          })}
        </div>
      </div>

      <div style={{ height: 1, background: WW.fog, margin: '0 20px' }}/>

      {/* 분 */}
      <div style={{ background: WW.white, padding: '20px 20px 22px' }}>
        <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.3, marginBottom: 14 }}>
          시작하실 분을 선택해주세요
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
          {['0분','10분','20분','30분','40분','50분'].map((t) => (
            <div key={t} style={{
              height: 44, borderRadius: 999,
              background: t === '30분' ? WW.ink : WW.white,
              color: t === '30분' ? WW.white : WW.ink,
              border: `1px solid ${t === '30분' ? WW.ink : WW.fog}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: t === '30분' ? 700 : 500,
            }}>{t}</div>
          ))}
        </div>
      </div>

      <WWSectionGap />

      {/* Car card */}
      <div style={{ background: WW.white, padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: WW.cloud, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconCar size={22} stroke={1.6} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>현대 그랜저 IG</div>
            <div style={{ fontSize: 12, color: WW.slate, fontWeight: 500 }}>12가 3456</div>
          </div>
          <div style={{ fontSize: 13, color: WW.accent, fontWeight: 600 }}>차량 변경</div>
        </div>
      </div>

      <div style={{ height: 20 }}/>

      {/* Membership promo */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          borderRadius: 14, padding: '16px 18px',
          background: WW.ink, color: WW.white,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, 
            background: 'rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconTicket size={22} stroke={1.7} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>할인패스 구독하면 세차비 반값</div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>1245 회원님 · 지금 구매 시 첫달 50% 할인</div>
          </div>
          <IconChev size={18} stroke={2} style={{ color: WW.white, opacity: 0.7 }}/>
        </div>
      </div>
    </div>

    {/* Bottom CTA */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: WW.white, padding: '14px 20px 32px',
      borderTop: `1px solid ${WW.fog}`,
      zIndex: 40,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: WW.slate, fontWeight: 500 }}>결제 금액</div>
        <div style={{ fontSize: 20, fontWeight: 800 }} className="ww-num">20,000원</div>
      </div>
      <WWCTA>예약하기</WWCTA>
    </div>
  </div>
);

window.AppStore = AppStore;
