# 우주워시 (WoojooWash)

셀프세차 · 손세차 · 픽업 세차 예약 플랫폼. 하이브리드 웹앱(Next.js) + 홈페이지. 추후 Capacitor 네이티브 래핑 예정.

## 스택

- Next.js 14 (App Router) + TypeScript strict
- Tailwind CSS v3
- Pretendard Variable (한글) + tabular-nums
- next/image, Unsplash 이미지
- 계획: Supabase · 토스페이먼츠 · 카카오맵 SDK · Capacitor

## 구조

```
src/app/
├─ (web)/          # 홈페이지 그룹 (랜딩 · 매장 · 할인패스 · 제휴 · 다운로드 · 고객센터)
└─ app/            # 웹앱 그룹 (로그인 · 홈 · 매장 · 예약 플로우 · 마이)
   └─ (tabs)/      # 하단 탭(홈·즐겨찾기·예약·마이)
```

## 실행

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 프로덕션 빌드
```

## 주요 페이지

- `/home` — 홈페이지 랜딩 (yper 벤치마킹, 풀블리드 Hero + 실사)
- `/app` — 웹앱 홈 (모바일 428px 고정 폭)
- `/app/login` — 소셜 로그인
- `/app/stores` — 매장 검색 (지도 + 리스트)
- `/app/stores/[id]` — 매장 상세 → 상품 → 일시 선택 → 결제 → 완료 플로우
- `/pass` — 할인패스 플랜
- `/partners` — 입점 문의

## 디자인 토큰

- `src/styles/tokens.css` — 컬러·라디우스·그림자·그라데이션 전역 변수
- `tailwind.config.ts` — 토큰을 Tailwind 유틸로 매핑

## 핸드오프

디자인 레퍼런스(JSX)와 설계 문서는 `design_handoff/` 에 포함돼 있습니다. 루트의 `CLAUDE.md` 가 Claude Code 컨텍스트입니다.

## Roadmap

- [x] Sprint 1 — 토큰 + UI 프리미티브
- [x] Sprint 2 — 정적 화면 (mock 데이터)
- [x] Sprint 2.5 — 상용 리디자인 (실사·애니메이션·아코디언 FAQ)
- [ ] Sprint 3 — Supabase 연동 (Auth · DB · Storage)
- [ ] Sprint 4 — 토스페이먼츠 + 카카오맵
- [ ] Sprint 5 — Polish (skeleton · error · empty · push 알림)
- [ ] Sprint 6 — Capacitor 래핑
