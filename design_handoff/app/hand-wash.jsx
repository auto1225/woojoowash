// 우주워시 — 손세차 예약 플로우 (레퍼런스 재설계)
// (1) 매장 상세 → (2) 상품 상세 → (3) 예약일시 선택 모달 → (4) 예약/결제
// 미니멀 모노크롬 스타일로 레퍼런스 구조 + 우주워시 시각언어

// ══════════════════════════════════════════════════════════════
// (1) 매장 상세 — "한라인 (스팀세차)" 구조
// ══════════════════════════════════════════════════════════════
const HandStoreDetail = () => {
  const [tab, setTab] = React.useState('상품'); // 상품 | 정보 | 리뷰
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: WW.white }}>
      <WWStatus />

      {/* Top nav (transparent over image) */}
      <div style={{ 
        position: 'absolute', top: 54, left: 0, right: 0, zIndex: 20,
        height: 52, padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <IconBack size={24} stroke={2}/>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>우주디테일링 강남점</div>
        <div style={{ display: 'flex', gap: 14 }}>
          <IconArrow size={22} stroke={1.8} style={{ transform: 'rotate(-90deg)' }}/>
          <IconHeart size={22} stroke={1.8}/>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 20 }}>
        {/* Cover image */}
        <div style={{ 
          height: 240, background: `linear-gradient(135deg, ${WW.charcoal}, ${WW.ink})`,
          position: 'relative', overflow: 'hidden',
        }}>
          <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="hsgrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1C1C1F"/>
                <stop offset="100%" stopColor="#0A0A0B"/>
              </linearGradient>
            </defs>
            <rect width="400" height="240" fill="url(#hsgrad)"/>
            {/* Garage frame */}
            <rect x="40" y="40" width="320" height="160" fill="none" stroke="#3A3A3D" strokeWidth="1.5"/>
            <rect x="50" y="50" width="300" height="140" fill="#141417"/>
            {/* Car silhouette (front 3/4) */}
            <ellipse cx="200" cy="170" rx="120" ry="16" fill="#000" opacity="0.5"/>
            <path d="M100 160 Q105 120 150 112 L250 112 Q295 120 300 160 L300 175 L100 175 Z" fill="#2A2A2E"/>
            <path d="M125 130 L155 125 L245 125 L275 130 L270 155 L130 155 Z" fill="#1A1A1D"/>
            {/* Lights */}
            <ellipse cx="118" cy="150" rx="10" ry="4" fill="#FCD34D" opacity="0.9"/>
            <ellipse cx="282" cy="150" rx="10" ry="4" fill="#FCD34D" opacity="0.9"/>
            {/* Steam */}
            {[...Array(14)].map((_, i) => (
              <circle key={i} cx={60 + (i*23) % 280} cy={70 + ((i*37) % 50)} r={3 + (i%3)} fill="#fff" opacity={0.06 + (i%4)*0.03}/>
            ))}
            {/* Logo-ish text on facade */}
            <text x="200" y="78" textAnchor="middle" fill="#FCD34D" fontSize="16" fontWeight="800" fontFamily="monospace" letterSpacing="2">우주 디테일링</text>
          </svg>
          {/* counter */}
          <div style={{ position: 'absolute', bottom: 14, right: 14, padding: '4px 10px', borderRadius: 999, background: 'rgba(0,0,0,0.55)', color: WW.white, fontSize: 11, fontWeight: 600 }}>1 / 7</div>
        </div>

        {/* Owner bubble */}
        <div style={{ padding: '16px 20px 0' }}>
          <div style={{ 
            padding: '10px 14px', borderRadius: 18, background: WW.cloud, color: WW.graphite,
            fontSize: 12.5, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6,
            maxWidth: '100%', position: 'relative',
          }}>
            <span>외부세차도 잘하지만 실내세차는 더 잘합니다 ✨</span>
            <IconChev size={14} stroke={2} style={{ color: WW.slate }}/>
          </div>
        </div>

        {/* Store title block */}
        <div style={{ padding: '12px 20px 18px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div className="ww-disp" style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginBottom: 6 }}>
              우주디테일링 강남점
            </div>
            <div style={{ fontSize: 12.5, color: WW.slate, lineHeight: 1.5 }}>강남구 테헤란로 123 · 우주빌딩 B1</div>
            <div style={{ fontSize: 12.5, color: WW.ink, lineHeight: 1.5, marginTop: 2, fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 2 }}>02-1234-5678</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
              <IconStarFill size={14} style={{ color: '#FCD34D' }}/>
              <span style={{ fontSize: 13, fontWeight: 700 }}>5.0/5</span>
              <span style={{ fontSize: 12, color: WW.slate }}>리뷰 24</span>
            </div>
          </div>
          {/* Mini map */}
          <div style={{ 
            width: 68, height: 68, borderRadius: 12, background: WW.cloud,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid ${WW.fog}`, position: 'relative', overflow: 'hidden',
          }}>
            <svg viewBox="0 0 60 60" width="60" height="60">
              <rect width="60" height="60" fill={WW.cloud}/>
              <path d="M0 20 L60 15 M0 35 L60 40 M20 0 L25 60 M40 0 L35 60" stroke={WW.mist} strokeWidth="0.8"/>
              <circle cx="30" cy="30" r="5" fill={WW.ink}/>
              <circle cx="30" cy="30" r="2" fill={WW.white}/>
            </svg>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', borderBottom: `1px solid ${WW.fog}`, padding: '0 20px',
          position: 'sticky', top: 0, background: WW.white, zIndex: 10,
        }}>
          {['상품', '정보', '리뷰'].map(t => (
            <div key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '14px 0', textAlign: 'center',
              fontSize: 14, fontWeight: tab === t ? 700 : 500,
              color: tab === t ? WW.ink : WW.slate,
              borderBottom: tab === t ? `2px solid ${WW.ink}` : '2px solid transparent',
              marginBottom: -1,
            }}>{t}</div>
          ))}
        </div>

        {/* Tab content — 상품 */}
        {tab === '상품' && (
          <div>
            {[
              { tag: '추천', title: '기본(베이직) 디테일링', desc: '외부물세차 + 내부스팀 + QD + 연막살균', time: '약 1시간 소요', price: '60,500원~', img: 'basic' },
              { title: '경차/승용차/SUV 한라인 패키지', desc: '내부 디테일링 + 공조 항균소독 + 프리미엄 핸들코팅', time: '약 2시간 30분', price: '150,000원~', img: 'interior' },
              { title: '프리미엄 광택 · 유리막 코팅', desc: '샌딩 + 광택 + 9H 유리막 · 6개월 보증', time: '약 5시간', price: '390,000원~', img: 'premium' },
            ].map((p, i) => (
              <div key={i} style={{ 
                padding: '18px 20px', display: 'flex', gap: 14,
                borderBottom: i < 2 ? `1px solid ${WW.fog}` : 'none',
              }}>
                <div style={{ 
                  width: 96, height: 96, borderRadius: 12, flexShrink: 0,
                  background: p.img === 'interior' ? '#2A2A2E' : p.img === 'premium' ? `linear-gradient(135deg, ${WW.charcoal}, ${WW.ink})` : `linear-gradient(135deg, ${WW.slate}, ${WW.graphite})`,
                  position: 'relative', overflow: 'hidden',
                }}>
                  <svg viewBox="0 0 96 96" width="96" height="96">
                    {p.img === 'basic' && <>
                      <path d="M10 70 Q15 45 35 42 L60 42 Q82 45 86 70 L86 80 L10 80 Z" fill="#1C1C1F"/>
                      {[...Array(10)].map((_, j) => <circle key={j} cx={(j*11+8)%96} cy={(j*13+5)%40} r="2" fill="#fff" opacity="0.15"/>)}
                    </>}
                    {p.img === 'interior' && <>
                      <rect x="15" y="30" width="66" height="50" rx="6" fill="#3A3A3D"/>
                      <rect x="22" y="40" width="52" height="10" rx="3" fill="#1C1C1F"/>
                      <circle cx="32" cy="65" r="5" fill="#1C1C1F"/>
                      <circle cx="64" cy="65" r="5" fill="#1C1C1F"/>
                    </>}
                    {p.img === 'premium' && <>
                      <path d="M15 65 Q20 40 42 38 L56 38 Q78 40 82 65 L82 74 L15 74 Z" fill="#2A2A2E"/>
                      <path d="M25 55 Q48 48 72 55" stroke="#fff" strokeWidth="2" fill="none" opacity="0.5"/>
                      <circle cx="48" cy="25" r="8" fill="#fff" opacity="0.2"/>
                    </>}
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {p.tag && <span style={{ 
                    display: 'inline-block', fontSize: 10, fontWeight: 700, 
                    padding: '2px 8px', borderRadius: 4, background: WW.ink, color: WW.white,
                    marginBottom: 6,
                  }}>{p.tag}</span>}
                  <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.2, marginBottom: 4, lineHeight: 1.3 }}>{p.title}</div>
                  <div style={{ fontSize: 11.5, color: WW.slate, lineHeight: 1.45, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {p.desc}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10.5, color: WW.slate, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <IconClock size={11} stroke={1.7}/> {p.time}
                    </span>
                    <span className="ww-num" style={{ fontSize: 14, fontWeight: 800 }}>{p.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === '정보' && (
          <div style={{ padding: '20px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: WW.slate, letterSpacing: 0.5 }}>매장 소개</div>
            <div style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 20, background: WW.ink, color: WW.white, padding: 20, position: 'relative', height: 140 }}>
              <svg viewBox="0 0 335 140" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                <rect width="335" height="140" fill={WW.ink}/>
                {[...Array(30)].map((_, i) => <circle key={i} cx={(i*17) % 335} cy={(i*23) % 140} r={2+(i%3)} fill="#fff" opacity={0.04 + (i%4)*0.02}/>)}
              </svg>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: WW.accent, letterSpacing: 1, marginBottom: 8 }}>ABOUT</div>
                <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1.3 }}>실내 케어만 집중하는<br/>우주디테일링</div>
              </div>
            </div>

            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.3, marginBottom: 10 }}>강남구 우주디테일링 스팀세차장</div>
            <div style={{ fontSize: 13, color: WW.graphite, lineHeight: 1.7 }}>
              1인샵이다보니<br/><br/>
              한 번에 한 대만 케어하느라<br/>
              많은 차량을 케어하지 못합니다.<br/><br/>
              그렇기에 한대 한대 정성 들여 케어합니다.
            </div>

            <div style={{ height: 1, background: WW.fog, margin: '24px 0' }}/>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: WW.slate, letterSpacing: 0.5 }}>매장 소식</div>
            <div style={{ fontSize: 12, color: WW.slate, padding: '20px 0', textAlign: 'center' }}>최근 등록된 소식이 없어요</div>
          </div>
        )}

        {tab === '리뷰' && (
          <div>
            {/* Stats */}
            <div style={{ padding: '20px', borderBottom: `1px solid ${WW.fog}` }}>
              <div style={{ fontSize: 12, color: WW.slate, fontWeight: 600, marginBottom: 6 }}>손세차 평균 별점</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[0,1,2,3,4].map(i => <IconStarFill key={i} size={18} style={{ color: '#FCD34D' }}/>)}
                </div>
                <span className="ww-num" style={{ fontSize: 17, fontWeight: 800 }}>5.0/5</span>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: WW.slate }}>24명</span>
              </div>

              <div style={{ fontSize: 13, fontWeight: 700, margin: '18px 0 10px' }}>이런 점이 좋았어요.</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { t: '차 관리 상담을 해줘요', n: 24 },
                  { t: '서비스 무료 추가가 감동이에요', n: 16 },
                  { t: '빨리 완료 돼요', n: 7 },
                ].map((r, i) => (
                  <div key={i} style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderRadius: 10, 
                    background: i === 0 ? WW.cloud : WW.paper,
                    border: i === 0 ? `1px solid ${WW.ink}` : `1px solid ${WW.fog}`,
                  }}>
                    <span style={{ fontSize: 12.5, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? WW.ink : WW.graphite }}>{r.t}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: WW.ink }}>{r.n}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11.5, color: WW.slate, fontWeight: 500, textAlign: 'center', marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 4, width: '100%', justifyContent: 'center' }}>
                자세히보기 <IconDown size={12} stroke={2}/>
              </div>
            </div>

            {/* Sort chips */}
            <div style={{ padding: '16px 20px 12px', display: 'flex', gap: 8, fontSize: 12, fontWeight: 600 }}>
              <div style={{ padding: '7px 14px', borderRadius: 999, background: WW.ink, color: WW.white }}>베스트 순</div>
              <div style={{ padding: '7px 14px', borderRadius: 999, background: WW.white, color: WW.graphite, border: `1px solid ${WW.fog}` }}>최신 순</div>
              <div style={{ padding: '7px 14px', borderRadius: 999, background: WW.white, color: WW.graphite, border: `1px solid ${WW.fog}` }}>나와 같은 차종만</div>
            </div>

            {/* Review list */}
            {[
              { name: '워시****2782', car: '아우디 A7', product: '경차/승용차/SUV 한라인 패키지', date: '2026.04.17', body: '사장님이 세차에 진심이신곳 친절한 설명과 디테일까지 완벽합니다' },
              { name: '워시****4110', car: 'BMW 5시리즈', product: '경차/승용차 에어컨 케어', date: '2026.03.26', body: '친절한 설명 정말 고맙습니다!' },
              { name: '워시****4196', car: '제네시스 G70', product: '경차/승용차/SUV 한라인 패키지', date: '2026.03.15', body: '차 내외부 컨디션에 맞게 케어 잘해주셨구요 작업모두 훌륭해서 너무 마음에 들었습니다. 다음엔 어떻게 관리하면 좋을지 어드바이스 잘 해주셨구요 친절하게 설명해주셔서 감사했습니다' },
            ].map((r, i) => (
              <div key={i} style={{ padding: '16px 20px', borderBottom: i < 2 ? `1px solid ${WW.fog}` : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 1 }}>
                    {[0,1,2,3,4].map(k => <IconStarFill key={k} size={12} style={{ color: '#FCD34D' }}/>)}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>5.0/5</span>
                  <span style={{ fontSize: 11, color: WW.slate, marginLeft: 6 }}>· {r.product}</span>
                </div>
                <div style={{ fontSize: 13, color: WW.graphite, lineHeight: 1.55, marginBottom: 10 }}>{r.body}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 12, background: WW.cloud, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconUser size={14} stroke={1.6} style={{ color: WW.slate }}/>
                  </div>
                  <span style={{ fontSize: 11, color: WW.slate }}>{r.name}</span>
                  <span style={{ fontSize: 11, color: WW.ash }}>·</span>
                  <span style={{ fontSize: 11, color: WW.slate }}>{r.car}</span>
                  <span style={{ fontSize: 11, color: WW.ash, marginLeft: 'auto' }}>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// (2) 상품 상세 — 기본(베이직) 디테일링
// ══════════════════════════════════════════════════════════════
const HandProductDetail = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: WW.white }}>
    <WWStatus />
    <WWNav title="상품상세" showBack />

    <div style={{ flex: 1, overflow: 'auto', paddingBottom: 110 }}>
      {/* Hero image */}
      <div style={{ padding: '14px 20px' }}>
        <div style={{ 
          height: 220, borderRadius: 14, overflow: 'hidden', position: 'relative',
          background: `linear-gradient(135deg, ${WW.slate}, ${WW.ink})`,
        }}>
          <svg viewBox="0 0 335 220" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="hp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3A3A3D"/>
                <stop offset="100%" stopColor="#0A0A0B"/>
              </linearGradient>
            </defs>
            <rect width="335" height="220" fill="url(#hp)"/>
            {/* Car body */}
            <path d="M30 155 Q38 105 90 97 L160 92 Q215 97 275 110 Q305 120 315 155 L315 170 L30 170 Z" fill="#E5E5E7"/>
            <path d="M100 105 L115 130 L250 130 L265 110" fill="none" stroke="#6E6E73" strokeWidth="1"/>
            <path d="M120 110 L140 105 L220 105 L240 110" fill="#B8B8BD"/>
            {/* Highlight */}
            <path d="M80 130 Q180 120 280 130" stroke="#fff" strokeWidth="2" fill="none" opacity="0.7"/>
            {/* Wheels */}
            <circle cx="80" cy="170" r="15" fill="#1A1A1D"/>
            <circle cx="260" cy="170" r="15" fill="#1A1A1D"/>
            <circle cx="80" cy="170" r="7" fill="#3A3A3D"/>
            <circle cx="260" cy="170" r="7" fill="#3A3A3D"/>
            {/* Worker silhouette + spray */}
            <path d="M295 70 L305 70 L310 80 L308 110 L306 140 L300 155 L296 155 L290 140 L290 90 Z" fill="#1A1A1D"/>
            <circle cx="300" cy="65" r="8" fill="#1A1A1D"/>
            <path d="M290 95 L270 100 L272 92" fill="#1A1A1D"/>
            {/* Foam bubbles */}
            {[...Array(25)].map((_, i) => (
              <circle key={i} cx={50 + (i*13) % 250} cy={90 + (i*7) % 60} r={1.5+(i%3)} fill="#fff" opacity={0.4+(i%3)*0.2}/>
            ))}
            {/* Water spray */}
            <path d="M265 100 Q240 105 215 125" stroke="#fff" strokeWidth="2" fill="none" opacity="0.4" strokeDasharray="2 3"/>
          </svg>
        </div>
      </div>

      {/* Title + desc */}
      <div style={{ padding: '8px 20px 20px' }}>
        <div className="ww-disp" style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginBottom: 8 }}>
          기본(베이직) 디테일링
        </div>
        <div style={{ fontSize: 12, color: WW.slate, display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 14 }}>
          <IconClock size={13} stroke={1.8}/> 약 1시간 소요
        </div>
        <div style={{ fontSize: 13, color: WW.graphite, lineHeight: 1.7 }}>
          외부물세차 + 내부스팀 + QD(물왁스)<br/>
          + 연막살균 + 타이어코팅 + 세미 휠크리닝
        </div>
        <div style={{ fontSize: 13, color: WW.graphite, lineHeight: 1.7, marginTop: 12 }}>
          평소 관리 잘되어 기본적인 내외부세차만 필요하신분 추천합니다.
        </div>
        <div style={{ 
          marginTop: 14, padding: '10px 14px', borderRadius: 10, background: WW.cloud,
          fontSize: 11, color: WW.slate, lineHeight: 1.7,
        }}>
          * 소요시간은 평일 90분 / 주말 60분 소요됩니다.<br/>
          * 시스템상 적용이 안 된 차량은 매장에서 추가 결제<br/>
          * 차량 상태가 안 좋은 경우 소액의 추가 요금 발생합니다.<br/>
          * 하부튜닝 낮은차는 서스 올리는 기능 사용하시면 안전함
        </div>
      </div>

      <div style={{ height: 8, background: WW.cloud }}/>

      {/* Car card */}
      <div style={{ padding: '20px' }}>
        <div style={{ 
          padding: '14px 16px', borderRadius: 12, background: WW.paper,
          border: `1px solid ${WW.fog}`, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ 
            width: 38, height: 38, borderRadius: 10, background: WW.white,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid ${WW.fog}`,
          }}>
            <IconCar size={20} stroke={1.6}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.2 }}>현대 YF쏘나타</div>
            <div style={{ fontSize: 12, color: WW.slate, marginTop: 2 }}>43도 9611</div>
          </div>
          <div style={{ fontSize: 13, color: WW.accent, fontWeight: 700 }}>차량 변경</div>
        </div>
      </div>

      {/* 추가옵션 */}
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.3, marginBottom: 10 }}>추가옵션 선택</div>
        <div style={{ 
          borderRadius: 12, background: WW.cloud, padding: '12px 14px',
        }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: WW.slate, letterSpacing: 0.5, marginBottom: 10 }}>추천 옵션</div>
          {[
            { n: '석회제거/송진제거', p: '33,000원' },
            { n: '철분제거', p: '33,000원' },
            { n: '크롬복원', p: '33,000원' },
            { n: '타르제거', p: '33,000원' },
            { n: '샌딩왁스(세단)', p: '55,000원' },
          ].map((o, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
              <div style={{ 
                width: 20, height: 20, borderRadius: 10,
                border: `1.5px solid ${WW.mist}`, background: WW.white,
                flexShrink: 0,
              }}/>
              <span style={{ flex: 1, fontSize: 13, color: WW.graphite }}>{o.n}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }} className="ww-num">{o.p}</span>
            </div>
          ))}
        </div>

        <div style={{ 
          padding: '14px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: `1px solid ${WW.fog}`,
        }}>
          <span style={{ fontSize: 13, color: WW.graphite, fontWeight: 500 }}>옵션 더보기</span>
          <IconDown size={16} stroke={1.8} style={{ color: WW.slate }}/>
        </div>
      </div>

      {/* 예약날짜 */}
      <div style={{ padding: '20px' }}>
        <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.3, marginBottom: 10 }}>예약날짜 선택</div>
        <div style={{ 
          height: 54, borderRadius: 12, border: `1.5px solid ${WW.accent}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 600, color: WW.accent,
        }}>
          예약 일시를 선택해주세요
        </div>
      </div>

      {/* 요청사항 */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.3, marginBottom: 10 }}>요청사항</div>
        <div style={{ 
          minHeight: 90, padding: '12px 14px', borderRadius: 12, background: WW.paper,
          border: `1px solid ${WW.fog}`, position: 'relative',
        }}>
          <div style={{ fontSize: 13, color: WW.ash }}>신경 써야 하는 부분이 있다면 알려주세요</div>
          <div style={{ position: 'absolute', bottom: 10, right: 14, fontSize: 11, color: WW.ash }}>0/100</div>
        </div>
      </div>
    </div>

    {/* Bottom CTA — 상품상세 */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: WW.white, padding: '12px 20px 28px',
      borderTop: `1px solid ${WW.fog}`, zIndex: 40,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{ 
        flex: 1, height: 52, borderRadius: 999, border: `1.5px solid ${WW.fog}`, background: WW.paper,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px',
      }}>
        <span style={{ fontSize: 12, color: WW.slate }}>총 결제 금액</span>
        <span className="ww-num" style={{ fontSize: 15, fontWeight: 800 }}>60,500원</span>
      </div>
      <div style={{ 
        minWidth: 108, height: 52, borderRadius: 999, background: WW.ink, color: WW.white,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 15, fontWeight: 700, padding: '0 24px',
      }}>예약하기</div>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════
// (3) 예약일시 선택 — 풀스크린 모달
// ══════════════════════════════════════════════════════════════
const HandDatePicker = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: WW.paper }}>
    <WWStatus />
    {/* Modal nav — X instead of back */}
    <div style={{
      height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px', background: WW.white, flexShrink: 0,
    }}>
      <IconClose size={24} stroke={2}/>
      <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>예약일시 선택</div>
      <div style={{ width: 24 }}/>
    </div>

    <div style={{ flex: 1, overflow: 'auto', paddingBottom: 110 }}>
      {/* Month title */}
      <div style={{ padding: '20px 20px 14px', background: WW.white }}>
        <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.3 }}>4월 24일 금요일</div>
      </div>

      {/* Dates row */}
      <div style={{ padding: '0 14px 20px', background: WW.white, display: 'flex', gap: 6, overflowX: 'auto' }}>
        {[
          { d: 24, w: '오늘', active: true },
          { d: 25, w: '토', ring: true },
          { d: 26, w: '휴무', off: true },
          { d: 27, w: '월' },
          { d: 28, w: '화' },
          { d: 29, w: '수' },
          { d: 30, w: '목' },
        ].map((x, i) => (
          <div key={i} style={{ textAlign: 'center', flexShrink: 0, padding: '0 4px' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 22,
              background: x.active ? WW.ink : x.off ? WW.mist : WW.white,
              border: x.ring ? `1.5px solid ${WW.ink}` : `1px solid ${x.off ? WW.mist : WW.fog}`,
              color: x.active ? WW.white : x.off ? WW.slate : WW.ink,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: x.active ? 700 : 500,
            }} className="ww-num">{x.d}</div>
            <div style={{ fontSize: 10.5, marginTop: 5, fontWeight: 500, color: x.off ? WW.slate : WW.graphite }}>{x.w}</div>
          </div>
        ))}
      </div>

      <div style={{ height: 10, background: WW.paper }}/>

      {/* 시작 시간 */}
      <div style={{ padding: '20px', background: WW.white }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
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
          <div style={{
            padding: '8px 20px', borderRadius: 999, background: WW.white,
            border: `1px solid ${WW.fog}`, fontSize: 13, fontWeight: 600,
          }}>오전</div>
          <div style={{
            padding: '8px 20px', borderRadius: 999, background: WW.ink, color: WW.white,
            fontSize: 13, fontWeight: 700,
          }}>오후</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {['12시','13시','14시','15시','16시','17시','18시','19시','20시','21시','22시','23시'].map((t) => {
            const active = t === '14시';
            const avail = ['16시','17시'].includes(t);
            return (
              <div key={t} className="ww-num" style={{
                height: 44, borderRadius: 999,
                background: active ? WW.ink : avail ? WW.white : WW.mist,
                color: active ? WW.white : avail ? WW.ink : WW.slate,
                border: active ? `1px solid ${WW.ink}` : avail ? `1.5px solid ${WW.ink}` : `1px solid ${WW.mist}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: active ? 700 : 500,
              }}>{t}</div>
            );
          })}
        </div>
      </div>

      <div style={{ height: 10, background: WW.paper }}/>

      {/* 분 */}
      <div style={{ padding: '20px', background: WW.white }}>
        <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.3, marginBottom: 14 }}>
          시작하실 분을 선택해주세요
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
          {['0분','10분','20분','30분','40분','50분'].map((t) => {
            const active = t === '30분';
            const avail = t === '30분';
            return (
              <div key={t} className="ww-num" style={{
                height: 44, borderRadius: 999,
                background: active ? WW.ink : WW.mist,
                color: active ? WW.white : WW.slate,
                border: active ? `1px solid ${WW.ink}` : `1px solid ${WW.mist}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12.5, fontWeight: active ? 700 : 500,
              }}>{t}</div>
            );
          })}
        </div>
      </div>
    </div>

    {/* Bottom summary + 선택 */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: WW.white, padding: '12px 20px 28px',
      borderTop: `1px solid ${WW.fog}`, zIndex: 40,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{ 
        flex: 1, height: 52, borderRadius: 999, border: `1.5px solid ${WW.fog}`, background: WW.paper,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 18px',
        fontSize: 13, fontWeight: 600,
      }} className="ww-num">4월 24일 오후 14시 30분</div>
      <div style={{ 
        minWidth: 108, height: 52, borderRadius: 999, background: WW.ink, color: WW.white,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 15, fontWeight: 700, padding: '0 24px',
      }}>선택</div>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════
// (4) 예약/결제 — 요약 + 쿠폰 + 포인트 + 약관 + 결제수단
// ══════════════════════════════════════════════════════════════
const HandBookingPayment = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: WW.paper }}>
    <WWStatus />
    <WWNav title="예약/결제" showBack />

    <div style={{ flex: 1, overflow: 'auto', paddingBottom: 120 }}>
      {/* 예약 정보 card */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{ 
          borderRadius: 14, background: WW.white, border: `1px solid ${WW.fog}`, overflow: 'hidden',
        }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${WW.fog}`, textAlign: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: -0.2 }}>예약 정보</span>
          </div>
          <div style={{ padding: '16px 20px' }}>
            {[
              { k: '차량', v: <>현대 YF쏘나타<br/><span style={{ color: WW.slate }}>43도 9611</span></> },
              { k: '매장', v: '우주디테일링 강남점' },
              { k: '상품', v: '기본(베이직) 디테일링' },
              { k: '일정', v: '2026.04.24(금) 오후 14:30' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', padding: '8px 0', alignItems: 'flex-start' }}>
                <span style={{ width: 56, fontSize: 12.5, color: WW.slate, flexShrink: 0 }}>{r.k}</span>
                <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.5 }}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 총 상품 가격 */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ 
          borderRadius: 14, background: WW.white, border: `1px solid ${WW.fog}`, overflow: 'hidden',
        }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${WW.fog}`, textAlign: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: -0.2 }}>총 상품 가격</span>
          </div>
          <div style={{ padding: '14px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}>
              <span style={{ color: WW.graphite }}>• 기본(베이직) 디테일링</span>
              <span className="ww-num" style={{ fontWeight: 600 }}>60,500원</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13, fontWeight: 700 }}>
              <span>총 상품 가격</span>
              <span className="ww-num">60,500원</span>
            </div>
          </div>
        </div>
      </div>

      {/* 쿠폰 row */}
      <div style={{ 
        padding: '16px 20px', background: WW.white, 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 14, fontWeight: 700 }}>쿠폰</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 13, color: WW.accent, fontWeight: 600 }}>이용 가능한 쿠폰을 확인해보세요.</span>
          <IconChev size={14} stroke={2} style={{ color: WW.accent }}/>
        </div>
      </div>

      <div style={{ height: 8, background: WW.paper }}/>

      {/* 포인트 */}
      <div style={{ padding: '20px', background: WW.white }}>
        <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: -0.2, marginBottom: 4 }}>제휴사 Point 사용 & 적립하기</div>
        <div style={{ fontSize: 12, color: WW.slate, marginBottom: 14 }}>본인인증 후 제휴사 포인트를 적립 및 사용해 보세요.</div>

        {[
          { name: '우주포인트', badge: '결제시 1% 적립', logo: 'w' },
          { name: 'CJ ONE 포인트', logo: 'cj' },
        ].map((p, i) => (
          <div key={i} style={{
            padding: '12px 14px', borderRadius: 12, border: `1px solid ${WW.fog}`,
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8,
          }}>
            <div style={{ 
              width: 28, height: 28, borderRadius: 14, 
              background: p.logo === 'w' ? WW.ink : '#EF4444', color: WW.white,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800,
            }}>{p.logo === 'w' ? 'W' : 'CJ'}</div>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{p.name}</span>
            {p.badge && (
              <span style={{
                fontSize: 10.5, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                background: WW.cloud, color: WW.graphite,
              }}>{p.badge}</span>
            )}
          </div>
        ))}

        {/* 약관 check */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 2px 10px' }}>
          <div style={{ width: 18, height: 18, borderRadius: 9, border: `1.5px solid ${WW.mist}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconCheck size={10} stroke={3} style={{ color: WW.ash }}/>
          </div>
          <span style={{ flex: 1, fontSize: 12.5, color: WW.graphite }}>개인 정보 제 3자 제공 동의 (필수)</span>
          <IconChev size={14} stroke={2} style={{ color: WW.slate }}/>
        </div>

        <div style={{
          padding: '10px 14px', borderRadius: 999, background: WW.mist,
          textAlign: 'center', fontSize: 12, fontWeight: 500, color: WW.slate,
          marginTop: 4,
        }}>본인 인증 이후 제휴사 포인트 적립 & 사용 하기</div>
      </div>

      <div style={{ height: 8, background: WW.paper }}/>

      {/* 결제 정보 */}
      <div style={{ padding: '20px', background: WW.white }}>
        <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.3, marginBottom: 12 }}>결제 정보</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 13 }}>
          <span style={{ color: WW.slate }}>총 상품 가격</span>
          <span className="ww-num" style={{ fontWeight: 500 }}>60,500원</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 14, fontWeight: 700 }}>
          <span>총 결제금액</span>
          <span className="ww-num" style={{ fontSize: 17, fontWeight: 800 }}>60,500원</span>
        </div>
      </div>

      <div style={{ height: 8, background: WW.paper }}/>

      {/* 결제 수단 */}
      <div style={{ padding: '20px', background: WW.white }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.3 }}>결제 수단</div>
          <div style={{ fontSize: 12.5, color: WW.accent, fontWeight: 600 }}>카드 관리</div>
        </div>

        {[
          { name: '우주워시 간편결제', tag: '1초 결제', selected: true },
          { name: '카드 결제' },
        ].map((m, i) => (
          <div key={i} style={{ 
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0',
            borderBottom: i === 0 ? `1px solid ${WW.fog}` : 'none',
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 11,
              background: m.selected ? WW.ink : WW.white,
              border: m.selected ? `1.5px solid ${WW.ink}` : `1.5px solid ${WW.mist}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {m.selected && <div style={{ width: 8, height: 8, borderRadius: 4, background: WW.white }}/>}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</span>
            {m.tag && (
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '3px 7px', borderRadius: 5,
                background: WW.ink, color: WW.white,
              }}>{m.tag}</span>
            )}
          </div>
        ))}
      </div>

      <div style={{ height: 8, background: WW.paper }}/>

      {/* 약관 row */}
      <div style={{ padding: '18px 20px', background: WW.white, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 18, height: 18, borderRadius: 9, border: `1.5px solid ${WW.ink}`, background: WW.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconCheck size={11} stroke={3} style={{ color: WW.white }}/>
        </div>
        <span style={{ flex: 1, fontSize: 12.5, color: WW.graphite }}>예약 취소/환불 수수료 결제 진행 동의(필수)</span>
        <IconChev size={14} stroke={2} style={{ color: WW.slate }}/>
      </div>

      <div style={{ padding: '6px 20px 16px', fontSize: 10.5, color: WW.slate, lineHeight: 1.55 }}>
        * 주식회사 우주워시는 통신판매중개자로서 통신판매의 당사자가 아니며, 입점판매자가 등록한 상품정보 및 거래에 대한 책임을 지지 않습니다.
      </div>
    </div>

    {/* Bottom CTA */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: WW.white, padding: '12px 20px 28px',
      borderTop: `1px solid ${WW.fog}`, zIndex: 40,
    }}>
      <div style={{ 
        height: 56, borderRadius: 999, background: WW.ink, color: WW.white,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, fontWeight: 800, letterSpacing: -0.3,
      }}>
        <span className="ww-num" style={{ marginRight: 4 }}>60,500원</span> 결제하기
      </div>
    </div>
  </div>
);

Object.assign(window, { HandStoreDetail, HandProductDetail, HandDatePicker, HandBookingPayment });
