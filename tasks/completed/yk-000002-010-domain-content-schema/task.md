# yk-000002-010-domain-content-schema — Implementation Checklist

## Prerequisites
- [x] `content/initial` branch 가 존재하고 Phase yk-000001 이 모두 반영되어 있다 (`git branch -a` 로 확인)

## Allowed Edit Scope
- [x] `README.md` 의 Ownership 안에서만 수정한다: `src/content.config.ts`; `src/content/docs/index.mdx` (frontmatter 블록만)
- [x] Ownership 밖의 수정이 필요하면 진행하지 말고 먼저 보고한다

## Stop Conditions
- [x] 선행 task 가 실제로 병합되지 않았거나 그 산출 contract 가 없으면 멈추고 보고한다
- [x] 다른 task 의 Ownership 으로 수정이 번지면 멈추고 보고한다
- [x] 공유 contract(schema, component props, astro.config, package.json)를 Scope 이상으로 바꿔야 하면 멈추고 보고한다
- [x] 진행 중인 다른 task 가 이미 같은 surface 를 소유하고 있으면 멈추고 보고한다

## Implementation Steps
- [x] spike
  - [x] `docsSchema({ extend: z.discriminatedUnion('kind', [...]) })` 시도
  - [x] 실패 시 단일 object + `superRefine` 방식으로 전환하고 Notes 에 기록 (불필요 — union 이 동작)
- [x] 공통·kind 별 필드
  - [x] 공통: `kind`, `verifiedAt` regex, `sourceVersion` (kind=index 면 생략 허용)
  - [x] flow: `titleBlock` + `required + optional === steps` refine
  - [x] skill: category·tools enum, option 항목 object, `excludedOptions` 도구별 구조
  - [x] agent: `agentGroup` enum
- [x] export 와 홈 이관
  - [x] category 라벨 매핑과 타입을 export
  - [x] `src/content/docs/index.mdx` 에 `kind: guide`, `verifiedAt`, `sourceVersion` 추가
- [x] 실패 확인
  - [x] 필수 필드를 뺀 임시 page 로 build 실패 확인 후 제거
  - [x] 잘못된 category 값으로 build 실패 확인 후 제거

## Acceptance Coverage
Covers: 03-data 공통·Flow·Skill·Agent frontmatter, 03-data 교차 검증 (titleBlock 합계·enum·날짜), R-FRESH 표시 항목 (build schema 로 강제), F-FRESH

<!-- Write portable commands: see references/execution-convention.md#task-verify-portability -->
## Task Verify
- [x] `npm run build`
- [x] `npm run guard`

## Verification
- [x] build 성공 (`npm run build`)
- [x] 공개 가드 통과 (`npm run guard`)
- [x] lint / typecheck: N/A — spec·tech-stack 이 정의한 npm script 가 없다

## Implementation Notes (optional)

- spike 결과: Starlight 0.42 의 `docsSchema({ extend })` 는 `z.discriminatedUnion('kind', [...])` 를 그대로 받는다. union 의 각 원소를 기본 schema 와 deep merge 하므로 `superRefine` fallback 은 쓰지 않았다.
- YAML 은 따옴표 없는 날짜를 Date 로 읽고, `2026-13-45` 같은 없는 날짜를 조용히 다른 날짜로 바꾼다. 그래서 `verifiedAt` 은 따옴표로 감싼 문자열만 받고(`verifiedAt: "2026-10-28"`), 실제 달력 날짜인지 검사한다. 따옴표가 없으면 그 이유를 오류 메시지로 알린다.
- `sourceVersion` 값은 문자열만 받는다. `1.0` 처럼 YAML 숫자로 읽히는 값은 따옴표로 감싼다.
- option 항목, `titleBlock`, 도구별 object(`sourceVersion`·`userInvoked`·`excludedOptions`)는 strict 다. 오타 key 가 조용히 버려지지 않고 build 가 실패한다.
- `userInvoked` 는 도구별 출처 값이 다르므로(OQ-13) `{ 'claude-code'?: boolean, codex?: boolean }` 구조로 둔다.
- 임시 page 로 확인: 유효한 skill·flow·agent page 는 통과. category·option tools·option key 오타·sourceVersion key·빈 sourceVersion·빈 tools·userInvoked 형식·titleBlock 합계·날짜 형식·흐름 번호 범위·agentGroup 누락·kind 누락/오값은 build 실패. kind=index 는 verifiedAt 없이 통과.
- review 반영: skill 의 `sourceVersion` key 는 `tools` 와 같아야 하고, `userInvoked`·`excludedOptions` key 와 각 option 의 `tools` 는 skill `tools` 안에 있어야 한다 (어기면 build 실패, 임시 page 로 5가지 확인).
- skill 의 `next` 는 Starlight 내장 pagination 필드 `next` 와 이름이 같다. 배열이면 Starlight 는 다음 page link 의 label·href 를 그대로 두고 attrs 만 비운다. spec 이 이름을 정했으므로 유지하고, `yk-000002-030` 에서 skill page 의 pagination 표시를 확인한다.
