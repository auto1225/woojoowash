# 우주워시 — Claude Code 프로젝트 컨텍스트

## 프로젝트 요약
셀프세차 · 손세차 · 픽업 세차 예약 플랫폼. 하이브리드 웹앱(Next.js) + 홈페이지 + 추후 Capacitor 래핑.

## 스택 (확정)
- **Next.js 14 App Router + TypeScript strict + Tailwind v3**
- **Pretendard Variable** (한글), tabular-nums (숫자)
- **PostgreSQL 16** (로컬은 Docker, 프로덕션은 회사 Postgres 서버) + **Prisma 6**
- **NextAuth.js** (예정) — 카카오·네이버·애플·구글 OAuth
- **토스페이먼츠** 결제 (예정)
- **카카오맵 SDK** 지도 (예정)
- Phase 2: **Capacitor** 네이티브 래핑

## 디자인 원칙
- **미니멀 · 모노크롬 기반 + 블루 액센트** (`#1E40FF` · `#4D68FF`)
- **타이포 강조** — 큰 letter-spacing, 굵은 display (Pretendard 800)
- **숫자는 항상 tabular-nums** (`.ww-num` 또는 `ww-num` className)
- **이모지 금지** — 아이콘은 전부 stroke-based monoline
- **라운드 컴포넌트** — primary CTA는 `rounded-full`
- **실사 이미지** — 히어로/매장/리뷰/상품 카드는 Unsplash(프로토타입) → Supabase/S3로 교체 예정
- **바텀시트** — 모달은 전부 아래에서 올라오는 시트

## 라우팅 그룹
- `(web)` — 홈페이지, SSR, 데스크톱 우선
- `app/` — 웹앱, 모바일 폭 428px max
  - `app/(tabs)/` — 하단 탭(홈·즐겨찾기·예약·마이)이 붙는 그룹
  - 그 외 `app/*` 는 탭바 없이 렌더

## 필수 규칙
1. **토큰 우선** — 하드코딩된 색상/간격 금지. 항상 `var(--ww-*)` 또는 Tailwind 토큰.
2. **서버 컴포넌트 기본** — 인터랙션 필요할 때만 `"use client"`
3. **숫자 포맷** — 금액은 항상 `toLocaleString('ko-KR')` + "원"
4. **날짜/시간** — `date-fns` + 한국어 로케일 (Sprint 4 때)
5. **이미지** — `next/image` 사용. `src/lib/images.ts` 에 공용 URL 정리
6. **환경변수** — `NEXT_PUBLIC_*` 은 공개 키만. DB URL은 `.env` 에만.
7. **Prisma Client** — `src/lib/db.ts` 의 `db` 싱글톤 사용

## 주요 플로우 요약

### 예약 퍼널 (손세차, 핵심)
`매장찾기 → 매장상세 → 상품선택 → 일시선택(모달) → 결제(게스트면 가입→) → 완료(QR)`

게스트 가입은 **결제 직전**에만 일어남. 로그인 회원은 스킵.

### 취소 정책
- 이용 1시간 전까지 무료 취소
- 그 이후는 `예약 취소/환불 수수료 결제 진행 동의` 약관에 따라

## DB 작업 플로우

```bash
# 스키마 변경 (prisma/schema.prisma 수정 후)
npm run db:migrate              # dev 마이그레이션 생성 + 적용 + generate

# 빠른 프로토타이핑 (마이그레이션 없이)
npm run db:push

# GUI 로 데이터 확인
npm run db:studio

# 전체 리셋
npm run db:reset                # 마이그레이션 + seed 재실행
```

## 디자인 레퍼런스 위치
`design_handoff/` 폴더 참조. 모든 화면이 JSX로 구현되어 있어서 인라인 스타일을 그대로 참고 가능.

## 구현 시작 전 체크리스트
- [x] Next.js 프로젝트 init + Tailwind + tokens.css
- [x] Pretendard 폰트 layout.tsx 에 link
- [x] UI 프리미티브
- [x] 화면 구현 (mock 데이터)
- [x] Postgres(Docker) + Prisma 스키마·마이그레이션·시드
- [ ] NextAuth 설정
- [ ] 카카오 Developers 앱 등록 (OAuth + Map)
- [ ] 토스페이먼츠 테스트 클라이언트 키 발급

## 하지 말 것
- 디자인 시스템에 없는 새로운 색상 만들기
- 불필요한 필러 콘텐츠 추가
- 이모지 추가
- CSS-in-JS 라이브러리 추가 (Tailwind + CSS vars 로 충분)
- Supabase 도입 (회사 Postgres 사용 결정)
