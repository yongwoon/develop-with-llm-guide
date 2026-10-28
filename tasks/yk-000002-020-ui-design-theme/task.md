# yk-000002-020-ui-design-theme — Implementation Checklist

## Prerequisites
- [ ] `content/initial` branch 가 존재하고 Phase yk-000001 이 모두 반영되어 있다 (`git branch -a` 로 확인)

## Allowed Edit Scope
- [ ] `README.md` 의 Ownership 안에서만 수정한다: `src/styles/theme.css`; `public/fonts/**`; `astro.config.mjs` (`customCss`, `expressiveCode`, `head` 항목만)
- [ ] Ownership 밖의 수정이 필요하면 진행하지 말고 먼저 보고한다

## Stop Conditions
- [ ] 선행 task 가 실제로 병합되지 않았거나 그 산출 contract 가 없으면 멈추고 보고한다
- [ ] 다른 task 의 Ownership 으로 수정이 번지면 멈추고 보고한다
- [ ] 공유 contract(schema, component props, astro.config, package.json)를 Scope 이상으로 바꿔야 하면 멈추고 보고한다
- [ ] 진행 중인 다른 task 가 이미 같은 surface 를 소유하고 있으면 멈추고 보고한다
- [ ] design breakpoint 를 맞추려면 tech-stack 에 없는 component override 가 필요하면 멈추고 보고한다

## Implementation Steps
- [ ] font self-host
  - [ ] Pretendard Variable subset woff2, DM Mono 400/500 woff2 를 `public/fonts/` 에 배치 (+ OFL license)
  - [ ] `@font-face` (`font-display: swap`), `astro.config.mjs` `head` 에 본문 font preload
- [ ] token 과 mobile base 레이아웃 (375px)
  - [ ] `:root` light token, `[data-theme='dark']` dark token, `--sl-*` 매핑
  - [ ] 24px 모눈 배경, 본문 16px / line-height 1.75 / `word-break: keep-all`, h1 2.5rem·h2 1.5rem + `§n` counter
  - [ ] 375px 에서 page 가로 scroll 0, 긴 mono 토큰·code block 은 요소 내부 scroll
- [ ] tablet·desktop 확장 (`min-width`)
  - [ ] 820px 초과에서 sidebar 고정(이하 drawer), 1100px 이상에서 TOC 표시
  - [ ] Starlight 기본 breakpoint 와 다르면 CSS 로 맞추고, override 가 필요하면 멈추고 보고
- [ ] Starlight 요소 재스타일링
  - [ ] sidebar 현재 항목 accent 테두리 box, 흐름 항목 번호 mono
  - [ ] TOC 왼쪽 2px 선, pager 선 테두리, Aside 점선 accent 테두리, ThemeSelect
  - [ ] `:focus-visible` 2px accent outline, `prefers-reduced-motion` 에서 transition 제거
- [ ] code block
  - [ ] Expressive Code: navy(`--code-bg`) 배경, copy 버튼 유지, 3px offset 그림자
  - [ ] tab 에도 같은 그림자

## Acceptance Coverage
Covers: F-THEME (light/dark, OS 기본, 수동 전환, copy 버튼), R-UX (대비, 반응형 375/820/1100, focus, reduced motion), F-NAV (TOC 1100px 이상)

<!-- Write portable commands: see references/execution-convention.md#task-verify-portability -->
## Task Verify
- [ ] `npm run build`
- [ ] `npm run guard`

## Verification
- [ ] build 성공 (`npm run build`)
- [ ] 공개 가드 통과 (`npm run guard`)
- [ ] lint / typecheck: N/A — spec·tech-stack 이 정의한 npm script 가 없다

## Implementation Notes (optional)
