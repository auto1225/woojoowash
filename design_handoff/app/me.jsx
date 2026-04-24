// 우주워시 — App Screens: My profile, Before/After, Login, Pass, Cars, Coupons

const AppMe = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: WW.cloud }}>
    <WWStatus />
    <div style={{ padding: '0 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: WW.cloud }}>
      <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.4 }}>내 정보</div>
      <div style={{ position: 'relative' }}>
        <IconBell size={22} stroke={1.6}/>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 6, height: 6, borderRadius: 3, background: WW.accent }}/>
      </div>
    </div>

    <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
      {/* Profile */}
      <div style={{ background: WW.white, padding: '24px 20px', margin: '8px 0 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 28, background: WW.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: WW.white, fontSize: 20, fontWeight: 700,
          }}>W</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 2 }}>1245 회원님</div>
            <div style={{ fontSize: 12, color: WW.slate }}>네이버 계정 · 실버 등급</div>
          </div>
          <IconSettings size={22} stroke={1.6} style={{ color: WW.slate }}/>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
          {[
            { k: '쿠폰', v: '2장' },
            { k: '포인트', v: '3,450P' },
            { k: '할인패스', v: '미보유' },
          ].map((s, i) => (
            <div key={i} style={{
              textAlign: 'center', padding: '12px 0',
              borderLeft: i > 0 ? `1px solid ${WW.fog}` : 'none',
            }}>
              <div style={{ fontSize: 11, color: WW.slate, marginBottom: 4 }}>{s.k}</div>
              <div style={{ fontSize: 15, fontWeight: 800 }} className="ww-num">{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pass banner */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{
          borderRadius: 14, padding: '18px 20px', background: WW.ink, color: WW.white,
          display: 'flex', alignItems: 'center', gap: 14, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.6, marginBottom: 4 }}>MEMBERSHIP</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>할인패스 구매하고</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>세차비 50% 할인받기</div>
          </div>
          <div style={{ padding: '8px 14px', borderRadius: 999, background: WW.white, color: WW.ink, fontSize: 12, fontWeight: 700 }}>
            구매하기
          </div>
        </div>
      </div>

      {/* Recent payment */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 10, letterSpacing: -0.3 }}>최근 결제</div>
        <div style={{ background: WW.white, borderRadius: 14, overflow: 'hidden' }}>
          {[
            { d: '4/20', name: '우주워시 강남점', type: '셀프세차 60분', v: '20,000' },
            { d: '4/12', name: '우주워시 역삼점', type: '손세차 프리미엄', v: '45,000' },
          ].map((r, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', padding: '14px 16px',
              borderBottom: i === 0 ? `1px solid ${WW.fog}` : 'none', gap: 12,
            }}>
              <div style={{ width: 38, textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: WW.ink }} className="ww-num">{r.d}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{r.name}</div>
                <div style={{ fontSize: 11, color: WW.slate }}>{r.type}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700 }} className="ww-num">{r.v}원</div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ background: WW.white, borderRadius: 14, overflow: 'hidden' }}>
          {[
            { i: IconCamera, t: 'Before / After 기록', b: 'NEW' },
            { i: IconCar, t: '차량 관리' },
            { i: IconCard, t: '카드 관리' },
            { i: IconStar, t: '리뷰 관리' },
            { i: IconGift, t: '쿠폰 · 이벤트' },
            { i: IconMsg, t: '고객센터' },
            { i: IconShield, t: '제휴 · 입점 문의' },
          ].map((m, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', padding: '16px', gap: 14,
              borderBottom: i < arr.length - 1 ? `1px solid ${WW.fog}` : 'none',
            }}>
              <m.i size={22} stroke={1.6}/>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{m.t}</div>
              {m.b && <span style={{
                fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                background: WW.accent, color: WW.white, letterSpacing: 0.5,
              }}>{m.b}</span>}
              <IconChev size={16} stroke={2} style={{ color: WW.ash }}/>
            </div>
          ))}
        </div>
      </div>
    </div>

    <WWTabBar active="me" />
  </div>
);

// Before/After 기록 (차별화 기능)
const AppBeforeAfter = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: WW.white }}>
    <WWStatus />
    <WWNav title="Before · After" showBack right={<IconPlus size={22} stroke={2}/>} />

    <div style={{ flex: 1, overflow: 'auto', padding: '20px 20px 40px' }}>
      <div className="ww-disp" style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginBottom: 4 }}>
        내 차의 변화
      </div>
      <div style={{ fontSize: 13, color: WW.slate, marginBottom: 20 }}>
        세차 전후 사진을 기록하고 공유해보세요
      </div>

      {/* Featured before/after */}
      <div style={{
        borderRadius: 18, overflow: 'hidden', marginBottom: 20,
        border: `1px solid ${WW.fog}`,
      }}>
        <div style={{ position: 'relative', height: 200, display: 'flex' }}>
          <div style={{ flex: 1, background: `linear-gradient(135deg, #6E6E73, #3A3A3D)`, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 10, left: 10, padding: '3px 8px', borderRadius: 4, background: 'rgba(0,0,0,0.5)', color: WW.white, fontSize: 10, fontWeight: 700 }}>BEFORE</div>
            <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
              <rect width="200" height="200" fill="#4A4A4D"/>
              {/* dirt spots */}
              {[...Array(40)].map((_, i) => (
                <circle key={i} cx={(i*47)%200} cy={(i*31)%200} r={1 + (i%3)} fill="#2A2A2D" opacity={0.5}/>
              ))}
              <path d="M30 130 Q40 100 70 95 L130 90 Q160 95 170 120 L175 140 L30 140 Z" fill="#1C1C1F"/>
            </svg>
          </div>
          <div style={{ width: 2, background: WW.white }}/>
          <div style={{ flex: 1, background: `linear-gradient(135deg, #D4D4D9, #A8A8AD)`, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 10, right: 10, padding: '3px 8px', borderRadius: 4, background: WW.ink, color: WW.white, fontSize: 10, fontWeight: 700 }}>AFTER</div>
            <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
              <defs>
                <radialGradient id="shine" cx="60%" cy="30%">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
                </radialGradient>
              </defs>
              <rect width="200" height="200" fill="#E8E8EB"/>
              <path d="M30 130 Q40 100 70 95 L130 90 Q160 95 170 120 L175 140 L30 140 Z" fill="#3A3A3D"/>
              <ellipse cx="100" cy="110" rx="60" ry="10" fill="url(#shine)"/>
            </svg>
          </div>
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>4월 20일 · 손세차 프리미엄</div>
            <div style={{ fontSize: 11, color: WW.slate }}>45분</div>
          </div>
          <div style={{ fontSize: 12, color: WW.slate }}>우주워시 역삼점 · 그랜저 IG</div>
        </div>
      </div>

      {/* Grid of past sessions */}
      <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 12, letterSpacing: -0.3 }}>지난 기록</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { d: '4/12', t: '셀프 60분' },
          { d: '4/3', t: '손세차' },
          { d: '3/28', t: '배달 프리미엄' },
          { d: '3/15', t: '셀프 90분' },
        ].map((r, i) => (
          <div key={i} style={{
            aspectRatio: '1', borderRadius: 12, overflow: 'hidden',
            border: `1px solid ${WW.fog}`, position: 'relative',
            background: i % 2 === 0 
              ? `linear-gradient(135deg, ${WW.mist}, ${WW.ash})`
              : `linear-gradient(135deg, ${WW.fog}, ${WW.mist})`,
          }}>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '16px 12px 10px',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
              color: WW.white,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700 }} className="ww-num">{r.d}</div>
              <div style={{ fontSize: 10, opacity: 0.85 }}>{r.t}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AppLogin = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: WW.white, padding: '0 28px', position: 'relative' }}>
    <WWStatus />

    {/* Skip / Browse button — top right */}
    <div style={{ position: 'absolute', top: 56, right: 24, zIndex: 10 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: WW.slate,
        padding: '8px 14px', borderRadius: 999, background: WW.cloud,
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        둘러보기 <IconArrow size={12} stroke={2.5}/>
      </div>
    </div>

    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 40 }}>
      <div style={{ marginBottom: 36 }}>
        <WWGlyph size={52}/>
      </div>
      <div className="ww-disp" style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1.15, marginBottom: 8 }}>
        빛나는 세차,<br/>한 번의 탭으로
      </div>
      <div style={{ fontSize: 14, color: WW.slate }}>
        3초만에 시작하고, 결제할 때 가입해요
      </div>
    </div>

    <div style={{ paddingBottom: 36 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Kakao */}
        <div style={{
          height: 52, borderRadius: 14, background: '#FEE500', color: '#181600',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontSize: 15, fontWeight: 700, position: 'relative',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.48 3 2 6.58 2 11c0 2.9 1.92 5.44 4.8 6.85L5.5 21l3.75-2.45C10.08 18.84 11.03 19 12 19c5.52 0 10-3.58 10-8S17.52 3 12 3z"/></svg>
          카카오로 시작하기
          <div style={{
            position: 'absolute', right: -4, top: -8,
            padding: '3px 8px', borderRadius: 999,
            background: WW.ink, color: WW.white,
            fontSize: 9, fontWeight: 700, letterSpacing: 0.3,
          }}>최근 사용</div>
        </div>

        {/* Naver */}
        <div style={{
          height: 52, borderRadius: 14, background: '#03C75A', color: WW.white,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontSize: 15, fontWeight: 700,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727z"/>
          </svg>
          네이버로 시작하기
        </div>

        {/* Google */}
        <div style={{
          height: 52, borderRadius: 14, background: WW.white, color: WW.ink,
          border: `1.5px solid ${WW.fog}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontSize: 15, fontWeight: 600,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google로 시작하기
        </div>

        {/* Apple */}
        <div style={{
          height: 52, borderRadius: 14, background: WW.white, color: WW.ink,
          border: `1.5px solid ${WW.fog}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontSize: 15, fontWeight: 600,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12-.99.362-2.02 1.01-2.8.73-.87 1.99-1.54 3.154-1.85zM19.8 17.6c-.47 1.04-.71 1.5-1.32 2.42-.85 1.28-2.05 2.87-3.54 2.88-1.32.01-1.66-.86-3.45-.85-1.79.01-2.17.87-3.49.86-1.49-.01-2.63-1.45-3.48-2.73C2.16 16.35 1.86 11.45 3.64 9.1 4.89 7.36 6.89 6.4 8.75 6.4c1.9 0 3.09.99 4.66.99 1.53 0 2.45-.99 4.65-.99 1.66 0 3.42.9 4.68 2.47-4.12 2.25-3.45 8.14-2.94 8.74z"/></svg>
          Apple로 시작하기
        </div>

        {/* Divider with email */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '6px 0 2px' }}>
          <div style={{ flex: 1, height: 1, background: WW.fog }}/>
          <div style={{ fontSize: 11, color: WW.ash, fontWeight: 600 }}>또는</div>
          <div style={{ flex: 1, height: 1, background: WW.fog }}/>
        </div>

        <div style={{
          height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, color: WW.graphite, fontWeight: 600,
        }}>
          이메일로 가입 · 로그인
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 16, fontSize: 10.5, color: WW.ash, lineHeight: 1.7 }}>
        계속 진행 시 <span style={{ color: WW.graphite, textDecoration: 'underline', textDecorationColor: WW.fog }}>이용약관</span>과 <span style={{ color: WW.graphite, textDecoration: 'underline', textDecorationColor: WW.fog }}>개인정보 처리방침</span>에<br/>
        동의하는 것으로 간주됩니다
      </div>
    </div>
  </div>
);

const AppPass = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: WW.cloud }}>
    <WWStatus />
    <WWNav title="할인패스" showBack />

    <div style={{ flex: 1, overflow: 'auto', paddingBottom: 120 }}>
      <div style={{ padding: '24px 20px 20px', background: WW.white }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: WW.accent, letterSpacing: 0.5, marginBottom: 8 }}>MEMBERSHIP</div>
        <div className="ww-disp" style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.2, marginBottom: 8 }}>
          매달 세차하면<br/>할인패스가 무조건 이득
        </div>
        <div style={{ fontSize: 13, color: WW.slate }}>첫 달은 50% 할인된 가격으로 경험해보세요</div>
      </div>

      <WWSectionGap size={8}/>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { name: '라이트', price: '9,900', origPrice: '19,900', desc: '셀프세차 30% 할인', popular: false },
          { name: '스탠다드', price: '19,900', origPrice: '39,900', desc: '셀프·손세차 40% 할인', popular: true },
          { name: '프리미엄', price: '29,900', origPrice: '59,900', desc: '모든 서비스 50% + 픽업 무료', popular: false },
        ].map((p, i) => (
          <div key={i} style={{
            borderRadius: 16, padding: '20px',
            background: p.popular ? WW.ink : WW.white,
            color: p.popular ? WW.white : WW.ink,
            border: p.popular ? 'none' : `1px solid ${WW.fog}`,
            position: 'relative',
          }}>
            {p.popular && (
              <div style={{
                position: 'absolute', top: -10, left: 20,
                padding: '4px 10px', borderRadius: 999,
                background: WW.accent, color: WW.white,
                fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
              }}>BEST</div>
            )}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{p.name}</div>
              <div style={{ fontSize: 10, textDecoration: 'line-through', opacity: 0.5 }} className="ww-num">월 {p.origPrice}원</div>
            </div>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 14 }}>{p.desc}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontSize: 24, fontWeight: 800 }} className="ww-num">{p.price}</span>
              <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>원/월</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: WW.white, padding: '14px 20px 32px',
      borderTop: `1px solid ${WW.fog}`, zIndex: 40,
    }}>
      <WWCTA>스탠다드 구독 시작</WWCTA>
    </div>
  </div>
);

const AppCars = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: WW.cloud }}>
    <WWStatus />
    <WWNav title="차량 관리" showBack right={<IconPlus size={22} stroke={2}/>} />

    <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
      {[
        { name: '현대 그랜저 IG', plate: '12가 3456', color: '펄 화이트', main: true },
        { name: '기아 카니발', plate: '78나 9012', color: '스노우 화이트', main: false },
      ].map((c, i) => (
        <div key={i} style={{
          background: WW.white, borderRadius: 16, padding: 18, marginBottom: 12,
          border: c.main ? `2px solid ${WW.ink}` : `1px solid ${WW.fog}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: WW.cloud, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconCar size={28} stroke={1.5}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <div style={{ fontSize: 15, fontWeight: 800 }}>{c.name}</div>
                {c.main && <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3, background: WW.ink, color: WW.white }}>대표</span>}
              </div>
              <div style={{ fontSize: 12, color: WW.slate }}>{c.plate} · {c.color}</div>
            </div>
            <IconDots size={18} style={{ color: WW.slate }}/>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, padding: '10px', background: WW.cloud, borderRadius: 8, textAlign: 'center', fontSize: 11, fontWeight: 600, color: WW.graphite }}>하이패스 등록</div>
            <div style={{ flex: 1, padding: '10px', background: WW.cloud, borderRadius: 8, textAlign: 'center', fontSize: 11, fontWeight: 600, color: WW.graphite }}>세차 이력</div>
          </div>
        </div>
      ))}

      <div style={{
        marginTop: 8, padding: '20px', borderRadius: 16,
        border: `1.5px dashed ${WW.mist}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        color: WW.slate, fontSize: 13, fontWeight: 600,
      }}>
        <IconPlus size={18} stroke={2}/> 새 차량 추가하기
      </div>
    </div>
  </div>
);

const AppCoupons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: WW.cloud }}>
    <WWStatus />
    <WWNav title="쿠폰함" showBack />

    <div style={{ padding: '8px 16px 12px', background: WW.white, display: 'flex', gap: 8, borderBottom: `1px solid ${WW.fog}` }}>
      <WWChip size="sm" active>사용 가능 2</WWChip>
      <WWChip size="sm">사용 완료</WWChip>
      <WWChip size="sm">만료</WWChip>
    </div>

    <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
      {[
        { title: '신규 가입 30% 할인', desc: '최대 10,000원 할인', exp: '5월 24일까지', hot: true },
        { title: '셀프세차 무료 30분', desc: '전 매장 공통', exp: '5월 31일까지' },
      ].map((c, i) => (
        <div key={i} style={{
          background: WW.white, borderRadius: 16, marginBottom: 12,
          border: `1px solid ${WW.fog}`, overflow: 'hidden',
          display: 'flex',
        }}>
          <div style={{
            width: 80, background: WW.ink, color: WW.white,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: 10, position: 'relative',
          }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>
              {i === 0 ? '30' : '30'}
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.7 }}>
              {i === 0 ? '%' : '분'}
            </div>
            <div style={{ position: 'absolute', right: -5, top: '50%', width: 10, height: 10, borderRadius: 5, background: WW.white, transform: 'translateY(-50%)' }}/>
          </div>
          <div style={{ flex: 1, padding: 14, borderLeft: `1px dashed ${WW.mist}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{c.title}</div>
              {c.hot && <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 3, background: WW.accent, color: WW.white }}>HOT</span>}
            </div>
            <div style={{ fontSize: 12, color: WW.slate, marginBottom: 8 }}>{c.desc}</div>
            <div style={{ fontSize: 10, color: WW.ash }}>{c.exp}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

Object.assign(window, { AppMe, AppBeforeAfter, AppLogin, AppPass, AppCars, AppCoupons });
