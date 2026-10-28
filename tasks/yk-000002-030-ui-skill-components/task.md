# yk-000002-030-ui-skill-components — Implementation Checklist

## Prerequisites
- [x] `yk-000002-010-domain-content-schema` 병합 완료
- [x] `yk-000002-020-ui-design-theme` 병합 완료

## Allowed Edit Scope
- [x] `README.md` 의 Ownership 안에서만 수정한다: `src/components/SkillCard.astro`; `src/components/OptionTable.astro`; `src/components/SkillLink.astro`; `src/components/SkillIndex.astro`; `src/components/VerifiedStamp.astro`; `src/components/overrides/Search.astro`; `src/content/docs/skills/index.mdx`; `astro.config.mjs` (`components.Search` 항목만); `docs/tech-stack.md` (directory 표의 overrides 행만)
- [x] Ownership 밖의 수정이 필요하면 진행하지 말고 먼저 보고한다

## Stop Conditions
- [x] 선행 task 가 실제로 병합되지 않았거나 그 산출 contract 가 없으면 멈추고 보고한다
- [x] 다른 task 의 Ownership 으로 수정이 번지면 멈추고 보고한다
- [x] 공유 contract(schema, component props, astro.config, package.json)를 Scope 이상으로 바꿔야 하면 멈추고 보고한다
- [x] 진행 중인 다른 task 가 이미 같은 surface 를 소유하고 있으면 멈추고 보고한다

## Implementation Steps
- [x] SkillLink·SkillCard
  - [x] `getCollection('docs')` 에서 kind=skill id 집합을 만들고 없는 이름이면 `throw` 로 build 실패
  - [x] SkillCard: 이름(mono) + 분류 tag(라벨 매핑) + 정의 목록(사용 가능 도구·산출물·다음 skill), crop mark
  - [x] SkillCard 에서 title 과 file 이름 불일치 시 build 실패, `next` 각 이름 존재 검증
- [x] OptionTable (375px 카드 → `min-width` 표)
  - [x] 열: option, 형식, 기본값, 언제 쓰나(+note), Claude Code, Codex
  - [x] ●/– 에 `aria-label` 또는 숨김 텍스트, 빈 값 `—`, 빈 목록 "option 없음", `argsNote` 표 아래
- [x] SkillIndex 와 색인 page
  - [x] 이름순 정렬, 열: 이름(SkillLink), 분류, 도구(●+텍스트 대체), 한 줄 용도(summary), option 수
  - [x] 분류 필터 (JS 비활성 시 전체 표시), 1152px 미만 용도 열 줄바꿈, 375px 카드 목록
  - [x] `src/content/docs/skills/index.mdx`: `kind: index`, `sidebar.order: 0`
- [x] VerifiedStamp
  - [x] page 하단 `--muted` 작은 글씨로 확인일과 도구별 bundle version
- [x] Search override
  - [x] 기본 `Search` 를 감싸고 `<noscript>` 에 Skill 색인 link (base 포함)
  - [x] Pagefind 로딩 중·실패 시 안내 문구 확인, 없으면 추가
  - [x] `astro.config.mjs` `components.Search` 등록, `docs/tech-stack.md` overrides 행에 `Search.astro` 추가
- [x] 임시 page 로 검증
  - [x] 가상 skill page 2개(option 있음/없음)와 없는 이름의 SkillLink 로 실패 확인
  - [x] 검증 후 임시 page 삭제 (commit 금지)

## Acceptance Coverage
Covers: F-SKILL (option 표, 도구 표시), F-INDEX (전 항목), F-NAV (skill 이름 link → `#options`), F-SEARCH (로딩·실패·JS 비활성 안내), F-FRESH (VerifiedStamp), 03-data 교차 검증 (title=file 이름, `next` 존재), R-UX (텍스트 대체, 375px 카드)

<!-- Write portable commands: see references/execution-convention.md#task-verify-portability -->
## Task Verify
- [x] `npm run build`
- [x] `npm run guard`

## Verification
- [x] build 성공 (`npm run build`)
- [x] 공개 가드 통과 (`npm run guard`)
- [x] lint / typecheck: N/A — spec·tech-stack 이 정의한 npm script 가 없다

## Implementation Notes (optional)

- 공통: component 는 모두 정적 `.astro` 다. frontmatter 는 `Astro.locals.starlightRoute.entry`(현재 page) 또는 `getCollection('docs')`(SkillLink·SkillIndex)로 읽는다. client script 는 SkillIndex 분류 필터와 Search 상태 문구 두 곳뿐이다.
- 존재 검증: SkillLink 가 `skills/<name>` id 를 collection 에서 찾고 없으면 `throw` 한다. SkillCard 의 `next` 는 SkillLink 로 렌더링하므로 같은 검증을 탄다. SkillIndex 는 file 이름(id)으로 link 를 만들어, title 불일치는 SkillCard 의 메시지로 보고된다.
- OptionTable·SkillIndex 는 `<table>` 을 유지하고, 50rem 미만에서는 CSS 로 행을 카드로 쌓는다 (`data-label` 로 칸 이름 표시, thead 는 시각적으로만 숨김). 50rem 이상에서 표로 돌아간다 (mobile-first, `max-width` 없음).
- Search: Starlight 기본 Search 는 JS 가 없으면 버튼이 `disabled` 로 남고, Pagefind UI 는 bundle 을 못 불러와도 console 에만 오류를 남긴다. override 는 `<noscript>` 로 검색 버튼 대신 Skill 색인 link 를 보이고, dialog 가 처음 열릴 때 `pagefind/pagefind.js` 를 HEAD 로 확인해 "불러오는 중" 문구를 숨기거나 실패 안내(+ Skill 색인 link)로 바꾼다.
- 도구 표시 라벨(Claude Code / Codex)은 SkillCard·OptionTable·SkillIndex·VerifiedStamp 에 각각 둔다. 공유 상수는 `src/content.config.ts`(010 Ownership)에 넣어야 해서 이 task 에서는 두지 않았다.
- 확인 (임시 skill page 2개: option 3개/2도구, option 없음/Codex 전용 + argsNote. 확인 후 삭제):
  - skill page 0개에서 build 성공 (색인은 "아직 작성된 skill page 가 없습니다.").
  - 없는 이름의 SkillLink, 없는 `next`, title≠file 이름은 각각 build 실패 (메시지에 원인 표시).
  - 1280px: SkillCard(crop mark, 분류 tag, 도구, 산출물, 다음 skill), `## Options` → `id="options"`, option 표(빈 기본값 `—`, note 작은 글씨, ●/–), VerifiedStamp. SkillLink href 는 `/develop-with-llm-guide/skills/ywc-beta/#options`.
  - skill frontmatter `next` 가 Starlight pagination `next` 와 이름이 같지만 pager 는 sidebar 순서의 다음 page 를 그대로 표시했다 (010 에서 미룬 확인).
  - 375px: option 행·색인 행이 카드로 쌓이고 page 가로 scroll 0. ●/– 숨김 텍스트 "지원/미지원".
  - 색인: 이름순, 분류 필터(review 선택 시 1/2개), 이름 link 는 `#options`.
  - 검색: 정상이면 dialog 를 열 때 상태 문구가 숨겨지고 Pagefind 입력창이 뜬다. `dist/pagefind/pagefind.js` 를 잠시 치우면 "검색을 불러오지 못했습니다. Skill 색인에서 찾아 주세요." 가 표시된다. `<noscript>` link 는 build HTML 에서 확인.
- review 반영: SkillLink 에 `name` 누락 오류 메시지 추가. title=file 이름 검사를 SkillIndex 에서도 수행해 SkillCard 를 빠뜨린 page 도 build 가 실패하게 함. 표 2개에 `aria-label`. Search 의 noscript style 을 `is:inline` 으로 명시(build 결과 scope 없음 확인). 상태 문구는 빈 live region 을 넣은 뒤 채움. SkillCard 주석에 skill page 구성(import 경로, JSX 앞 빈 줄, Options heading, VerifiedStamp 위치)을 적음. 도구 라벨 4곳에 동기화 주석.
- 1152px 미만 "한 줄 용도" 줄바꿈: 열에 `nowrap` 을 두지 않아 모든 폭에서 자연스럽게 줄바꿈된다.
