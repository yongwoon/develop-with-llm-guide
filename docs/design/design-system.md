# Design System — 도면 (Blueprint)

- 결정일: 2026-10-28 (owner 확정)
- 채택안: 시안 **C+ · 개선** — 시안 원본은 `docs/design/drafts/index.html` (하단 switcher 의 `C+ · 개선`). A·B·C 는 비교용 기록으로만 남긴다.
- 구현 대상: Astro Starlight. 아래 모든 요소는 Starlight 의 `customCss` 또는 component override 로 구현한다 (`docs/research/2026-10-28-static-site-framework.md`).

## 원칙

1. **도면 관례를 장식이 아니라 정보 구조로 쓴다.**
   - 실선은 필수, 점선은 선택을 뜻한다.
   - 연결선은 실행 순서를 뜻한다.
   - 표제란(title block)에는 페이지 요약을 담는다.
2. **그림자는 "복사해서 쓰는 것"에만 쓴다.** 코드 블록과 tab 이 대상이며, 나머지 surface 는 선(border)으로만 구분한다.
3. **빠른 조회가 우선이다.** skill 이름·인자·번호는 mono, 설명은 Pretendard 로 쓴다. 한글 라벨에는 mono 를 쓰지 않는다 (자간이 깨진다).
4. **LP(ywc-agent-toolkit-lp)와 겹치지 않는다** (RA003). 다음을 사용하지 않는다.
   - 따뜻한 종이색 배경
   - Space Grotesk, IBM Plex
   - amber / cyan lane 색

## Typography

| 용도 | Font | 비고 |
|---|---|---|
| 본문, 한글 라벨, 제목 | Pretendard Variable | 제목은 weight 800, letter-spacing -0.035em |
| skill 이름, 인자, 번호, 코드 | DM Mono | 400 / 500 |

- 본문은 16px, line-height 1.75 로 하고 `word-break: keep-all` 을 적용한다.
- **font 로딩**: Pretendard Variable 은 dynamic subset 또는 subset woff2 로 self-host 하고, DM Mono 도 self-host 한다. 둘 다 `font-display: swap` 을 쓰며, 본문 font 는 preload 한다. file 위치는 `docs/tech-stack.md` 의 `public/fonts/` 다.
- h1 은 2.5rem, h2 는 1.5rem 이다. h2 앞에는 `§n` 번호를 CSS counter 로 붙인다.

## Color tokens

| Token | Light | Dark | 용도 |
|---|---|---|---|
| `--bg` | `#eef2f7` | `#0b1f3a` | 배경 (24px 모눈) |
| `--grid` | `#dde5f0` | `#12294a` | 모눈 선 |
| `--text` | `#13294b` | `#e6eeff` | 본문·제목 |
| `--text-2` | `#34496b` | `#b7c6e4` | 보조 본문 |
| `--muted` | `#56698a` | `#7f95bd` | 라벨·메타 (AA 4.94 / 5.46) |
| `--accent` | `#2f5bff` | `#7fb2ff` | 링크·연결선·현재 위치 |
| `--card-bg` | `#ffffff` | `#0f2646` | 카드·표제란 |
| `--card-border` | `1.5px solid #13294b` | `1.5px solid #4a6aa0` | surface 경계 |
| `--code-bg` | `#13294b` | `#06152b` | 코드 블록 |
| `--code-fg` | `#eaf0ff` | `#eaf0ff` | 코드 글자 |
| `--marker` | `#fff4a8` | `rgba(255,244,168,.28)` | 형광펜 강조, inline code |
| `--shadow` | `#13294b` | `#000814` | 코드·tab 의 3px offset 그림자 |

- 구현 보조 token `--rule-color`(구분선), `--radius`, `--radius-sm` 은 `src/styles/theme.css` 안에서만 쓰는 값이며 위 표의 공개 token 이 아니다.
- **Contrast**
  - light `--accent` on `--bg` 는 4.6 으로 AA 를 통과한다.
  - 초안의 `#6b7f9e`(3.62)는 AA 미달이어서 `--muted` 를 `#56698a` 로 교체했다.
- **Theme**
  - 첫 방문은 OS 설정(`prefers-color-scheme`)을 따른다.
  - 사용자가 header 에서 수동 전환할 수 있다. Starlight 기본 ThemeSelect 를 재스타일링한다.

## Shape & spacing

- radius 는 card 10px, 작은 요소 6px 이다.
- sidebar 는 270px 이다. 본문 열은 sidebar 와 TOC 사이의 공간을 모두 쓴다. 문단·목록·인용은 읽기 폭 740px(`--prose-width`)로 제한하고, 표와 코드 블록은 본문 열 전체를 쓴다 (2026-10-28 owner 요청: option 표가 좁아 줄바꿈되는 문제).
- 사용자가 조절하는 layout (2026-10-28 owner 요청). 설정은 localStorage 에 저장하고, 첫 렌더 전에 head 의 inline script 가 복원한다.
  - TOC 폭: 기본 270px, 192–448px. 1152px 이상에서 TOC 왼쪽 경계를 drag 하거나, 경계에 focus 한 뒤 ←/→ 로 16px 씩 바꾼다. double-click 하면 기본값으로 돌아간다. Starlight 는 TOC 폭에 `--sl-sidebar-width` 를 쓰므로 TOC 열 안에서만 `--toc-width` 로 다시 정의한다.
  - sidebar 접기: 800px 이상에서 sidebar 위쪽 button 으로 접고 편다. 접으면 56px 띠만 남는다. 800px 미만은 drawer 를 그대로 쓴다.
- option 표 (800px 이상): option 이름·형식·머리글은 단어 중간에서 줄을 바꾸지 않는다. 값 목록(`a|b|c`)은 `|` 뒤에서만 줄을 바꾼다. 표가 본문 열보다 넓으면 표 안에서 가로 scroll 한다.
- breakpoint 는 Starlight 기본값을 쓴다 (2026-10-28 owner 결정: drawer 전환은 Starlight 의 JS 가 800px 로 판정하므로 820px 로 맞추려면 override 가 필요하다).
  - 1152px(72rem) 이상: TOC 를 표시한다. 1152px 미만: TOC 를 숨긴다.
  - 800px(50rem) 미만: sidebar 를 drawer 로 바꾼다.
- 375px 에서 page 가로 scroll 이 없어야 한다. 긴 mono 토큰과 코드 블록은 해당 요소 내부의 가로 scroll 을 허용한다.

## Components (Starlight 매핑)

| 요소 | 구현 | 내용 |
|---|---|---|
| Header | Starlight 기본 Header + CSS | brand, Pagefind 검색, theme 전환. skill 수 표시는 두지 않는다 (OQ-T1 결정, 2026-10-28). 초안의 `ywc skills · 63` 표기는 반영하지 않는다 |
| Sidebar | CSS | 그룹 라벨(Pretendard). 흐름 항목 앞에 흐름 번호(10–25)를 mono 로 붙인다. Skill reference 는 색인 아래 skill 이름순 평면 목록이며 분류 기호는 붙이지 않는다. 현재 항목은 accent 테두리 box 로 표시한다 |
| TOC | CSS | 왼쪽 2px 선, 현재 섹션은 accent |
| 표제란 `TitleBlock` | custom component (`PageTitle` override) | frontmatter 값(번호·단계 수·필수/선택·산출물)을 4칸으로 표시하며, 모바일에서는 2×2 로 바꾼다. 흐름 페이지에서만 쓴다 |
| 흐름 `Flow` / `FlowStep` | custom component | 번호 원 + 연결선 + 카드로 구성한다. `optional` prop 이 있으면 원과 카드를 점선으로 그리고, 필수/선택을 텍스트 대체로도 전달한다 |
| 실행 예시 | Starlight `Tabs syncKey="tool"` | Claude Code / Codex 선택이 모든 페이지에서 유지된다 |
| 코드 블록 | Expressive Code theme 설정 | navy 배경, copy 버튼, 3px offset 그림자 |
| Skill 카드 `SkillCard` | custom component | skill 이름(mono) + 분류 tag 로 구성한다. 정의 목록(사용 가능 도구·직접 호출 전용·산출물·다음 skill)을 넣고. 직접 호출 전용은 `userInvoked` 가 있는 도구만 보이고, Codex 는 "(권고)"를 붙인다 (OQ-13), 모서리 crop mark 를 단다 |
| Option 표 `OptionTable` | custom component | 바로 위 "Options" heading 이 `#options` anchor 가 된다. option 이름은 mono 로 쓴다. Claude Code / Codex 열에는 지원하면 ●, 지원하지 않으면 – 를 표시하고 각각 텍스트 대체(aria-label 또는 숨김 텍스트)를 둔다. 빈 칸은 `—`, `note` 는 "언제 쓰나" 칸 아래 작은 글씨로 쓴다. 모바일에서는 행을 카드로 쌓는다 |
| Skill 링크 `SkillLink` | custom component | 본문 안의 skill 이름. mono + accent 밑줄. 누르면 `#options` 로 이동한다 |
| Skill 색인 `SkillIndex` | custom component | 이름순 표와 분류 필터. 분류는 tag, 도구는 ● 로 표시한다(텍스트 대체 포함). 1152px 미만에서는 "한 줄 용도" 열을 줄바꿈해 표시하고, 375px 에서는 카드 목록으로 바꾼다 |
| 확인 기준 `VerifiedStamp` | custom component | page 하단에 확인일과 도구별 bundle version 을 `--muted` 작은 글씨로 표시한다. PageTitle override 에는 넣지 않는다 |
| 안내 `Aside` | Starlight Aside 재스타일링 | 점선 accent 테두리 |
| Pager | CSS | 선 테두리, 그림자 없음 |

## Accessibility

- WCAG 2.2 AA 를 지킨다. 본문과 라벨 대비는 4.5:1 이상이어야 한다.
- `:focus-visible` 에는 2px accent outline 을 쓴다.
- `prefers-reduced-motion` 에서는 transition 을 제거한다.
- tab 은 `role=tab` / `aria-selected` 를 쓴다. Starlight 기본 구현을 따른다.
- ●/–, 점선/실선처럼 모양으로만 전달하는 정보에는 aria-label 이나 숨김 텍스트를 둔다.
- sidebar drawer 는 keyboard 로 열고 닫을 수 있어야 한다. Escape 로 닫고, 닫으면 여는 버튼으로 focus 를 돌려준다.

## 미결 사항 (spec 단계에서 확정)

- ~~Codex 탭의 호출 표기(`$ywc-…` 여부)~~ → 해소 (2026-10-28): `$ywc-…` 로 확정 (spec 04-interfaces 호출 표기 규칙).
- ~~sidebar 의 실제 목차와 skill 분류~~ → 해소 (2026-10-28): 8개 분류 확정, sidebar 는 색인 + 이름순 평면 목록 (spec 02-features F-SKILL, 03-data Sidebar 구성).
