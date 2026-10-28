# yk-000002-040-ui-flow-components

## Purpose
흐름 page 를 구성하는 component(Flow, FlowStep, TitleBlock)와 h1 아래 표제란을 렌더링하는 PageTitle override 를 만든다.

## Scope
- `Flow.astro`: FlowStep 을 연결선으로 잇고 번호 자동 부여, FlowStep 수와 `titleBlock.steps` 불일치 시 build 실패
- `FlowStep.astro`: props skill, 설명, optional, tools, kind(step/loop/alt), alt 대안 skill. optional 은 점선 원·카드 + 텍스트 대체. skill 이름은 SkillLink
- `TitleBlock.astro`: 번호·단계 수·필수/선택·산출물 4칸, 모바일 2×2
- `src/components/overrides/PageTitle.astro`: 기본 h1 + kind=flow 일 때 TitleBlock
- `astro.config.mjs` `components.PageTitle` 등록

## Spec Reference

### Primary Sources
- `docs/specification/04-interfaces.md#본문-component`
- `docs/specification/03-data.md#flow-page`, `#교차-검증`
- `docs/specification/02-features.md#f-flow-상황별-흐름-페이지` — 흐름 표기 범례
- `docs/design/design-system.md#components-starlight-매핑`
- `docs/tech-stack.md` — overrides 의존 방향 (overrides → components 단방향)

### Summary
FlowStep 의 단계 종류는 step(→), loop(↔, 연속 2개), alt(또는, 대안 skill 함께 표기)이다. 선택 단계는 점선으로 그리고 "선택" 텍스트로도 전달한다. 한쪽 도구 전용 skill 단계는 사용 가능 도구를 표시한다. FlowStep 수 검증은 Flow 가 렌더링 시 frontmatter 와 비교해 불일치하면 build 를 실패시킨다.

### Out of Scope (from spec)
- flow page 본문 — `yk-000004-010-ui-flow-pages-10-17`, `yk-000004-020-ui-flow-pages-18-25`
- SkillLink — `yk-000002-030-ui-skill-components`

## Criticality

`normal` — 정적 표시 component

## Dependencies

### Depends On
- `yk-000002-010-domain-content-schema` — `titleBlock` 타입
- `yk-000002-020-ui-design-theme` — token
- `yk-000002-030-ui-skill-components` — SkillLink, `astro.config.mjs` 순서

### Depended By
- `yk-000004-010-ui-flow-pages-10-17` — Flow/FlowStep/TitleBlock
- `yk-000004-020-ui-flow-pages-18-25` — Flow/FlowStep/TitleBlock

## Key Files
- `src/components/Flow.astro`
- `src/components/FlowStep.astro`
- `src/components/TitleBlock.astro`
- `src/components/overrides/PageTitle.astro`
- `astro.config.mjs` (`components.PageTitle`)

## Notes
- **Base branch: `content/initial`** (R-RELEASE). task branch 는 `content/initial` 에서 만들고 `content/initial` 로 병합한다. main 에 직접 병합하지 않는다.
- **Mobile-first**: 375px 에서 세로 흐름(번호 원 + 카드)을 base 로 두고 `min-width` 에서 간격·폭을 넓힌다. TitleBlock 은 2×2 base → 4칸.
- override 는 `src/components/*` 를 import 할 수 있고 역방향은 금지한다.
- 검증용 임시 flow page 는 commit 하지 않는다.

## Parallel Execution Metadata

- Model Hint: opus — M1 (`Depended By` 2개 + `Owned Interface` 있음)

### Ownership
- `src/components/Flow.astro`
- `src/components/FlowStep.astro`
- `src/components/TitleBlock.astro`
- `src/components/overrides/PageTitle.astro`
- `astro.config.mjs` (`components.PageTitle` 항목만)

### Owned Interface
- `<Flow>…</Flow>`
- `<FlowStep skill="ywc-…" desc="…" optional? tools?={['claude-code'|'codex']} kind?="step"|"loop"|"alt" alt?={['ywc-…']} />`
- PageTitle: kind=flow 이면 h1 아래 TitleBlock 자동 렌더링

### Shared Surfaces
- Component contract (flow page 가 import)
- Build config: `astro.config.mjs`

### Conflicts With
- `yk-000002-030-ui-skill-components` — `astro.config.mjs` `components` 항목

### Parallelizable After
- yk-000002-030-ui-skill-components

### Task Verify
- `npm run build`
- `npm run guard`

## Out of Scope
- flow page 작성
- Header override
