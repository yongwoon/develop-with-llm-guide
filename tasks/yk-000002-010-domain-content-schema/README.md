# yk-000002-010-domain-content-schema

## Purpose
docs collection 의 frontmatter 를 `kind` 판별 필드 기준으로 확장해, kind 별 필수 필드가 빠지면 build 가 실패하게 한다 (spec 03-data).

## Scope
- spike: Starlight `docsSchema({ extend })` 가 kind 별 discriminated union 을 받는지 확인
- 공통 필드 `kind`, `verifiedAt`(YYYY-MM-DD), `sourceVersion`(`claude-code`/`codex` key, index 제외)
- flow `titleBlock`(+ `required + optional = steps` refine), skill `category`/`tools`/`summary`/`options`/`outputs`/`next`/`userInvoked`/`argsNote`/`excludedOptions`, agent `agentGroup`
- 최소 홈의 frontmatter 를 `kind: guide` 로 이관
- 타입 export (component task 가 import)

## Spec Reference

### Primary Sources
- `docs/specification/03-data.md` — 공통 frontmatter, Flow/Skill/Agent page 필드, option 항목 필드, category 매핑, 교차 검증
- `docs/tech-stack.md#srccontentconfigts`

### Summary
spec 03-data 의 필드 정의를 zod 로 옮긴다. union 이 `extend` 에 맞지 않으면 모든 kind 필드를 optional 로 둔 object 에 `superRefine` 으로 kind 별 필수 여부를 강제한다. enum(`category` 8종, `tools` 2종, `agentGroup` 3종)과 날짜 형식, titleBlock 합계는 schema 에서 검증한다. title=file 이름, FlowStep 수, `next` 존재는 schema 로 볼 수 없으므로 component task 가 맡는다. page 수(63/86) 검사는 build 에 넣지 않는다 (부분 작성 중 build 유지).

### Out of Scope (from spec)
- title=file 이름, `next` 존재 검증 — `yk-000002-030-ui-skill-components`
- `titleBlock.steps` = FlowStep 수 검증 — `yk-000002-040-ui-flow-components`
- page 수 검사 — `yk-000005-030-test-first-release-gate`

## Criticality

`normal` — content schema

## Dependencies

### Depends On
- Phase yk-000001 전체 (특히 `yk-000001-010-lib-astro-starlight-scaffold` 의 최소 `src/content.config.ts`)

### Depended By
- `yk-000002-030-ui-skill-components` — skill frontmatter 타입
- `yk-000002-040-ui-flow-components` — flow `titleBlock` 타입
- `yk-000002-050-domain-fresh-check` — `options`/`excludedOptions`/`tools`/`userInvoked` 필드 이름
- Phase yk-000003 이후 모든 content task — frontmatter contract

## Key Files
- `src/content.config.ts`
- `src/content/docs/index.mdx` (frontmatter 만)

## Notes
- **Base branch: `content/initial`** (R-RELEASE). task branch 는 `content/initial` 에서 만들고 `content/initial` 로 병합한다. main 에 직접 병합하지 않는다.
- spike 결과(union 직접 지원 여부와 택한 방식)를 Implementation Notes 에 기록한다.
- `sourceVersion` 은 tools 와 같은 key 를 쓰며 한쪽 도구 전용 skill 은 해당 key 만 둔다. kind=index 에는 `verifiedAt`/`sourceVersion` 이 필수가 아니다.
- `options[].name` 은 원본 표기 그대로이며 alias 는 `--a / --b` 형식으로 한 name 에 쓴다 (R-FRESH 비교 키 규칙).

## Parallel Execution Metadata

- Model Hint: opus — M1 (`Depended By` 3개 이상 + `Owned Interface` 있음)

### Ownership
- `src/content.config.ts`
- `src/content/docs/index.mdx` (frontmatter 블록만)

### Owned Interface
- frontmatter contract: `kind: 'guide'|'flow'|'skill'|'agent'|'index'`, `verifiedAt: string(YYYY-MM-DD)`, `sourceVersion: { 'claude-code'?: string, codex?: string }`
- skill: `category: 'plan'|'implement'|'review'|'test'|'git'|'infra'|'docs'|'meta'`, `tools: ('claude-code'|'codex')[]`, `summary`, `options: { name, format, default?, when, tools, note? }[]`, `outputs?`, `next?: string[]`, `userInvoked?`, `argsNote?`, `excludedOptions?: { 'claude-code'?: string[], codex?: string[] }`
- flow: `titleBlock: { number, steps, required, optional, outputs: string[] }`; agent: `agentGroup: 'overview'|'worker'|'advisor'`
- category → 표시 라벨 매핑 상수 export

### Shared Surfaces
- Content schema: `src/content.config.ts` (모든 page 의 frontmatter contract)

### Conflicts With
- (None identified)

### Parallelizable After
- Phase yk-000001 전체
- `content/initial` branch 생성

### Task Verify
- `npm run build`
- `npm run guard`

## Out of Scope
- component 구현
- content page 작성
- page 수 검사
