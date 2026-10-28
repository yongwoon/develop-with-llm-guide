# yk-000002-010-domain-content-schema — Implementation Checklist

## Prerequisites
- [ ] `content/initial` branch 가 존재하고 Phase yk-000001 이 모두 반영되어 있다 (`git branch -a` 로 확인)

## Allowed Edit Scope
- [ ] `README.md` 의 Ownership 안에서만 수정한다: `src/content.config.ts`; `src/content/docs/index.mdx` (frontmatter 블록만)
- [ ] Ownership 밖의 수정이 필요하면 진행하지 말고 먼저 보고한다

## Stop Conditions
- [ ] 선행 task 가 실제로 병합되지 않았거나 그 산출 contract 가 없으면 멈추고 보고한다
- [ ] 다른 task 의 Ownership 으로 수정이 번지면 멈추고 보고한다
- [ ] 공유 contract(schema, component props, astro.config, package.json)를 Scope 이상으로 바꿔야 하면 멈추고 보고한다
- [ ] 진행 중인 다른 task 가 이미 같은 surface 를 소유하고 있으면 멈추고 보고한다

## Implementation Steps
- [ ] spike
  - [ ] `docsSchema({ extend: z.discriminatedUnion('kind', [...]) })` 시도
  - [ ] 실패 시 단일 object + `superRefine` 방식으로 전환하고 Notes 에 기록
- [ ] 공통·kind 별 필드
  - [ ] 공통: `kind`, `verifiedAt` regex, `sourceVersion` (kind=index 면 생략 허용)
  - [ ] flow: `titleBlock` + `required + optional === steps` refine
  - [ ] skill: category·tools enum, option 항목 object, `excludedOptions` 도구별 구조
  - [ ] agent: `agentGroup` enum
- [ ] export 와 홈 이관
  - [ ] category 라벨 매핑과 타입을 export
  - [ ] `src/content/docs/index.mdx` 에 `kind: guide`, `verifiedAt`, `sourceVersion` 추가
- [ ] 실패 확인
  - [ ] 필수 필드를 뺀 임시 page 로 build 실패 확인 후 제거
  - [ ] 잘못된 category 값으로 build 실패 확인 후 제거

## Acceptance Coverage
Covers: 03-data 공통·Flow·Skill·Agent frontmatter, 03-data 교차 검증 (titleBlock 합계·enum·날짜), R-FRESH 표시 항목 (build schema 로 강제), F-FRESH

<!-- Write portable commands: see references/execution-convention.md#task-verify-portability -->
## Task Verify
- [ ] `npm run build`
- [ ] `npm run guard`

## Verification
- [ ] build 성공 (`npm run build`)
- [ ] 공개 가드 통과 (`npm run guard`)
- [ ] lint / typecheck: N/A — spec·tech-stack 이 정의한 npm script 가 없다

## Implementation Notes (optional)
