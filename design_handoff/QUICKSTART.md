# 시작 가이드 (Quick Start)

Claude Code를 사용해 이 디자인을 실제 하이브리드 웹앱으로 만드는 방법.

## 1. Claude Code 설치 (아직 안 했다면)

```bash
npm install -g @anthropic-ai/claude-code
```

## 2. 새 프로젝트 폴더 만들기

```bash
mkdir woojoowash-app
cd woojoowash-app
```

## 3. 이 핸드오프 폴더를 프로젝트 안에 넣기

이 zip의 압축을 풀어서 `woojoowash-app/design_handoff_woojoowash/` 에 배치하세요.

그리고 핸드오프 폴더의 `CLAUDE.md` 를 **프로젝트 루트** (`woojoowash-app/CLAUDE.md`) 에도 복사하세요.

```
woojoowash-app/
├─ CLAUDE.md                              ← 루트에 복사!
└─ design_handoff_woojoowash/
   ├─ README.md
   ├─ CLAUDE.md                            (원본)
   └─ references/
      ├─ 우주워시 Design.html
      ├─ tokens.js
      ├─ ww-ui.jsx
      ├─ icons.jsx
      └─ app/ web/ brand/
```

## 4. Claude Code 시작

```bash
cd woojoowash-app
claude
```

## 5. 첫 프롬프트 (복사해서 쓰세요)

```
design_handoff_woojoowash/README.md 와 CLAUDE.md 를 먼저 완전히 읽고,
references/ 폴더의 주요 JSX 파일(tokens.js, ww-ui.jsx, icons.jsx,
app/hand-wash.jsx, app/home.jsx, web/landing.jsx)을 훑어봐.

그 다음 Sprint 1 (Foundation) 을 시작해줘:
1. Next.js 14 (App Router) + TypeScript strict + Tailwind v4 로 프로젝트 초기화
2. Pretendard Variable 폰트 layout.tsx 에 주입
3. src/styles/tokens.css 에 모든 디자인 토큰을 CSS variables 로 이식
4. tailwind.config.ts 에 토큰 매핑
5. src/components/ui/ 에 UI 프리미티브 작성:
   - Button (WWCTA 대응)
   - Chip (WWChip)
   - CircleChip (WWCircleChip)
   - Card (WWCard)
   - ListRow (WWRow)
6. src/components/app/ 에 앱 전용:
   - AppBar (WWNav)
   - BottomTabBar (WWTabBar)
   - StatusBarSpacer (WWStatus 대체)
7. lucide-react 설치 + 부족한 아이콘만 components/icons/ 에 커스텀

각 단계 끝나면 나한테 확인받고 진행해.
```

## 6. Sprint 2 프롬프트 (Foundation 끝난 후)

```
이제 Sprint 2 — Static Screens 시작. mock 데이터로 화면만 다 그리면 돼.

먼저 (web) 레이아웃 + 랜딩 페이지부터:
- src/app/(web)/layout.tsx — GNB (로고/메뉴) + 푸터
- src/app/(web)/page.tsx — references/web/landing.jsx 그대로 재현

그 다음 (app) 레이아웃 + 홈:
- src/app/(app)/layout.tsx — max-w-[428px] mx-auto + 하단 탭바
- src/app/(app)/page.tsx — references/app/home.jsx AppHome 재현
- src/app/(app)/login/page.tsx — AppLogin

화면 하나씩 완성하고 보여줘. mock 데이터는 src/lib/mock/ 에 둬.
```

## 7. 이후 스프린트

README.md 의 **13. 구현 순서** 섹션을 따라 진행하세요. Claude Code에게 "Sprint 3 시작", "Sprint 4 시작" 으로 지시하면 됩니다.

## 중간에 디자인 참고하려면

브라우저로 `design_handoff_woojoowash/references/우주워시 Design.html` 를 열면 모든 화면이 한 캔버스에 렌더됩니다. 각 artboard 클릭하면 풀스크린으로 볼 수 있어요.

## 팁

- Claude Code가 디자인을 정확히 모르면 "references/app/hand-wash.jsx 를 다시 한번 정독해" 라고 지시하세요.
- 특정 스타일이 맞는지 확인하려면 JSX의 인라인 스타일을 그대로 보여달라고 하세요.
- TypeScript 에러는 Claude Code가 자동으로 고칩니다. `any` 사용 금지를 CLAUDE.md 에 추가해두세요.
