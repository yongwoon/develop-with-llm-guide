# yk-000002-030-ui-skill-components

## Purpose
skill page 와 Skill 색인을 구성하는 component(SkillCard, OptionTable, SkillLink, SkillIndex, VerifiedStamp)와 Skill 색인 page, 검색 상태 표시용 Search override 를 만든다.

## Scope
- `SkillCard.astro`: frontmatter category·tools·outputs·next 를 읽어 요약 카드 (crop mark). `next` 의 각 이름이 skill page 로 없으면 build 실패
- `OptionTable.astro`: options/argsNote → 표, 빈 칸 `—`, note 작은 글씨, ●/– + 텍스트 대체, 모바일 카드, 빈 목록이면 "option 없음"
- `SkillLink.astro`: skill 이름 → `<base>/skills/<name>/#options`, collection 에 없으면 build 실패
- `SkillIndex.astro` + `src/content/docs/skills/index.mdx` (`kind: index`, `sidebar.order: 0`): 이름순 표, 분류 필터, 375px 카드 목록
- `VerifiedStamp.astro`: verifiedAt·sourceVersion 을 page 하단에 작게
- skill page title=file 이름 검증 (SkillCard 에서 수행)
- `src/components/overrides/Search.astro`: 기본 Search 를 감싸 JS 비활성 시 Skill 색인 link, 로딩·실패 안내 (Pagefind UI 기본 동작이 이미 충족하면 noscript link 만)

## Spec Reference

### Primary Sources
- `docs/specification/04-interfaces.md#본문-component`
- `docs/specification/03-data.md#skill-page` — 본문 구성·OptionTable·option 필드
- `docs/specification/02-features.md#f-index-skill-색인-appendix`, `#f-search-한국어-검색`, `#f-fresh-내용-최신성-표시`
- `docs/design/design-system.md#components-starlight-매핑`
- `docs/tech-stack.md` — `src/components/`, `overrides/`

### Summary
모든 component 는 client JS 없는 정적 `.astro` 이며 frontmatter 는 `Astro.locals.starlightRoute` 또는 `getCollection('docs')` 로 읽는다. 분류 필터만 최소 inline script 가 필요하면 허용한다 (JS 비활성 시 전체 목록 노출). SkillLink·SkillCard 의 존재 검증은 page 1개가 없을 때만 실패하고, 전체 개수(63)는 검사하지 않는다. Search override 는 tech-stack 에 없는 file 이므로 `docs/tech-stack.md` 의 directory 표에 함께 추가한다.

### Out of Scope (from spec)
- Flow·FlowStep·TitleBlock·PageTitle — `yk-000002-040-ui-flow-components`
- Header `ywc skills · N` — Open Question
- 63행 확인 — `yk-000005-030-test-first-release-gate`

## Criticality

`normal` — 정적 표시 component

## Dependencies

### Depends On
- `yk-000002-010-domain-content-schema` — frontmatter 타입과 category 라벨
- `yk-000002-020-ui-design-theme` — token·font
- `yk-000001-020-lib-starlight-links-validator` — `#options` anchor 검증 (Phase 1)

### Depended By
- `yk-000002-040-ui-flow-components` — FlowStep 이 SkillLink 사용
- Phase yk-000003 skill page task 5개 — SkillCard·OptionTable·VerifiedStamp 사용
- `yk-000005-010-ui-skill-crosslinks-plan-to-review`, `yk-000005-020-ui-skill-crosslinks-test-to-meta` — SkillLink 사용

## Key Files
- `src/components/SkillCard.astro`
- `src/components/OptionTable.astro`
- `src/components/SkillLink.astro`
- `src/components/SkillIndex.astro`
- `src/components/VerifiedStamp.astro`
- `src/components/overrides/Search.astro`
- `src/content/docs/skills/index.mdx`
- `astro.config.mjs` (`components.Search`)
- `docs/tech-stack.md` (Search override 1행 추가)

## Notes
- **Base branch: `content/initial`** (R-RELEASE). task branch 는 `content/initial` 에서 만들고 `content/initial` 로 병합한다. main 에 직접 병합하지 않는다.
- **Mobile-first**: OptionTable·SkillIndex 는 375px 카드 레이아웃을 base 로, `min-width` 에서 표로 확장한다.
- OptionTable 은 바로 위 MDX heading "Options" 가 `#options` anchor 가 되는 전제를 둔다 (heading 은 page 가 작성). component 는 heading 을 만들지 않는다.
- skill page 가 0개일 때 SkillIndex 가 빈 상태로 build 되어야 한다. 검증은 임시 page 를 만들어 하고 commit 하지 않는다.
- VerifiedStamp 는 각 page MDX 끝에 배치하는 방식으로 쓴다 (Footer override 추가 없음).

## Parallel Execution Metadata

- Model Hint: opus — M1 (`Depended By` 3개 이상 + `Owned Interface` 있음)

### Ownership
- `src/components/SkillCard.astro`
- `src/components/OptionTable.astro`
- `src/components/SkillLink.astro`
- `src/components/SkillIndex.astro`
- `src/components/VerifiedStamp.astro`
- `src/components/overrides/Search.astro`
- `src/content/docs/skills/index.mdx`
- `astro.config.mjs` (`components.Search` 항목만)
- `docs/tech-stack.md` (directory 표의 overrides 행만)

### Owned Interface
- `<SkillLink name="ywc-…" />` → `/develop-with-llm-guide/skills/<name>/#options`, 없는 이름이면 build error
- `<SkillCard />`, `<OptionTable />`, `<VerifiedStamp />` — props 없음, 현재 page frontmatter 를 읽음
- `<SkillIndex />` — props 없음, 모든 kind=skill frontmatter 를 읽음
- skill page 본문 규약: `## Options` heading 바로 아래 `<OptionTable />`

### Shared Surfaces
- Component contract (모든 content page 가 import)
- Build config: `astro.config.mjs`
- `docs/tech-stack.md`

### Conflicts With
- `yk-000002-040-ui-flow-components` — `astro.config.mjs` `components` 항목 (의존 순서로 해소)

### Parallelizable After
- yk-000002-010-domain-content-schema
- yk-000002-020-ui-design-theme

### Task Verify
- `npm run build`
- `npm run guard`

## Out of Scope
- skill page 본문 작성
- Header override
- client framework island
