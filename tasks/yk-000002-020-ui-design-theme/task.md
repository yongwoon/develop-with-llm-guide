# yk-000002-020-ui-design-theme — Implementation Checklist

## Prerequisites
- [x] `content/initial` branch 가 존재하고 Phase yk-000001 이 모두 반영되어 있다 (`git branch -a` 로 확인)

## Allowed Edit Scope
- [x] `README.md` 의 Ownership 안에서만 수정한다: `src/styles/theme.css`; `public/fonts/**`; `astro.config.mjs` (`customCss`, `expressiveCode`, `head` 항목만)
- [x] Ownership 밖의 수정이 필요하면 진행하지 말고 먼저 보고한다

## Stop Conditions
- [x] 선행 task 가 실제로 병합되지 않았거나 그 산출 contract 가 없으면 멈추고 보고한다
- [x] 다른 task 의 Ownership 으로 수정이 번지면 멈추고 보고한다
- [x] 공유 contract(schema, component props, astro.config, package.json)를 Scope 이상으로 바꿔야 하면 멈추고 보고한다
- [x] 진행 중인 다른 task 가 이미 같은 surface 를 소유하고 있으면 멈추고 보고한다
- [x] design breakpoint 를 맞추려면 tech-stack 에 없는 component override 가 필요하면 멈추고 보고한다

## Implementation Steps
- [x] font self-host
  - [x] Pretendard Variable subset woff2, DM Mono 400/500 woff2 를 `public/fonts/` 에 배치 (+ OFL license)
  - [x] `@font-face` (`font-display: swap`), `astro.config.mjs` `head` 에 본문 font preload
- [x] token 과 mobile base 레이아웃 (375px)
  - [x] `:root` light token, `[data-theme='dark']` dark token, `--sl-*` 매핑
  - [x] 24px 모눈 배경, 본문 16px / line-height 1.75 / `word-break: keep-all`, h1 2.5rem·h2 1.5rem + `§n` counter
  - [x] 375px 에서 page 가로 scroll 0, 긴 mono 토큰·code block 은 요소 내부 scroll
- [x] tablet·desktop 확장 (`min-width`)
  - [x] 820px 초과에서 sidebar 고정(이하 drawer), 1100px 이상에서 TOC 표시 → owner 결정으로 Starlight 기본 800 / 1152px
  - [x] Starlight 기본 breakpoint 와 다르면 CSS 로 맞추고, override 가 필요하면 멈추고 보고 (멈추고 보고함)
- [x] Starlight 요소 재스타일링
  - [x] sidebar 현재 항목 accent 테두리 box, 흐름 항목 번호 mono (번호 mono 는 flow page 의 sidebar label 이 생긴 뒤로 미룸, Notes 참조)
  - [x] TOC 왼쪽 2px 선, pager 선 테두리, Aside 점선 accent 테두리, ThemeSelect
  - [x] `:focus-visible` 2px accent outline, `prefers-reduced-motion` 에서 transition 제거
- [x] code block
  - [x] Expressive Code: navy(`--code-bg`) 배경, copy 버튼 유지, 3px offset 그림자
  - [x] tab 에도 같은 그림자

## Acceptance Coverage
Covers: F-THEME (light/dark, OS 기본, 수동 전환, copy 버튼), R-UX (대비, 반응형 375/800/1152, focus, reduced motion), F-NAV (TOC 1152px 이상)

<!-- Write portable commands: see references/execution-convention.md#task-verify-portability -->
## Task Verify
- [x] `npm run build`
- [x] `npm run guard`

## Verification
- [x] build 성공 (`npm run build`)
- [x] 공개 가드 통과 (`npm run guard`)
- [x] lint / typecheck: N/A — spec·tech-stack 이 정의한 npm script 가 없다

## Implementation Notes (optional)

- breakpoint (2026-10-28 owner 결정): Starlight 0.42 는 sidebar drawer 전환을 `PageFrame` 의 JS(`matchMedia('(min-width: 50em)')`)로도 판정한다. 820px 로 맞추려면 tech-stack 에 없는 override 가 필요해 멈추고 보고했고, owner 가 Starlight 기본값(800 / 1152px)을 채택했다. design-system, spec 02-features·06-requirements, tech-stack, 이 task 의 test.md, `yk-000002-030` task.md 의 수치를 함께 고쳤다.
- font: npm registry 의 `pretendard@1.3.9`, `@fontsource/dm-mono@5.3.0` tarball 에서 file 만 꺼내 `public/fonts/` 에 두었다 (dependency 추가 없음). Pretendard 는 unicode-range dynamic subset 92개(약 3MB, page 가 쓰는 subset 만 받음)와 package 의 CSS 를 그대로 쓰고, Latin·자주 쓰는 한글을 담은 subset 91 을 preload 한다. DM Mono 는 latin 400/500 만 둔다. 각 directory 에 OFL license 를 둔다.
- DM Mono `@font-face` 의 url 은 `/fonts/...` 로 쓴다. Vite 가 base path 를 붙여 `/develop-with-llm-guide/fonts/...` 로 출력한다 (build 결과로 확인).
- TOC 폭: Starlight 는 오른쪽 sidebar 에도 `--sl-sidebar-width` 를 쓰므로 TOC 는 sidebar 와 같은 270px 이다 (design-system 에 반영).
- sidebar 흐름 번호 mono: 번호는 flow page 의 `sidebar.label` 텍스트에 들어가므로 CSS 만으로는 번호만 고를 수 없다. flow page task 에서 label 형식을 정할 때 다룬다.
- 확인 (preview + Chrome DevTools): dark 1280px, light 375px. 375px 가로 scroll 0, Pretendard 로드, h1 40 / h2 24 / h3 20px, §n counter, 점선 Aside, code block navy + copy 버튼 + 3px 그림자. 새로 생긴 색 조합의 대비: dark inline code 6.07, light accent 4.6, muted 4.94/5.46, code 글자 12.7/16.0, github-dark token 최저 4.72 (모두 AA 이상). 확인용 임시 내용은 홈에서 제거했다.
- review 반영 후 추가 확인 (preview + Chrome DevTools, 홈에 임시 h2·code block 을 넣었다가 제거): OS dark 로 첫 방문 시 dark, ThemeSelect 로 light 전환 후 새로고침해도 light 유지. TOC 는 1151px 에서 숨김, 1152px 에서 표시. 799px 에서 메뉴 버튼 Enter 로 drawer 열림, Escape 로 닫히고 focus 가 메뉴 버튼으로 돌아오며 2px accent outline 표시. `prefers-reduced-motion: reduce` 에서 sidebar link transition 0s. copy 버튼은 `<button>`(tabIndex 0, "클립보드로 복사")로 keyboard focus 가능. DM Mono 로드 확인. build 결과 HTML 에 subset 91 preload 태그 존재.
