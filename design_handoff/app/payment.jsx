// 우주워시 — App Screens: Payment + Booking Confirmed

const AppPayment = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: WW.cloud }}>
    <WWStatus />
    <WWNav title="결제" showBack />

    <div style={{ flex: 1, overflow: 'auto' }}>
      {/* Summary */}
      <div style={{ background: WW.white, padding: '20px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: WW.slate, letterSpacing: 0.5, marginBottom: 8 }}>BOOKING</div>
        <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 16, letterSpacing: -0.3 }}>우주워시 강남점 · 셀프세차</div>
        
        {[
          { k: '이용일시', v: '4월 24일 (금) 오후 2:30' },
          { k: '사용시간', v: '60분' },
          { k: '차량', v: '현대 그랜저 IG (12가 3456)' },
          { k: '베이', v: 'BAY 3 (자동 배정)' },
        ].map((r, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', padding: '10px 0',
            borderBottom: i < 3 ? `1px solid ${WW.fog}` : 'none',
          }}>
            <span style={{ fontSize: 13, color: WW.slate }}>{r.k}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{r.v}</span>
          </div>
        ))}
      </div>

      <WWSectionGap />

      {/* Payment method */}
      <div style={{ background: WW.white, padding: '20px' }}>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14, letterSpacing: -0.3 }}>결제 수단</div>
        {[
          { name: '신한 체크카드', sub: '**** 3892', selected: true },
          { name: '카카오페이', sub: '간편결제' },
          { name: '토스페이', sub: '간편결제' },
          { name: '새 카드 추가', sub: null, add: true },
        ].map((m, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 0', borderBottom: i < 3 ? `1px solid ${WW.fog}` : 'none',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: m.add ? WW.cloud : WW.ink,
              color: m.add ? WW.ink : WW.white,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {m.add ? <IconPlus size={18} stroke={2} /> : <IconCard size={20} stroke={1.7} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</div>
              {m.sub && <div style={{ fontSize: 11, color: WW.slate, marginTop: 2 }}>{m.sub}</div>}
            </div>
            {m.selected && (
              <div style={{
                width: 22, height: 22, borderRadius: 11, background: WW.ink,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <IconCheck size={14} stroke={3} style={{ color: WW.white }}/>
              </div>
            )}
            {!m.selected && !m.add && (
              <div style={{ width: 22, height: 22, borderRadius: 11, border: `1.5px solid ${WW.mist}` }}/>
            )}
          </div>
        ))}
      </div>

      <WWSectionGap />

      {/* Coupons */}
      <div style={{ background: WW.white, padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.3 }}>쿠폰 / 할인패스</div>
          <div style={{ fontSize: 12, color: WW.accent, fontWeight: 600 }}>2개 보유</div>
        </div>
        <div style={{
          padding: '14px 16px', borderRadius: 12,
          border: `1px dashed ${WW.mist}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <IconTicket size={22} stroke={1.7} style={{ color: WW.slate }}/>
          <div style={{ flex: 1, fontSize: 13, color: WW.slate }}>적용할 쿠폰을 선택해주세요</div>
          <IconChev size={16} stroke={2} style={{ color: WW.ash }}/>
        </div>
      </div>

      <WWSectionGap />

      {/* Breakdown */}
      <div style={{ background: WW.white, padding: '20px' }}>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14, letterSpacing: -0.3 }}>결제 금액</div>
        {[
          { k: '서비스 요금', v: '20,000원' },
          { k: '쿠폰 할인', v: '-0원' },
          { k: '포인트 사용', v: '-0P' },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
            <span style={{ fontSize: 13, color: WW.slate }}>{r.k}</span>
            <span style={{ fontSize: 13, fontWeight: 500 }} className="ww-num">{r.v}</span>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${WW.fog}`, marginTop: 10, paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>최종 결제 금액</span>
          <span style={{ fontSize: 22, fontWeight: 800 }} className="ww-num">20,000원</span>
        </div>
      </div>

      <div style={{ height: 200 }}/>
    </div>

    {/* Bottom CTA */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: WW.white, padding: '14px 20px 32px',
      borderTop: `1px solid ${WW.fog}`, zIndex: 40,
    }}>
      <div style={{
        padding: '10px 14px', borderRadius: 10, background: WW.cloud,
        fontSize: 11, color: WW.slate, marginBottom: 10, lineHeight: 1.4,
      }}>
        결제 진행 시 서비스 이용약관 및 환불 정책에 동의하게 됩니다.
      </div>
      <WWCTA>20,000원 결제하기</WWCTA>
    </div>
  </div>
);

const AppConfirmed = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: WW.white }}>
    <WWStatus />
    <WWNav title="" showBack={false} right={<IconClose size={22} stroke={2}/>} border={false} />

    <div style={{ flex: 1, overflow: 'auto', paddingBottom: 120 }}>
      {/* Hero */}
      <div style={{ padding: '30px 24px 30px' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 32, background: WW.ink,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
        }}>
          <IconCheck size={32} stroke={2.5} style={{ color: WW.white }}/>
        </div>
        <div className="ww-disp" style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.7, lineHeight: 1.15, marginBottom: 6 }}>
          예약이 완료됐어요
        </div>
        <div style={{ fontSize: 14, color: WW.slate, lineHeight: 1.5 }}>
          예약 시간 15분 전에<br/>
          알림으로 다시 안내해드릴게요
        </div>
      </div>

      {/* Booking card */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          border: `1px solid ${WW.fog}`, borderRadius: 18, overflow: 'hidden',
        }}>
          {/* Ticket top */}
          <div style={{ padding: '20px', borderBottom: `1px dashed ${WW.mist}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: WW.accent, letterSpacing: 0.5, marginBottom: 8 }}>BOOKING #WJ-20260424-8821</div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.4, marginBottom: 4 }}>우주워시 강남점</div>
            <div style={{ fontSize: 12, color: WW.slate }}>셀프세차 · BAY 3</div>
          </div>
          {/* Notch */}
          <div style={{ position: 'relative', height: 0 }}>
            <div style={{ position: 'absolute', left: -10, top: -10, width: 20, height: 20, borderRadius: 10, background: WW.white }}/>
            <div style={{ position: 'absolute', right: -10, top: -10, width: 20, height: 20, borderRadius: 10, background: WW.white }}/>
          </div>
          {/* Grid details */}
          <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: WW.slate, marginBottom: 4 }}>날짜</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>4월 24일 금</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: WW.slate, marginBottom: 4 }}>시작 시간</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>오후 2:30</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: WW.slate, marginBottom: 4 }}>이용 시간</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>60분</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: WW.slate, marginBottom: 4 }}>차량</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>12가 3456</div>
            </div>
          </div>
          {/* QR */}
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{
              background: WW.cloud, borderRadius: 12, padding: 16,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 76, height: 76, borderRadius: 8, background: WW.white,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 4,
              }}>
                {/* Fake QR */}
                <svg viewBox="0 0 21 21" style={{ width: '100%', height: '100%' }}>
                  {[...Array(441)].map((_, i) => {
                    const x = i % 21, y = Math.floor(i / 21);
                    const on = ((x*y + x + y) * 13) % 3 !== 0;
                    // Fixed finder patterns at corners
                    const inFinder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
                    if (inFinder) return null;
                    return on ? <rect key={i} x={x} y={y} width="1" height="1" fill={WW.ink}/> : null;
                  })}
                  {/* Finder patterns */}
                  {[[0,0],[14,0],[0,14]].map(([fx, fy], i) => (
                    <g key={i}>
                      <rect x={fx} y={fy} width="7" height="7" fill={WW.ink}/>
                      <rect x={fx+1} y={fy+1} width="5" height="5" fill={WW.white}/>
                      <rect x={fx+2} y={fy+2} width="3" height="3" fill={WW.ink}/>
                    </g>
                  ))}
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>매장 입장 QR</div>
                <div style={{ fontSize: 11, color: WW.slate, lineHeight: 1.5 }}>
                  입구 리더기에<br/>스캔해주세요
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions row */}
      <div style={{ padding: '0 20px', display: 'flex', gap: 10 }}>
        {[
          { i: IconPin, t: '길찾기' },
          { i: IconMsg, t: '매장 문의' },
          { i: IconCal, t: '일정 추가' },
        ].map((a, i) => (
          <div key={i} style={{
            flex: 1, padding: '14px', background: WW.cloud, borderRadius: 12,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          }}>
            <a.i size={20} stroke={1.7}/>
            <div style={{ fontSize: 11, fontWeight: 600 }}>{a.t}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom CTAs */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: WW.white, padding: '14px 20px 32px',
      borderTop: `1px solid ${WW.fog}`, zIndex: 40,
      display: 'flex', gap: 8,
    }}>
      <div style={{ flex: 1 }}><WWCTA variant="secondary">홈으로</WWCTA></div>
      <div style={{ flex: 2 }}><WWCTA>예약 내역 보기</WWCTA></div>
    </div>
  </div>
);

// 결제 직전 회원가입 유도 바텀시트
const AppGuestSignup = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: WW.cloud, position: 'relative' }}>
    <WWStatus />
    <WWNav title="결제" showBack />

    {/* Dimmed payment screen behind */}
    <div style={{ flex: 1, overflow: 'hidden', opacity: 0.4, pointerEvents: 'none' }}>
      <div style={{ background: WW.white, padding: '20px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: WW.slate, letterSpacing: 0.5, marginBottom: 8 }}>BOOKING</div>
        <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 16, letterSpacing: -0.3 }}>우주워시 강남점 · 셀프세차</div>
        {['이용일시', '사용시간', '차량', '베이'].map((k, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 3 ? `1px solid ${WW.fog}` : 'none' }}>
            <span style={{ fontSize: 13, color: WW.slate }}>{k}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: WW.ash }}>—</span>
          </div>
        ))}
      </div>
    </div>

    {/* Dim overlay */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10,10,11,0.45)', zIndex: 30 }}/>

    {/* Sign-up bottom sheet */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 40,
      background: WW.white, borderRadius: '24px 24px 0 0',
      padding: '10px 24px 32px',
      boxShadow: '0 -20px 40px rgba(0,0,0,0.15)',
    }}>
      <div style={{ width: 36, height: 4, borderRadius: 2, background: WW.fog, margin: '0 auto 20px' }}/>

      <div style={{ fontSize: 11, fontWeight: 700, color: WW.accent, letterSpacing: 1, marginBottom: 8 }}>LAST STEP · 결제 전 가입</div>
      <div className="ww-disp" style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.25, marginBottom: 6 }}>
        예약 확인을 위해<br/>간편 가입을 해주세요
      </div>
      <div style={{ fontSize: 12, color: WW.slate, marginBottom: 20, lineHeight: 1.5 }}>
        3초면 끝나요. 다음부터는 바로 결제할 수 있어요.
      </div>

      {/* Social buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        <div style={{
          height: 48, borderRadius: 12, background: '#FEE500', color: '#181600',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontSize: 14, fontWeight: 700,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.48 3 2 6.58 2 11c0 2.9 1.92 5.44 4.8 6.85L5.5 21l3.75-2.45C10.08 18.84 11.03 19 12 19c5.52 0 10-3.58 10-8S17.52 3 12 3z"/></svg>
          카카오 3초 가입
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            flex: 1, height: 44, borderRadius: 12, background: '#03C75A', color: WW.white,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontSize: 13, fontWeight: 700,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727z"/></svg>
            네이버
          </div>
          <div style={{
            flex: 1, height: 44, borderRadius: 12, background: WW.white, color: WW.ink,
            border: `1.5px solid ${WW.fog}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontSize: 13, fontWeight: 600,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </div>
          <div style={{
            flex: 1, height: 44, borderRadius: 12, background: WW.white, color: WW.ink,
            border: `1.5px solid ${WW.fog}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontSize: 13, fontWeight: 600,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12-.99.362-2.02 1.01-2.8.73-.87 1.99-1.54 3.154-1.85zM19.8 17.6c-.47 1.04-.71 1.5-1.32 2.42-.85 1.28-2.05 2.87-3.54 2.88-1.32.01-1.66-.86-3.45-.85-1.79.01-2.17.87-3.49.86-1.49-.01-2.63-1.45-3.48-2.73C2.16 16.35 1.86 11.45 3.64 9.1 4.89 7.36 6.89 6.4 8.75 6.4c1.9 0 3.09.99 4.66.99 1.53 0 2.45-.99 4.65-.99 1.66 0 3.42.9 4.68 2.47-4.12 2.25-3.45 8.14-2.94 8.74z"/></svg>
            Apple
          </div>
        </div>
      </div>

      {/* Benefit callout */}
      <div style={{
        padding: '12px 14px', background: WW.cloud, borderRadius: 12,
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10, background: WW.ink, color: WW.white,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <IconTicket size={16} stroke={1.7}/>
        </div>
        <div style={{ fontSize: 11.5, color: WW.graphite, lineHeight: 1.5 }}>
          <b style={{ color: WW.ink }}>첫 결제 3,000원 쿠폰</b>이 자동 적용돼요
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 14, fontSize: 10, color: WW.ash, lineHeight: 1.7 }}>
        이용약관 · 개인정보 처리방침 동의로 간주
      </div>
    </div>
  </div>
);

Object.assign(window, { AppPayment, AppConfirmed, AppGuestSignup });
