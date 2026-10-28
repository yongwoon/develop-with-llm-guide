# yk-000002-020-ui-design-theme

## Purpose
"도면 (Blueprint)" C+ design token 을 Starlight 에 적용한다: color token(light/dark), 모눈 배경, typography, self-host font, code block theme, breakpoint.

## Scope
- `src/styles/theme.css`: token → `--sl-*` 매핑, 24px 모눈, sidebar·TOC·pager·Aside 재스타일링, h2 `§n` counter, `:focus-visible`, reduced motion
- `public/fonts/`: Pretendard Variable subset woff2, DM Mono woff2 (file 로 self-host, npm package 추가 없음)
- `@font-face` (`font-display: swap`) 와 본문 font preload (`head` 설정)
- Expressive Code theme (navy 배경, copy 버튼, 3px offset 그림자)
- breakpoint 정합: Starlight 기본(50rem / 72rem)과 design 820px / 1100px 의 차이 해소 → owner 결정으로 Starlight 기본 800 / 1152px 채택 (2026-10-28)

## Spec Reference

### Primary Sources
- `docs/design/design-system.md` — 원칙, Typography, Color tokens, Shape & spacing, Components(Sidebar·TOC·코드 블록·Aside·Pager), Accessibility
- `docs/design/drafts/index.html` — 시안 C+ 원본 (참고)
- `docs/specification/06-requirements.md#r-ux-화면과-접근성`
- `docs/specification/02-features.md#f-theme-theme-와-반응형`
- `docs/tech-stack.md` — `src/styles/theme.css`, `public/fonts/`

### Summary
CSS custom property 만으로 design system 을 구현하고 Tailwind 는 쓰지 않는다. LP 와 겹치는 요소(따뜻한 종이색, Space Grotesk, IBM Plex, amber/cyan)는 쓰지 않는다(RA003). 대비는 token 대비표 기준 WCAG 2.2 AA 를 지킨다. Starlight 의 내장 breakpoint 와 design 의 820/1100px 가 다르므로, CSS 로 맞출 수 있는 범위를 확인하고 component override 가 필요하면 멈추고 보고한다.

### Out of Scope (from spec)
- Header `ywc skills · N` 개수 표시 — spec AC 없음, Open Question 으로 보고
- custom component 의 스타일 — `yk-000002-030-ui-skill-components` / `yk-000002-040-ui-flow-components`
- Theme 수동 전환 UI 신규 구현 (Starlight ThemeSelect 재스타일링만)

## Criticality

`normal` — 스타일

## Dependencies

### Depends On
- Phase yk-000001 전체

### Depended By
- `yk-000002-030-ui-skill-components` — token 이름과 font
- `yk-000002-040-ui-flow-components` — token 이름과 font

## Key Files
- `src/styles/theme.css`
- `public/fonts/*.woff2`
- `astro.config.mjs` (`customCss`, `expressiveCode`, `head` preload)

## Notes
- **Base branch: `content/initial`** (R-RELEASE). task branch 는 `content/initial` 에서 만들고 `content/initial` 로 병합한다. main 에 직접 병합하지 않는다.
- **Mobile-first** (mobile-first-ui.md): base 스타일은 375px 기준, `min-width` breakpoint 로 800px·1152px(Starlight 기본, owner 결정)를 더한다. `max-width` 로 되돌리는 규칙을 쓰지 않는다.
- font 를 npm package(`@fontsource` 등)로 들이면 library 도입이므로 별도 task 가 필요하다. 이 task 는 woff2 file 을 `public/fonts/` 에 직접 둔다. font license(OFL) 파일을 함께 둔다.
- font file 은 base path 를 포함한 URL 로 참조한다.

## Parallel Execution Metadata

- Model Hint: opus — M1 (`Depended By` 2개 + `Owned Interface` 있음)

### Ownership
- `src/styles/theme.css`
- `public/fonts/**`
- `astro.config.mjs` (`customCss`, `expressiveCode`, `head` 항목만)

### Owned Interface
- CSS token: `--bg`, `--grid`, `--text`, `--text-2`, `--muted`, `--accent`, `--card-bg`, `--card-border`, `--code-bg`, `--code-fg`, `--marker`, `--shadow` (light/dark)
- font family: 본문 Pretendard Variable, mono DM Mono

### Shared Surfaces
- Build config: `astro.config.mjs`
- 전역 CSS token (component 가 소비)

### Conflicts With
- `yk-000002-030-ui-skill-components`, `yk-000002-040-ui-flow-components` — `astro.config.mjs` 다른 항목 수정 (순서로 해소)

### Parallelizable After
- Phase yk-000001 전체
- `content/initial` branch 생성

### Task Verify
- `npm run build`
- `npm run guard`

## Out of Scope
- custom component
- Header override
- Tailwind 도입
