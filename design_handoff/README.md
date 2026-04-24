# Handoff: 우주워시 (WoojooWash) — 세차 예약 플랫폼

> **Claude Code 개발자에게 전달**: 이 폴더의 파일들은 HTML/JSX로 만든 **디자인 레퍼런스**입니다. 그대로 배포하는 게 아니라, **Next.js 14 (App Router) + TypeScript + Tailwind** 환경에서 이 디자인을 **재구현**하는 것이 목표입니다.

---

## 1. 프로젝트 개요

**우주워시 (WoojooWash)** 는 셀프세차 · 손세차 · 픽업배달 세차를 통합 예약하는 하이브리드 앱/웹 플랫폼입니다.

| 항목 | 내용 |
|---|---|
| 제품 형태 | **하이브리드** — 반응형 웹앱 + 홈페이지, 추후 Capacitor로 iOS/Android 래핑 |
| 핵심 플로우 | 둘러보기(게스트) → 로그인 → 홈 → 매장 찾기 → 예약 → **결제 직전 가입** → 결제 → 완료 → Before/After |
| 디자인 언어 | 미니멀 · 모노크롬 (ink + white) + 단일 액센트 (electric blue) |
| 타입 | Pretendard Variable (한글), Inter (영문), 숫자 tabular-nums |
| 스크린 수 | 앱 15개 + 손세차 예약 4개 + 웹 1개 + 브랜드/시스템 |

**Fidelity: 하이파이 (Hi-fi)**  
모든 색상/타이포/간격이 토큰으로 정의되어 있고, 각 화면은 픽셀 단위로 완성도 있게 그려져 있습니다. 최대한 그대로 재현해주세요.

---

## 2. 권장 기술 스택

```
Frontend
├─ Next.js 14 (App Router)
├─ TypeScript (strict)
├─ Tailwind CSS v4
├─ Pretendard Variable (CDN)
├─ shadcn/ui (컴포넌트 베이스)
├─ React Query (@tanstack/react-query) — 서버 상태
├─ Zustand — 클라이언트 상태 (예약 폼 등)
├─ react-hook-form + zod — 폼 검증
├─ framer-motion — 애니메이션
└─ Lucide React — 아이콘 (또는 직접 커스텀)

Backend (권장)
├─ Supabase (Auth + Postgres + Storage + Realtime)
│  또는
├─ NestJS + PostgreSQL + Prisma + S3

3rd Party
├─ 카카오맵 SDK — 매장 찾기
├─ 토스페이먼츠 또는 포트원 — 결제
├─ 카카오 / 네이버 / Apple OAuth — 소셜 로그인
└─ FCM — 푸시 알림

Native Wrapping (Phase 2)
└─ Capacitor 6 (@capacitor/ios, @capacitor/android)
```

---

## 3. 라우팅 구조 (Next.js App Router)

```
app/
├─ (web)/                        # 홈페이지 그룹 (SSR, SEO)
│  ├─ layout.tsx                 # 공개 레이아웃 (GNB + 푸터)
│  ├─ page.tsx                   # → web/landing.jsx
│  ├─ stores/page.tsx            # 매장 목록 (공개)
│  ├─ pass/page.tsx              # 할인패스 소개
│  ├─ partners/page.tsx          # 제휴 문의
│  └─ download/page.tsx          # 앱 다운로드
│
├─ (app)/                        # 웹앱 그룹 (CSR 위주, 모바일 폭)
│  ├─ layout.tsx                 # 앱 레이아웃 (탭바 포함)
│  ├─ login/page.tsx             # 01 · Login → app/guest.jsx AppLogin
│  ├─ welcome/page.tsx           # 02 · 게스트 홈 → AppHomeGuest
│  ├─ page.tsx                   # 03 · Home (로그인) → app/home.jsx AppHome
│  ├─ stores/
│  │  ├─ page.tsx                # 04 · Store Finder → app/finder.jsx AppFinder
│  │  └─ [id]/
│  │     ├─ page.tsx             # H1 · 매장 상세 → app/hand-wash.jsx HandStoreDetail
│  │     └─ products/[pid]/
│  │        ├─ page.tsx          # H2 · 상품 상세 → HandProductDetail
│  │        └─ date/page.tsx     # H3 · 예약일시 선택 (모달 라우트)
│  ├─ self-wash/
│  │  └─ [storeId]/page.tsx      # 05 · 셀프세차 예약 → app/store.jsx AppStore
│  ├─ booking/
│  │  ├─ guest-signup/page.tsx   # 06 · 결제 직전 가입 ★ → AppGuestSignup
│  │  ├─ payment/page.tsx        # 07/H4 · 결제 → AppPayment 또는 HandBookingPayment
│  │  └─ [id]/confirmed/page.tsx # 08 · 예약 완료 → AppConfirmed
│  ├─ reservations/page.tsx      # 09 · 예약 내역 → AppReservations
│  ├─ favorites/page.tsx         # 10 · 즐겨찾기 → AppFav
│  ├─ me/
│  │  ├─ page.tsx                # 11 · 마이 → AppMe
│  │  ├─ before-after/page.tsx   # 12 · Before/After → AppBeforeAfter
│  │  ├─ cars/page.tsx           # 14 · 내 차량 → AppCars
│  │  └─ coupons/page.tsx        # 15 · 쿠폰 → AppCoupons
│  └─ pass/page.tsx              # 13 · 할인패스 → AppPass
│
└─ api/                          # (선택) Next API routes
   ├─ bookings/route.ts
   ├─ stores/route.ts
   └─ payments/route.ts
```

### 그룹 레이아웃 전략
- `(web)` — `<html>` 기본, 데스크톱 우선, 푸터/GNB 포함
- `(app)` — 모바일 뷰포트 고정 폭 (max-w-[428px] mx-auto), 하단 탭바, Status bar 영역 확보

---

## 4. 디자인 토큰 (CSS 변수로 이식)

파일: `src/styles/tokens.css`

```css
:root {
  /* Brand — Monochrome */
  --ww-ink:       #0A0A0B;
  --ww-charcoal:  #1C1C1F;
  --ww-graphite:  #3A3A3D;
  --ww-slate:     #6E6E73;
  --ww-ash:       #A8A8AD;
  --ww-mist:      #D4D4D9;
  --ww-fog:       #E8E8EB;
  --ww-cloud:     #F2F2F4;
  --ww-paper:     #F7F7F8;
  --ww-white:     #FFFFFF;

  /* Accent */
  --ww-accent:     #1E40FF;
  --ww-accent-soft:#E6EAFF;

  /* Semantic */
  --ww-danger:  #E4002B;
  --ww-success: #0A7D32;
  --ww-warning: #B76E00;

  /* Radii */
  --ww-r-xs: 6px;
  --ww-r-sm: 10px;
  --ww-r-md: 14px;
  --ww-r-lg: 20px;
  --ww-r-xl: 28px;

  /* Shadows */
  --ww-shadow-card: 0 1px 2px rgba(10,10,11,0.04), 0 4px 20px rgba(10,10,11,0.04);
  --ww-shadow-pop:  0 8px 32px rgba(10,10,11,0.12);
  --ww-shadow-btn:  0 1px 3px rgba(10,10,11,0.08);
}

@font-face { /* Pretendard Variable via CDN in layout */ }

* { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

.ww-disp { font-family: 'Pretendard Variable', sans-serif; font-weight: 800; letter-spacing: -0.02em; }
.ww-num  { font-variant-numeric: tabular-nums; font-feature-settings: 'tnum'; }
```

### Tailwind 설정 (tailwind.config.ts)

```ts
export default {
  theme: {
    extend: {
      colors: {
        ink: 'var(--ww-ink)',
        charcoal: 'var(--ww-charcoal)',
        graphite: 'var(--ww-graphite)',
        slate: 'var(--ww-slate)',
        ash: 'var(--ww-ash)',
        mist: 'var(--ww-mist)',
        fog: 'var(--ww-fog)',
        cloud: 'var(--ww-cloud)',
        paper: 'var(--ww-paper)',
        accent: 'var(--ww-accent)',
        'accent-soft': 'var(--ww-accent-soft)',
        danger: 'var(--ww-danger)',
      },
      borderRadius: {
        'ww-xs': 'var(--ww-r-xs)',
        'ww-sm': 'var(--ww-r-sm)',
        'ww-md': 'var(--ww-r-md)',
        'ww-lg': 'var(--ww-r-lg)',
        'ww-xl': 'var(--ww-r-xl)',
      },
      fontFamily: {
        sans: ['Pretendard Variable', 'Pretendard', 'system-ui'],
        disp: ['Pretendard Variable', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace'],
      },
    },
  },
}
```

---

## 5. 타이포그래피 스케일

| 역할 | 크기 / 굵기 | letter-spacing | 용도 |
|---|---|---|---|
| Display | 28–64px / 800 | -0.02em ~ -0.03em | 히어로, 섹션 타이틀 |
| Title | 22px / 800 | -0.5 | 화면 타이틀 |
| Heading | 17–18px / 700 | -0.3 | 카드 헤더 |
| Body | 13–15px / 500 | -0.2 | 본문 |
| Label | 11–12px / 600–700 | 0.5~1.5 (트래킹) | 카테고리, 메타 |
| Caption | 10–11px / 500 | 0 | 보조 정보 |
| Numeric | tabular-nums | — | 금액, 날짜, 시간 |

---

## 6. 컴포넌트 매핑

### UI 프리미티브 (→ `components/ui/`)
| 디자인 | 컴포넌트 | shadcn 대응 |
|---|---|---|
| `WWCTA` | `<Button variant="primary\|secondary\|accent\|outline" size="lg\|md\|sm">` | Button |
| `WWChip` | `<Chip active>` | Badge (변형) |
| `WWCircleChip` | `<CircleChip active ring disabled>` (커스텀) | — |
| `WWCard` | `<Card>` | Card |
| `WWRow` | `<ListRow icon title meta right>` | — |
| `WWNav` | `<AppBar title showBack right>` | — |
| `WWTabBar` | `<BottomTabBar active>` | — |
| `WWStatus` | 필요 시 Capacitor Safe-area 사용 | — |
| `WWSectionGap` | `<div className="h-3 bg-cloud"/>` | — |

### 화면 컴포넌트 (→ `app/(app)/**/page.tsx` 에 구현)
위 라우팅 구조 참조. 각 screen은 JSX 레퍼런스 파일을 보면서 Tailwind 로 재작성.

### 아이콘
`icons.jsx` 참조. 전부 24x24 stroke-based 커스텀 아이콘.
- **옵션 A**: `lucide-react` 로 대체 (권장, 90% 매칭)
- **옵션 B**: SVG를 그대로 가져와 `components/icons/*.tsx` 로 컴포넌트화

---

## 7. 주요 화면별 구현 가이드

### 📱 01 · Login (AppLogin)
- 파일: `app/guest.jsx`
- 레이아웃: 상단 여백 → 로고 → 타이틀 → 카카오 대형 CTA + 네이버/구글/애플 3열 → "둘러보기" 텍스트 링크 하단
- 상태: `loading`, 소셜 로그인 에러 핸들링
- **중요**: 카카오 배경 `#FEE500`, 네이버 `#03C75A`, 애플 `#000`, 구글 `white + border`

### 📱 03 · Home (AppHome / AppHomeGuest)
- 파일: `app/home.jsx`, `app/guest.jsx`
- 레이아웃: 헤더(로고 + 알림) → 위치 선택 → 메인 CTA 3종 (손세차/셀프세차/픽업) → 가까운 매장 캐러셀 → 할인패스 배너 → 베스트 리뷰
- **게스트 차이**: 상단에 "로그인하고 시작하기" 스틱 배너, 예약/즐겨찾기 탭은 로그인 유도

### 📱 04 · Store Finder (AppFinder)
- 파일: `app/finder.jsx`
- 레이아웃: 검색바 + 필터칩 → 지도 (상단 50%) + 리스트 (하단 50%, drag-up bottom sheet)
- **카카오맵 SDK**: 클러스터링, 현재 위치, 매장 핀, 선택 시 카드 확장
- 필터: 서비스 종류, 거리, 평점, 영업중

### 📱 H1 · 매장 상세 (HandStoreDetail) ★ 손세차 핵심
- 파일: `app/hand-wash.jsx` (가장 상세한 구현 참조)
- 3개 탭: **상품 / 정보 / 리뷰**
- 상단: 커버 이미지 캐러셀, 투명 네비게이션, 매장 말풍선, 타이틀/주소/전화/별점 + 미니 지도
- 탭 전환 `useState`
- 스크롤 시 탭이 sticky

### 📱 H2 · 상품 상세 (HandProductDetail)
- 파일: `app/hand-wash.jsx`
- 상단 히어로 → 제목/시간/설명 → 주의사항 박스 → 차량 카드 → 추가옵션 그룹 → 예약날짜 CTA (모달 트리거) → 요청사항 textarea (100자)
- 하단 고정: `총 결제금액 pill + 예약하기 버튼` (2열)

### 📱 H3 · 예약일시 선택 (HandDatePicker)
- 파일: `app/hand-wash.jsx`
- **모달 형태** (Next: `@modal/(..)stores/[id]/date` 또는 바텀시트 라우트)
- 날짜 스크롤 (오늘/요일/휴무 상태) → 오전·오후 토글 → 시간 5열 그리드 → 분 6열 그리드
- 선택 상태: `selected={date, ampm, hour, minute}`
- 하단: `선택한 일시 텍스트 + 선택 버튼`

### 📱 H4 · 예약/결제 (HandBookingPayment)
- 파일: `app/hand-wash.jsx`
- 예약정보 카드 → 총 상품가격 카드 → 쿠폰 row → 제휴 포인트 (체크박스 + 약관) → 결제 정보 → 결제 수단 (간편결제/카드) → 약관 체크
- **토스페이먼츠 SDK 연동**:
  ```ts
  const payment = await TossPayments(clientKey).requestPayment(method, {
    amount: 60500,
    orderId: `ww_${Date.now()}`,
    orderName: "기본(베이직) 디테일링",
    successUrl: "/booking/[id]/confirmed",
    failUrl: "/booking/payment?error=true",
  })
  ```

### 📱 06 · 결제 직전 가입 ★ (AppGuestSignup)
- 파일: `app/payment.jsx`
- **바텀시트 모달** (게스트만 표시, 로그인 회원은 스킵)
- 뒷배경 결제화면 dim + 시트에 "3초 가입" 카카오 대형 CTA + 네이버/구글/애플 3열
- 혜택 콜아웃: "첫 결제 3,000원 쿠폰 자동 적용"

### 📱 08 · Confirmed (AppConfirmed)
- 파일: `app/payment.jsx`
- 큰 체크 아이콘 → "예약이 완료됐어요" → 티켓 스타일 카드 (상단 정보 + 점선 + 하단 QR) → 액션 3열 (길찾기/매장문의/일정추가)
- **QR**: 서버에서 생성 또는 `qrcode.react` 라이브러리 사용
- 하단: `홈으로 + 예약 내역 보기` (2열)

### 🖥️ Web Landing (WebLanding)
- 파일: `web/landing.jsx`
- 섹션: Hero → 서비스 3종 → 앱 쇼케이스 → 할인패스 → 제휴 → FAQ → 푸터
- **반응형**: 1280px 기준 디자인, 모바일은 단일컬럼으로
- SEO 필수: `generateMetadata`, OpenGraph, 구조화 데이터

---

## 8. 상태 관리

### Zustand stores (`src/store/`)

```ts
// bookingStore.ts — 예약 폼 전역 상태
interface BookingState {
  storeId: string | null;
  productId: string | null;
  carId: string | null;
  options: string[];         // 추가옵션 id 배열
  date: Date | null;
  time: { hour: number; minute: number } | null;
  request: string;           // 요청사항 (0-100자)
  couponId: string | null;
  paymentMethod: 'easy' | 'card' | null;
  setStore, setProduct, setDate, toggleOption, reset, ...
}

// authStore.ts
interface AuthState {
  user: User | null;
  isGuest: boolean;
  login, logout, loadUser
}

// uiStore.ts — 바텀시트/토스트
```

### React Query keys

```
['stores', { lat, lng, filter }]
['store', storeId]
['store', storeId, 'reviews']
['products', storeId]
['product', productId]
['availability', productId, date]  // 예약 가능 슬롯
['reservations', userId]
['coupons', userId]
```

---

## 9. 백엔드 스키마 (Supabase 기준)

```sql
-- 사용자
profiles (id uuid pk → auth.users, name, phone, created_at)
cars (id, user_id fk, brand, model, plate, is_default)

-- 매장
stores (id, name, address, phone, lat, lng, cover_images jsonb, 
        hours jsonb, services text[], rating, review_count)
products (id, store_id fk, type enum[self|hand|pickup], 
          title, description, duration_min, price, images jsonb, options jsonb)

-- 예약
reservations (id, user_id fk, store_id fk, product_id fk, car_id fk,
              start_at timestamp, duration_min, price, options jsonb,
              request text, status enum[pending|confirmed|done|canceled],
              payment_id fk, created_at)
payments (id, reservation_id fk, method, toss_payment_key, amount, status, ...)

-- 기타
coupons (id, user_id fk, title, discount_type, amount, expires_at, used_at)
pass_subscriptions (id, user_id fk, tier, started_at, expires_at)
favorites (user_id, store_id, primary key composite)
reviews (id, reservation_id fk, rating, body, tags text[], photos jsonb)
before_after (id, reservation_id fk, before_photo, after_photo, created_at)
```

### RLS (Row Level Security)
- `reservations`: `user_id = auth.uid()` only
- `cars`, `favorites`, `coupons`: user 자신만
- `stores`, `products`, `reviews`: 공개 read, admin write

---

## 10. 인터랙션 & 애니메이션

- **페이지 전환**: framer-motion `AnimatePresence` + slide 좌우
- **바텀시트**: `useDrag` + spring (40% → 90% 스냅)
- **탭 전환**: underline `layoutId` 로 shared transition
- **체크박스 on**: 150ms ease-out scale
- **CTA press**: 95% scale + ink → charcoal

### 로딩 / 에러 / 빈 상태
- 모든 list에 skeleton 로더
- 네트워크 에러 → 인라인 재시도 버튼
- 빈 상태 → 중앙 아이콘 + 메시지 + primary CTA

---

## 11. 반응형 전략

| 브레이크포인트 | 행동 |
|---|---|
| **Mobile (0–640)** | 앱 그룹 그대로. 웹 그룹도 단일 컬럼 |
| **Tablet (641–1024)** | 앱 그룹: 중앙 정렬 428px max. 웹 그룹: 2컬럼 |
| **Desktop (1025+)** | 웹 그룹: full layout. 앱 그룹은 "앱에서 열기" 배너 + 중앙 프리뷰 |

앱 그룹 공통 shell:
```tsx
<div className="mx-auto max-w-[428px] min-h-screen bg-white relative">
  {children}
  <BottomTabBar />
</div>
```

---

## 12. Capacitor 래핑 (Phase 2)

```bash
pnpm add @capacitor/core @capacitor/cli
pnpm add @capacitor/ios @capacitor/android
pnpm add @capacitor/push-notifications @capacitor/camera @capacitor/geolocation

npx cap init "우주워시" com.woojoowash.app --web-dir=out
next build && next export  # static export
npx cap add ios && npx cap add android
npx cap sync
```

### 네이티브 플러그인 사용 지점
| 기능 | 플러그인 | 사용 화면 |
|---|---|---|
| 예약 15분 전 알림 | `@capacitor/push-notifications` | 백그라운드 |
| Before/After 촬영 | `@capacitor/camera` | 12 Before/After |
| 현재 위치 | `@capacitor/geolocation` | 04 Finder |
| 매장 공유 | `@capacitor/share` | H1 상단 |
| QR 스캔 (매장 입장) | `@capacitor-community/barcode-scanner` | 08 Confirmed |

Safe Area: `env(safe-area-inset-top)` 사용, `<WWStatus>` 는 iOS에서 시스템 상태바가 노출되므로 제거.

---

## 13. 구현 순서 (Claude Code 권장 스프린트)

### Sprint 1 — Foundation (3–5일)
1. `create-next-app` + TypeScript + Tailwind 초기화
2. `tokens.css` + `tailwind.config.ts` 셋업
3. Pretendard 폰트 주입 (layout.tsx)
4. UI 프리미티브 전부 작성: Button, Chip, CircleChip, AppBar, BottomTabBar, Card, ListRow, SectionGap
5. Icons: lucide-react 설치 + 없는 것만 커스텀

### Sprint 2 — Static Screens (5–7일)
Mock 데이터로 화면만 먼저 다 그림. 순서:
- `(web)/page.tsx` 랜딩
- `(app)/login` → `(app)/welcome` → `(app)/page.tsx` (홈)
- `(app)/stores` 목록 (지도 제외 list만)
- `(app)/stores/[id]` 매장 상세 (3탭)
- 상품 → 일시선택 → 결제 → 완료

### Sprint 3 — Real Backend (1주)
- Supabase 프로젝트 생성 + 스키마 마이그레이션
- Auth (카카오 OAuth)
- API 훅 작성 + mock 제거

### Sprint 4 — Payments & Maps (1주)
- 토스페이먼츠 연동
- 카카오맵 SDK (매장 Finder)

### Sprint 5 — Polish (3–5일)
- 애니메이션, 스켈레톤, 에러 상태, 빈 상태
- 푸시 알림
- Before/After 사진 업로드

### Sprint 6 — Native Wrap (3–5일)
- Capacitor 셋업, iOS/Android 빌드
- 스토어 등록

---

## 14. 파일 구조 제안

```
woojoowash/
├─ src/
│  ├─ app/
│  │  ├─ (web)/
│  │  └─ (app)/
│  ├─ components/
│  │  ├─ ui/              # Button, Chip, Card, ...
│  │  ├─ app/             # AppBar, BottomTabBar, StatusBar
│  │  ├─ web/             # Navbar, Footer, Hero
│  │  └─ icons/
│  ├─ lib/
│  │  ├─ supabase.ts
│  │  ├─ toss.ts
│  │  ├─ kakao-map.ts
│  │  └─ utils.ts
│  ├─ hooks/
│  ├─ store/              # zustand
│  ├─ styles/
│  │  ├─ globals.css
│  │  └─ tokens.css
│  └─ types/
├─ public/
├─ CLAUDE.md              # Claude Code 컨텍스트 (아래 참조)
├─ tailwind.config.ts
├─ next.config.mjs
└─ package.json
```

---

## 15. CLAUDE.md (Claude Code에 넣을 프로젝트 컨텍스트)

이 폴더의 `CLAUDE.md` 를 프로젝트 루트에 복사해서 쓰세요. Claude Code가 자동으로 읽습니다.

---

## 16. 이 폴더에 포함된 디자인 참조 파일

| 파일 | 내용 |
|---|---|
| `references/우주워시 Design.html` | 마스터 디자인 캔버스 — 모든 화면을 한눈에 |
| `references/tokens.js` | 모든 디자인 토큰 (색상, 간격, 폰트) 원본 |
| `references/ww-ui.jsx` | UI 프리미티브 (Button, Chip, Card, Nav 등) |
| `references/icons.jsx` | 커스텀 아이콘 세트 |
| `references/flow-diagram.jsx` | 전체 플로우 다이어그램 |
| `references/app/home.jsx` | 홈 (로그인) |
| `references/app/guest.jsx` | 로그인 + 게스트 홈 |
| `references/app/finder.jsx` | 매장 찾기 |
| `references/app/store.jsx` | 셀프세차 예약 |
| `references/app/hand-wash.jsx` | **손세차 예약 4단계** (레퍼런스 기반 재설계) |
| `references/app/payment.jsx` | 결제 + 완료 + 게스트 가입 바텀시트 |
| `references/app/me.jsx` | 마이 프로필 |
| `references/app/extra.jsx` | 예약내역/즐겨찾기/할인패스/차량/쿠폰 |
| `references/web/landing.jsx` | 홈페이지 랜딩 |
| `references/brand/app-icon.jsx` | 앱 아이콘 디자인 |

---

## 17. 열어보는 방법

로컬에서 `우주워시 Design.html` 을 브라우저로 열면 전체 화면 캔버스가 뜹니다. 각 artboard를 클릭하면 풀스크린 포커스 모드로 볼 수 있어요.

---

**Questions?** 디자인 의도가 불명확한 부분이 있으면 원본 디자인 HTML의 해당 화면을 열어서 컴포넌트 트리를 참고하세요. 모든 인라인 스타일이 그대로 보입니다.
