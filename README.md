# 우주워시 (WoojooWash)

셀프세차 · 손세차 · 픽업 세차 예약 플랫폼. 하이브리드 웹앱(Next.js) + 홈페이지 + 매장 운영자 CMS. 추후 Capacitor 네이티브 래핑 예정.

## 스택

- **Frontend**: Next.js 14 (App Router) · TypeScript strict · Tailwind v3
- **Font**: Pretendard Variable (한글) + tabular-nums
- **DB**: PostgreSQL 16 (Docker) + Prisma 6
- **Auth**: NextAuth.js v5 (Auth.js) + Credentials (이메일/비밀번호)
- **Payments** (예정): 토스페이먼츠
- **Maps** (예정): 카카오맵 SDK
- **Wrapping** (Phase 2): Capacitor

## 프로젝트 구조

```
src/app/
├─ (web)/          # 홈페이지 (랜딩 · 매장 · 할인패스 · 제휴 · 다운로드 · 고객센터)
├─ app/            # 모바일 웹앱 (로그인 · 홈 · 매장 · 예약 · 마이)
│  └─ (tabs)/      # 하단 탭 (홈 / 즐겨찾기 / 나의 예약 / 내 정보)
├─ admin/          # 매장 운영자 CMS (OWNER/ADMIN 전용)
└─ api/            # NextAuth · 가입 · 예약 생성

prisma/
├─ schema.prisma   # 전체 도메인 스키마 (Users · Stores · Products · ...)
├─ migrations/     # 마이그레이션 SQL
└─ seed.ts         # 시드 데이터
```

## 로컬 개발

### 1. DB 기동 (최초 1회)

```bash
npm install
npm run db:up                 # Postgres 16 + pgAdmin 컨테이너 기동
npm run db:migrate            # 스키마 마이그레이션
npm run db:seed               # 샘플 데이터 (매장·상품·데모 계정)
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

## 로컬 데모 계정 & 접속 정보

> ⚠️ 아래는 **로컬 개발 전용** 자격 증명입니다. 프로덕션에서는 절대 사용 금지.
> 실제 운영 환경에서는 강력한 랜덤 값으로 교체하고 `.env.local` (커밋되지 않음)에만 보관하세요.

### 앱 데모 계정

| 역할 | 이메일 | 비밀번호 | 접근 경로 |
|---|---|---|---|
| 일반 유저 | `demo@woojoowash.kr` | `demo1234` | `/app/*` |
| 매장 운영자 | `owner@woojoowash.kr` | `owner1234` | `/partner/*` (강남점·역삼점 소유) |
| 서비스 관리자 | `admin@woojoowash.kr` | `admin1234` | `/admin/*` (전체 백오피스) |

> 일반 유저는 `/app/login`, 매장 운영자는 `/partner/login`, 서비스 관리자는 `/admin/login` 에서 각각 로그인.

### Postgres (로컬 Docker)

- **Host/Port**: `localhost:5432`
- **User / PW**: `woojoowash` / `woojoowash_dev_pw`
- **Database**: `woojoowash`
- **연결 문자열**: `postgresql://woojoowash:woojoowash_dev_pw@localhost:5432/woojoowash?schema=public`

### pgAdmin (로컬 Docker)

- **URL**: http://localhost:5050
- **Email / PW**: `admin@woojoowash.kr` / `admin`
- **서버 등록 시 Host**: `postgres` (컨테이너 이름, `localhost` 아님)

## 주요 페이지

### 사용자 앱
- `/home` — 홈페이지 랜딩
- `/app` — 웹앱 홈 (모바일 428px 고정 폭)
- `/app/login` — 로그인 / 회원가입
- `/app/stores` — 매장 검색 (지도 + 리스트)
- `/app/stores/[id]` — 매장 상세 → 상품 → 일시 → 결제 → 완료
- `/app/reservations` · `/app/me` · `/app/me/cars` · `/app/me/coupons`
- `/pass` — 할인패스 · `/partners` — 입점 문의

### 매장 운영자 CMS (사장님 전용, `/partner`)
- `/partner/login` — 운영자 로그인
- `/partner` — 내 매장 대시보드
- `/partner/stores/[id]` — 매장별 대시보드 (오늘·예정·매출)
- `/partner/stores/[id]/profile` — 매장 정보·홍보 문구·지도 위치 편집 (저장 즉시 앱 반영)
- `/partner/stores/[id]/products` — 상품 CRUD
- `/partner/stores/[id]/schedule` — 영업시간·휴무일
- `/partner/stores/[id]/reservations` — 월 캘린더 + 상태 변경

### 서비스 관리자 CMS (우주워시 내부 팀 전용, `/admin`)
- `/admin/login` — 관리자 로그인
- `/admin` — 종합 대시보드 (회원·매장·예약·매출·신규 문의)
- `/admin/users` — 회원 검색·역할/상태 변경
- `/admin/stores` — 전체 매장 + 소유자 지정 + 영업 여부 토글
- `/admin/inquiries` — 제휴 문의 처리 (상태·내부 메모)
- `/admin/revenue` — 6개월 매출 차트 + 매장별 TOP

## 네이버 지도 (매장 찾기)

`/app/stores` 는 네이버 지도 Web Dynamic Map 으로 동작합니다. Client ID 가
없으면 fallback 배너 + 리스트만 표시됩니다.

### 키 발급 단계

1. [네이버 클라우드 플랫폼 콘솔](https://console.ncloud.com/) 로그인
2. **Services → Application Services → Maps**
3. **Application 등록** → "Web Dynamic Map" 체크
4. **Web 서비스 URL** 에 `http://localhost:3000` 추가 (프로덕션 도메인도 나중에)
5. 발급된 **Client ID** 를 `.env.local` 에 추가:

```bash
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=여기에_Client_ID_붙여넣기
```

6. `npm run dev` 재시작 → `/app/stores` 에서 지도 활성화 확인

### 동작
- 최초 접속: 브라우저가 위치 권한을 요청 → 허용 시 내 위치로 이동, 거부 시 강남역 중심
- 지도를 드래그 하거나 줌 변경 시 **"이 지역에서 재검색"** 버튼 노출
- 버튼 클릭 → 현재 지도 bbox 로 `/api/stores/nearby` 호출 → 마커·리스트 동기화
- 리스트 카드 클릭 → 해당 매장으로 지도 이동 + 선택 강조
- 마커 클릭 → 리스트에서 해당 카드로 스크롤 + 선택 강조

## 환경 변수

`.env.example` 참고 → `.env.local` 로 복사. DB URL 은 `.env` 에 `DATABASE_URL` 로 Prisma가 읽습니다.

**커밋 금지 파일** (`.gitignore` 에 포함됨):
- `.env`, `.env.local`, `.env.*.local` — 실제 시크릿·연결 문자열
- `node_modules/` · `.next/`

**커밋되는 파일**:
- `.env.example` — 키 이름만 있는 템플릿
- 위 README 에 적힌 데모 계정/Docker 기본값 (로컬 전용)

## 프로덕션 배포 (회사 개발 서버)

운영 환경: **회사 사내 Linux 서버** (Ubuntu 20.04 / 32 core / 125GB RAM).
Docker 컨테이너로 배포하며 기존 사내 `pg_server`(PostgreSQL 15) 인스턴스에
별도 데이터베이스로 격리.

### 공개 URL

```
http://csmakers.iptime.org:3020
```

| 진입점 | URL |
|---|---|
| 홈페이지 | http://csmakers.iptime.org:3020/home |
| 모바일 웹앱 | http://csmakers.iptime.org:3020/app |
| 매장 운영자 CMS | http://csmakers.iptime.org:3020/partner/login |
| 서비스 관리자 CMS | http://csmakers.iptime.org:3020/admin/login |

> 사내망: `http://192.168.0.100:3020` 으로 직접 접근 가능
> (외부 접근은 iptime 공유기 3020 → 192.168.0.100:3020 포트포워딩 사용)

### 인프라 구성

```
[ user ]
   │
   ▼ 3020/tcp
[ iptime router (csmakers.iptime.org) ]
   │  port-forward 3020 → 192.168.0.100:3020
   ▼
[ Linux server 192.168.0.100 ]
   ├─ docker: woojoowash_app  (Next.js, port 3020:3000)
   │       │ extra_hosts: host.docker.internal:host-gateway
   │       ▼
   ├─ docker: pg_server  (postgis/postgis:15, port 5432, 사내 공용)
   │       └─ database: woojoowash (전용 user/pw)
   └─ docker: gitlab, gitlab-runner, woojoocha_*, ...
```

- 앱 → DB 경로: `host.docker.internal:5432` 로 호스트 게이트웨이를 통해
  같은 호스트의 `pg_server` 컨테이너에 접근
- 업로드 파일: `woojoowash_uploads` 도커 볼륨에 영구 저장
- 시작 시 자동: `prisma migrate deploy` → `next start`

### 시크릿 위치

| 항목 | 위치 |
|---|---|
| `.env.production` | 서버: `~/projects/woojoowash/.env.production` (chmod 600) |
| DB user / password | 위 파일 안에만, **랜덤 생성된 값** |
| `NEXTAUTH_SECRET` | 위 파일 안에만, `openssl rand -base64 32` |
| `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` | 위 파일 + 빌드 인자 (공개 키) |

> 시크릿은 git·README에 절대 포함하지 않음. 서버에서만 `.env.production` 으로 관리.

### 첫 배포 절차 (이미 완료, 참고용)

```bash
# 1. pg_server 에 DB+user 생성 (postgres admin 권한 필요)
docker exec -it pg_server psql -U postgres <<'SQL'
CREATE USER woojoowash WITH PASSWORD '<random>';
CREATE DATABASE woojoowash OWNER woojoowash;
GRANT ALL PRIVILEGES ON DATABASE woojoowash TO woojoowash;
SQL

# 2. 코드 클론 + .env.production 작성
ssh -p 2022 ucsit-dl@csmakers.iptime.org
mkdir -p ~/projects && cd ~/projects
git clone https://github.com/auto1225/woojoowash.git
cd woojoowash
cat > .env.production <<EOF
DATABASE_URL="postgresql://woojoowash:<password>@host.docker.internal:5432/woojoowash?schema=public"
NEXTAUTH_URL="http://csmakers.iptime.org:3020"
NEXTAUTH_SECRET="<openssl rand -base64 32>"
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID="<naver client id>"
EOF
chmod 600 .env.production

# 3. 빌드 + 기동 (마이그레이션은 컨테이너 시작 시 자동)
docker compose --env-file .env.production -f docker-compose.prod.yml build
docker compose --env-file .env.production -f docker-compose.prod.yml up -d

# 4. 초기 시드 (한 번만)
docker exec woojoowash_app sh -c "npm i -g tsx && tsx prisma/seed.ts"
```

### 코드 업데이트 후 재배포

```bash
ssh -p 2022 ucsit-dl@csmakers.iptime.org
cd ~/projects/woojoowash
git pull
docker compose --env-file .env.production -f docker-compose.prod.yml build
docker compose --env-file .env.production -f docker-compose.prod.yml up -d
docker logs woojoowash_app --tail 30  # 정상 부팅 확인
```

### 운영 명령

```bash
# 상태 확인
docker ps --filter name=woojoowash
docker logs -f woojoowash_app

# 재시작
docker compose --env-file .env.production -f docker-compose.prod.yml restart app

# DB 접속
docker exec -it pg_server psql -U woojoowash -d woojoowash

# 외부 도달 테스트
curl -I http://csmakers.iptime.org:3020/home
```

## 핸드오프

디자인 레퍼런스(JSX)와 설계 문서는 `design_handoff/` 참고. 루트의 `CLAUDE.md` 가 Claude Code 컨텍스트입니다.

## Roadmap

- [x] Sprint 1 — 토큰 + UI 프리미티브
- [x] Sprint 2 — 정적 화면 (mock)
- [x] Sprint 2.5 — 상용 리디자인 (실사·애니메이션)
- [x] Sprint 3.1 — Postgres + Prisma 스키마·마이그레이션·시드
- [x] Sprint 3.2 — NextAuth (Credentials · 이메일/비밀번호)
- [x] Sprint 3.3 — mock → DB 실제 연동 (매장·상품·예약·마이)
- [x] Sprint 4 — yper 스타일 앱 UI + 운영자 CMS (매장·상품·스케줄·예약 관리)
- [x] Sprint 4.5 — 네이버 지도 (Web Dynamic Map) + 내 위치 + bbox 재검색
- [x] Sprint 4.6 — 1:1 문의 채팅 + 프로필/차량 CRUD + 프로필 이미지 업로드
- [x] Sprint 4.7 — 회사 개발 서버 Docker 배포 (csmakers.iptime.org:3020)
- [ ] Sprint 5 — 카카오 OAuth · 토스페이먼츠
- [ ] Sprint 6 — Polish (skeleton · error · empty · push 알림)
- [ ] Sprint 7 — Capacitor 래핑
