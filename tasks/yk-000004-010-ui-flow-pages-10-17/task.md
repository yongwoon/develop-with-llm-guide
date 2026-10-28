# yk-000004-010-ui-flow-pages-10-17 — Implementation Checklist

## Prerequisites
- [ ] Phase yk-000003 전체 병합 완료 (`content/initial`, skill page 63개)

## Allowed Edit Scope
- [ ] `README.md` 의 Ownership 안에서만 수정한다: `src/content/docs/flows/` 의 흐름 10–17 page 8개
- [ ] Ownership 밖의 수정이 필요하면 진행하지 말고 먼저 보고한다

## Stop Conditions
- [ ] 선행 task 가 실제로 병합되지 않았거나 그 산출 contract 가 없으면 멈추고 보고한다
- [ ] 다른 task 의 Ownership 으로 수정이 번지면 멈추고 보고한다
- [ ] 공유 contract(schema, component props, astro.config, package.json)를 Scope 이상으로 바꿔야 하면 멈추고 보고한다
- [ ] 진행 중인 다른 task 가 이미 같은 surface 를 소유하고 있으면 멈추고 보고한다

## Implementation Steps
- [ ] 단계 목록 확정 (흐름마다)
  - [ ] spec 표의 skill 순서를 범례대로 FlowStep 목록으로 변환 (`↔` → loop 2개, `또는` → alt 1개, `,` → optional)
  - [ ] 필수/선택 예외와 "건너뛸 수 있는 조건" 결정
  - [ ] titleBlock `steps`/`required`/`optional`/`outputs` 계산
- [ ] page 작성
  - [ ] frontmatter: `kind: flow`, title, description(상황어), `titleBlock`, `sidebar`, `verifiedAt`, `sourceVersion`
  - [ ] 리드 → Aside "언제 쓰나" → `<Flow>` + `<FlowStep>` (tools 한쪽이면 표시) → 단계별 `<Tabs syncKey="tool">` → 건너뛸 수 있는 조건 → `<VerifiedStamp />`
- [ ] 점검
  - [ ] `npm run build` (FlowStep 수·SkillLink 존재 검증 통과)
  - [ ] `npm run guard`

## Acceptance Coverage
Covers: F-FLOW (흐름 10–17), F-NAV (흐름 → skill 2 클릭), SC003, R-SEARCH 작성 규칙, R-CONTENT (flow page 수 일부)

<!-- Write portable commands: see references/execution-convention.md#task-verify-portability -->
## Task Verify
- [ ] `npm run build`
- [ ] `npm run guard`

## Verification
- [ ] build 성공 (`npm run build`)
- [ ] 공개 가드 통과 (`npm run guard`)
- [ ] lint / typecheck: N/A — spec·tech-stack 이 정의한 npm script 가 없다

## Implementation Notes (optional)
