# 우주워시 — Claude Code 프로젝트 컨텍스트

## 프로젝트 요약
셀프세차 · 손세차 · 픽업 세차 예약 플랫폼. 하이브리드 웹앱(Next.js) + 홈페이지 + 추후 Capacitor 래핑.

## 스택 (확정)
- **Next.js 14 App Router + TypeScript strict + Tailwind v4**
- **Pretendard Variable** (한글), tabular-nums (숫자)
- **shadcn/ui** 기반 UI 프리미티브
- **Zustand** (클라 상태) + **@tanstack/react-query** (서버 상태)
- **Supabase** (Auth + DB + Storage)
- **토스페이먼츠** 결제
- **카카오맵 SDK** 지도
- Phase 2: **Capacitor** 네이티브 래핑

## 디자인 원칙
- **미니멀 · 모노크롬** — `ink #0A0A0B` + `white`. 액센트는 `#1E40FF` 하나만.
- **타이포 강조** — 큰 letter-spacing, 굵은 display (Pretendard 800)
- **숫자는 항상 tabular-nums** (`.ww-num`)
- **이모지 금지** — 아이콘은 전부 stroke-based monoline
- **그림자 최소화** — 테두리 (`--ww-fog`) 위주로 구조
- **둥근 pill 버튼** — primary CTA는 `rounded-full`
- **바텀시트** — 모달은 전부 아래에서 올라오는 시트

## 라우팅 그룹
- `(web)` — 홈페이지, SSR, 데스크톱 우선
- `(app)` — 웹앱, 모바일 폭 428px max, 하단 탭바

## 필수 규칙
1. **토큰 우선** — 하드코딩된 색상/간격 금지. 항상 `var(--ww-*)` 또는 Tailwind 토큰.
2. **서버 컴포넌트 기본** — 인터랙션 필요할 때만 `"use client"`
3. **숫자 포맷** — 금액은 항상 `toLocaleString('ko-KR')` + "원"
4. **날짜/시간** — `date-fns` + 한국어 로케일
5. **이미지** — `next/image` 사용, 세차 전후 사진은 Supabase Storage
6. **환경변수** — `NEXT_PUBLIC_*` 은 공개 키만

## 주요 플로우 요약

### 예약 퍼널 (손세차, 핵심)
`매장찾기 → 매장상세 → 상품선택 → 일시선택(모달) → 결제(게스트면 가입→) → 완료(QR)`

게스트 가입은 **결제 직전**에만 일어남. 로그인 회원은 스킵.

### 취소 정책
- 이용 1시간 전까지 무료 취소
- 그 이후는 `예약 취소/환불 수수료 결제 진행 동의` 약관에 따라

## 디자인 레퍼런스 위치
프로젝트 내 `design_handoff_woojoowash/references/` 폴더 참조. 모든 화면이 JSX로 구현되어 있어서 인라인 스타일을 그대로 참고 가능.

## 구현 시작 전 체크리스트
- [ ] Supabase 프로젝트 생성 + env 설정
- [ ] 카카오 Developers 앱 등록 (OAuth + Map)
- [ ] 토스페이먼츠 테스트 클라이언트 키 발급
- [ ] Next.js 프로젝트 init + Tailwind + tokens.css
- [ ] Pretendard 폰트 layout.tsx 에 link
- [ ] UI 프리미티브 전부 작성 완료 후 화면 구현 시작

## 하지 말 것
- 디자인 시스템에 없는 새로운 색상 만들기
- 불필요한 필러 콘텐츠 추가 (디자이너가 이미 의도적으로 여백 유지)
- 이모지 추가
- 모든 곳에 그라데이션 배경 사용
- CSS-in-JS 라이브러리 추가 (Tailwind + CSS vars 로 충분)
