# 우주워시 (WoojooWash)

셀프세차 · 손세차 · 픽업 세차 예약 플랫폼. 하이브리드 웹앱(Next.js) + 홈페이지. 추후 Capacitor 네이티브 래핑 예정.

## 스택

- **Frontend**: Next.js 14 (App Router) · TypeScript strict · Tailwind v3
- **Font**: Pretendard Variable (한글) + tabular-nums
- **DB**: PostgreSQL 16 (Docker) + Prisma 6
- **Auth** (예정): NextAuth.js — 카카오/네이버/애플/구글 OAuth
- **Payments** (예정): 토스페이먼츠
- **Maps** (예정): 카카오맵 SDK
- **Wrapping** (Phase 2): Capacitor

## 프로젝트 구조

```
src/app/
├─ (web)/          # 홈페이지 (랜딩 · 매장 · 할인패스 · 제휴 · 다운로드 · 고객센터)
└─ app/            # 웹앱 (로그인 · 홈 · 매장 · 예약 · 마이)
   └─ (tabs)/      # 하단 탭

prisma/
├─ schema.prisma   # 전체 도메인 스키마
├─ migrations/     # 마이그레이션 SQL
└─ seed.ts         # 시드 데이터
```

## 로컬 개발

### 1. DB 기동 (최초 1회)

```bash
npm install
npm run db:up                 # Postgres 16 + pgAdmin 컨테이너 기동
npm run db:migrate            # 스키마 마이그레이션
npm run db:seed               # 샘플 데이터 (매장·상품·데모 유저)
```

### 2. 개발 서버

```bash
npm run dev                   # http://localhost:3000
```

### DB 툴

| 명령 | 설명 |
|---|---|
| `npm run db:up` / `db:down` | 컨테이너 기동/중지 |
| `npm run db:migrate` | 스키마 변경 후 마이그레이션 생성·적용 |
| `npm run db:push` | 마이그레이션 없이 즉시 반영 (프로토타이핑) |
| `npm run db:studio` | Prisma Studio (GUI) `http://localhost:5555` |
| `npm run db:seed` | 시드 재실행 |
| `npm run db:reset` | DB 비우고 마이그레이션 + 시드 재실행 |

### DB 접속 정보 (로컬)

- **Postgres**: `localhost:5432` · user `woojoowash` · pw `woojoowash_dev_pw` · db `woojoowash`
- **pgAdmin**: `http://localhost:5050` · `admin@woojoowash.kr` / `admin`

## 주요 페이지

- `/home` — 홈페이지 랜딩
- `/app` — 웹앱 홈 (모바일 428px 고정 폭)
- `/app/login` — 소셜 로그인
- `/app/stores` — 매장 검색 (지도 + 리스트)
- `/app/stores/[id]` — 매장 상세 → 상품 → 일시 → 결제 → 완료 플로우
- `/pass` — 할인패스 플랜
- `/partners` — 입점 문의

## 환경 변수

`.env.example` 참고 → `.env.local` 로 복사. DB는 `.env` 에 `DATABASE_URL` 로 Prisma가 읽습니다.

## 핸드오프

디자인 레퍼런스(JSX)와 설계 문서는 `design_handoff/` 참고. 루트의 `CLAUDE.md` 가 Claude Code 컨텍스트입니다.

## Roadmap

- [x] Sprint 1 — 토큰 + UI 프리미티브
- [x] Sprint 2 — 정적 화면 (mock)
- [x] Sprint 2.5 — 상용 리디자인 (실사·애니메이션)
- [x] Sprint 3.1 — Postgres + Prisma 스키마·마이그레이션·시드
- [ ] Sprint 3.2 — NextAuth + 카카오 OAuth
- [ ] Sprint 3.3 — mock → DB 실제 연동
- [ ] Sprint 4 — 토스페이먼츠 + 카카오맵
- [ ] Sprint 5 — Polish (skeleton · error · empty · push)
- [ ] Sprint 6 — Capacitor 래핑
