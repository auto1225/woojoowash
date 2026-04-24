// 우주워시 — User Flow Diagram (화면 연결 플로우)

const FlowNode = ({ x, y, label, num, kind = 'default', size = { w: 140, h: 80 }, note }) => {
  const colors = {
    default: { bg: WW.white, border: WW.fog, text: WW.ink, num: WW.slate },
    primary: { bg: WW.ink, border: WW.ink, text: WW.white, num: WW.accent },
    accent: { bg: WW.accent, border: WW.accent, text: WW.ink, num: WW.ink },
    guest: { bg: WW.cloud, border: WW.mist, text: WW.graphite, num: WW.slate },
  };
  const c = colors[kind];
  return (
    <g transform={`translate(${x},${y})`}>
      <rect width={size.w} height={size.h} rx="10" fill={c.bg} stroke={c.border} strokeWidth="1.5"/>
      {num && <text x="10" y="20" fontSize="9" fontWeight="700" fill={c.num} letterSpacing="1">{num}</text>}
      <text x={size.w/2} y={size.h/2 + 2} textAnchor="middle" fontSize="13" fontWeight="700" fill={c.text} style={{ fontFamily: WW.fontKR }}>{label}</text>
      {note && <text x={size.w/2} y={size.h/2 + 18} textAnchor="middle" fontSize="10" fill={c.text === WW.white ? 'rgba(255,255,255,0.6)' : WW.slate}>{note}</text>}
    </g>
  );
};

// Arrow connector
const FlowArrow = ({ from, to, label, dashed = false, curve = 'h', color = WW.graphite }) => {
  const [x1, y1] = from;
  const [x2, y2] = to;
  let d;
  if (curve === 'h') {
    const mx = (x1 + x2) / 2;
    d = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  } else if (curve === 'v') {
    const my = (y1 + y2) / 2;
    d = `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
  } else {
    d = `M ${x1} ${y1} L ${x2} ${y2}`;
  }
  const labelX = (x1 + x2) / 2;
  const labelY = (y1 + y2) / 2;
  return (
    <g>
      <path d={d} stroke={color} strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" strokeDasharray={dashed ? '4 4' : '0'}/>
      {label && (
        <g>
          <rect x={labelX - (label.length * 3.2 + 8)} y={labelY - 9} width={label.length * 6.4 + 16} height="18" rx="9" fill={WW.white} stroke={WW.fog} strokeWidth="1"/>
          <text x={labelX} y={labelY + 3} textAnchor="middle" fontSize="10" fontWeight="600" fill={color} style={{ fontFamily: WW.fontKR }}>{label}</text>
        </g>
      )}
    </g>
  );
};

const FlowDiagram = () => (
  <div style={{ padding: 40, background: WW.paper, fontFamily: WW.fontKR, minHeight: '100%' }}>
    <div style={{ marginBottom: 30 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: WW.accent, letterSpacing: 1.5, marginBottom: 10 }}>USER FLOW · 화면 연결 플로우</div>
      <div className="ww-disp" style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1.1, marginBottom: 6 }}>
        우주워시 앱 사용자 플로우
      </div>
      <div style={{ fontSize: 13, color: WW.slate }}>
        로그인 없이 둘러보기 → 예약 → 결제 직전 가입 → 완료 · 실선은 기본 플로우, 점선은 선택/되돌아가기
      </div>
    </div>

    {/* Legend */}
    <div style={{ display: 'flex', gap: 20, marginBottom: 24, fontSize: 11, color: WW.graphite, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 18, height: 12, borderRadius: 3, background: WW.ink }}/> 메인 플로우
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 18, height: 12, borderRadius: 3, background: WW.cloud, border: `1px solid ${WW.mist}` }}/> 게스트 상태
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 18, height: 12, borderRadius: 3, background: WW.accent }}/> 중요 전환점
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 18, height: 12, borderRadius: 3, background: WW.white, border: `1px solid ${WW.fog}` }}/> 서브 화면
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="30" height="12"><path d="M 0 6 L 28 6" stroke={WW.graphite} strokeWidth="1.5" strokeDasharray="4 4"/></svg> 선택 경로
      </div>
    </div>

    <svg viewBox="0 0 1800 1400" width="100%" style={{ background: WW.white, borderRadius: 12, border: `1px solid ${WW.fog}` }}>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={WW.graphite}/>
        </marker>
      </defs>

      {/* ============================================
          ROW 1 — ENTRY (y: 80)
          Login → Guest Home (둘러보기) OR Login Home
          ============================================ */}
      <text x="40" y="56" fontSize="11" fontWeight="700" fill={WW.accent} letterSpacing="1.5" style={{ fontFamily: WW.fontKR }}>① 진입 · ENTRY</text>
      <FlowNode x={80} y={80} label="Login" num="01" note="앱 첫 진입" size={{w: 140, h: 80}}/>
      <FlowNode x={340} y={20} label="Home" num="03" note="로그인 상태" kind="primary"/>
      <FlowNode x={340} y={140} label="Home 둘러보기" num="02" note="비로그인 게스트" kind="guest"/>

      <FlowArrow from={[220, 120]} to={[340, 60]} label="카카오/네이버 로그인" color={WW.ink}/>
      <FlowArrow from={[220, 120]} to={[340, 180]} label="둘러보기 →" dashed color={WW.slate}/>
      <FlowArrow from={[410, 140]} to={[410, 100]} label="가입" dashed color={WW.slate}/>

      {/* ============================================
          ROW 2 — EXPLORE (y: 300)
          Home → 매장찾기 / 예약내역 / 마이 / 할인패스
          ============================================ */}
      <line x1="40" y1="260" x2="1760" y2="260" stroke={WW.fog} strokeWidth="1"/>
      <text x="40" y="296" fontSize="11" fontWeight="700" fill={WW.accent} letterSpacing="1.5" style={{ fontFamily: WW.fontKR }}>② 탐색 · EXPLORE</text>

      <FlowNode x={340} y={340} label="Home" num="03" kind="primary"/>
      <FlowNode x={600} y={320} label="매장 찾기" num="04" note="지도 + 리스트"/>
      <FlowNode x={600} y={440} label="할인패스" num="13" note="멤버십 가입"/>
      <FlowNode x={600} y={200} label="예약내역" num="09" note="지난 예약 확인"/>
      <FlowNode x={820} y={550} label="즐겨찾기" num="10" note="자주 가는 매장"/>

      <FlowArrow from={[480, 360]} to={[600, 360]} label="세차 시작" color={WW.ink}/>
      <FlowArrow from={[480, 380]} to={[600, 470]} label="할인패스" dashed/>
      <FlowArrow from={[480, 340]} to={[600, 240]} dashed label="탭바 이동"/>

      {/* ============================================
          ROW 3 — BOOKING FUNNEL (y: 600)
          매장찾기 → 매장 상세/예약 → 결제직전가입 → 결제 → 완료
          ============================================ */}
      <line x1="40" y1="540" x2="1760" y2="540" stroke={WW.fog} strokeWidth="1"/>
      <text x="40" y="576" fontSize="11" fontWeight="700" fill={WW.accent} letterSpacing="1.5" style={{ fontFamily: WW.fontKR }}>③ 예약 퍼널 · BOOKING FUNNEL</text>

      <FlowNode x={80} y={640} label="매장 찾기" num="04"/>
      <FlowNode x={320} y={640} label="매장 상세 · 예약" num="05" note="서비스/시간 선택"/>
      <FlowNode x={580} y={640} label="결제 직전 가입" num="06" kind="accent" note="★ 게스트만 노출"/>
      <FlowNode x={840} y={640} label="결제" num="07" kind="primary" note="카드/간편결제"/>
      <FlowNode x={1100} y={640} label="예약 완료" num="08" kind="accent" note="QR + 일정 추가"/>
      <FlowNode x={1360} y={640} label="매장 입장" num="" note="QR 스캔"/>
      <FlowNode x={1600} y={640} label="Before/After" num="12" kind="primary" note="기록/공유"/>

      <FlowArrow from={[220, 680]} to={[320, 680]} color={WW.ink}/>
      <FlowArrow from={[460, 680]} to={[580, 680]} label="로그인 상태면 SKIP" color={WW.ink}/>
      <FlowArrow from={[720, 680]} to={[840, 680]} label="카카오 3초 가입" color={WW.ink}/>
      <FlowArrow from={[980, 680]} to={[1100, 680]} label="결제 완료" color={WW.ink}/>
      <FlowArrow from={[1240, 680]} to={[1360, 680]} color={WW.ink}/>
      <FlowArrow from={[1500, 680]} to={[1600, 680]} label="세차 후 자동" color={WW.accent}/>

      {/* Skip path arrow */}
      <path d="M 460 660 C 550 580, 740 580, 840 660" stroke={WW.slate} strokeWidth="1.5" fill="none" strokeDasharray="4 4" markerEnd="url(#arrow)"/>
      <rect x="596" y="592" width="128" height="18" rx="9" fill={WW.white} stroke={WW.fog}/>
      <text x="660" y="605" textAnchor="middle" fontSize="10" fontWeight="600" fill={WW.slate} style={{ fontFamily: WW.fontKR }}>로그인 회원 → 바로 결제</text>

      {/* Cancel path */}
      <path d="M 1100 720 C 1000 800, 700 800, 600 720" stroke={WW.danger} strokeWidth="1.5" fill="none" strokeDasharray="4 4" markerEnd="url(#arrow)"/>
      <rect x="790" y="770" width="110" height="18" rx="9" fill={WW.white} stroke={WW.fog}/>
      <text x="845" y="783" textAnchor="middle" fontSize="10" fontWeight="600" fill={WW.danger} style={{ fontFamily: WW.fontKR }}>1시간 전 취소 가능</text>

      {/* ============================================
          ROW 4 — PROFILE (y: 900)
          ============================================ */}
      <line x1="40" y1="860" x2="1760" y2="860" stroke={WW.fog} strokeWidth="1"/>
      <text x="40" y="896" fontSize="11" fontWeight="700" fill={WW.accent} letterSpacing="1.5" style={{ fontFamily: WW.fontKR }}>④ 마이 & 설정 · MY</text>

      <FlowNode x={80} y={960} label="마이 프로필" num="11" kind="primary" size={{w: 140, h: 80}}/>
      <FlowNode x={320} y={920} label="예약내역" num="09"/>
      <FlowNode x={320} y={1040} label="내 차량" num="14" note="차량 등록/관리"/>
      <FlowNode x={560} y={920} label="쿠폰" num="15" note="할인 쿠폰함"/>
      <FlowNode x={560} y={1040} label="할인패스" num="13" note="멤버십 관리"/>
      <FlowNode x={800} y={920} label="Before/After" num="12" note="세차 기록"/>
      <FlowNode x={800} y={1040} label="즐겨찾기" num="10"/>

      {[[220,1000,320,960],[220,1000,320,1080],[460,960,560,960],[460,1000,560,1080],[700,960,800,960],[700,1000,800,1080]].map((p, i) => (
        <FlowArrow key={i} from={[p[0],p[1]]} to={[p[2],p[3]]} color={WW.slate}/>
      ))}

      {/* ============================================
          LEGEND annotation — flow highlights
          ============================================ */}
      <g transform="translate(1080, 920)">
        <rect width="660" height="200" rx="12" fill={WW.cloud} stroke={WW.fog}/>
        <text x="24" y="34" fontSize="11" fontWeight="700" fill={WW.accent} letterSpacing="1" style={{ fontFamily: WW.fontKR }}>FLOW HIGHLIGHTS</text>
        {[
          { i: '★', t: '회원가입 시점을 결제 직전으로 늦춤', d: '둘러보기 → 예약 → 결제 직전 가입. 이탈률 최소화' },
          { i: '⚡', t: '로그인 회원은 가입 단계 건너뜀', d: '회원가입 바텀시트는 게스트에게만 노출' },
          { i: '◎', t: 'Before/After가 예약 완료 후 자동 연결', d: '세차 후 사진이 예약 기록에 바로 저장' },
          { i: '✕', t: '이용 1시간 전까지 무료 취소 가능', d: '결제 → 완료 이후에도 자유롭게 되돌아갈 수 있음' },
        ].map((h, i) => (
          <g key={i} transform={`translate(24, ${60 + i * 32})`}>
            <text x="0" y="12" fontSize="14" fontWeight="700" fill={WW.accent}>{h.i}</text>
            <text x="22" y="12" fontSize="12" fontWeight="700" fill={WW.ink} style={{ fontFamily: WW.fontKR }}>{h.t}</text>
            <text x="22" y="26" fontSize="10" fill={WW.slate} style={{ fontFamily: WW.fontKR }}>{h.d}</text>
          </g>
        ))}
      </g>

      {/* ============================================
          ROW 5 — WEB TO APP (y: 1200)
          ============================================ */}
      <line x1="40" y1="1180" x2="1760" y2="1180" stroke={WW.fog} strokeWidth="1"/>
      <text x="40" y="1216" fontSize="11" fontWeight="700" fill={WW.accent} letterSpacing="1.5" style={{ fontFamily: WW.fontKR }}>⑤ 웹 진입 · WEB ENTRY</text>

      <FlowNode x={80} y={1260} label="홈페이지" num="W" note="랜딩 / SEO"/>
      <FlowNode x={340} y={1220} label="App Store" size={{w: 120, h: 60}}/>
      <FlowNode x={340} y={1300} label="Google Play" size={{w: 120, h: 60}}/>
      <FlowNode x={560} y={1260} label="앱 설치 → Login" num="01" kind="accent"/>
      <FlowNode x={840} y={1260} label="매장 상세" num="05" note="딥링크 직접 진입"/>

      <FlowArrow from={[220, 1300]} to={[340, 1250]} color={WW.ink}/>
      <FlowArrow from={[220, 1300]} to={[340, 1330]} color={WW.ink}/>
      <FlowArrow from={[460, 1250]} to={[560, 1290]} color={WW.ink}/>
      <FlowArrow from={[460, 1330]} to={[560, 1300]} color={WW.ink}/>
      <FlowArrow from={[700, 1300]} to={[840, 1300]} label="예약 지점부터 시작" color={WW.ink}/>
    </svg>
  </div>
);

window.FlowDiagram = FlowDiagram;
