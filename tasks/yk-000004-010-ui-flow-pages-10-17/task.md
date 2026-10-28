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
  - [ ] `pnpm run build` (FlowStep 수·SkillLink 존재 검증 통과)
  - [ ] `pnpm run guard`

## Acceptance Coverage
Covers: F-FLOW (흐름 10–17), F-NAV (흐름 → skill 2 클릭), SC003, R-SEARCH 작성 규칙, R-CONTENT (flow page 수 일부)

<!-- Write portable commands: see references/execution-convention.md#task-verify-portability -->
## Task Verify
- [ ] `pnpm run build`
- [ ] `pnpm run guard`

## Verification
- [ ] build 성공 (`pnpm run build`)
- [ ] 공개 가드 통과 (`pnpm run guard`)
- [ ] lint / typecheck: N/A — spec·tech-stack 이 정의한 script 가 없다

## Implementation Notes (optional)

- slug: 10 `new-project`, 11 `onboarding-existing-repo`, 12 `small-change`, 13 `large-feature`, 14 `autonomous-goal`, 15 `uncertain-initiative`, 16 `pr-review-merge`, 17 `debug-postmortem`.
- 필수/선택 예외 (범례 기본 규칙에서 바꾼 단계, 각 page "건너뛸 수 있는 조건"에 근거 기재):
  - 10: `ywc-tech-research`, `ywc-ubiquitous-language` 선택 → 9/2
  - 11: `ywc-agent-legibility-audit` 선택 → 3/1
  - 12: `ywc-tdd-ritual` 선택 (test 로 확인할 동작이 없는 변경) → 4/1
  - 13: `ywc-security-audit`, `ywc-finish-branch` 선택 (executor 가 병합까지 끝내는 경우) → 6/2. 실행 단계는 alt 1개 (task-executor / sequential / parallel / code-gen)
  - 16: `ywc-resolve-conflict` 선택 (local 충돌이 있을 때만), `ywc-review-learnings` 는 `,` 기본 규칙으로 선택 → 3/2
  - 17: `ywc-incident-postmortem` 선택 (운영 장애가 아닌 bug) → 1/1
  - 14, 15 는 예외 없음.
- 한쪽 도구 전용 단계: 15 `ywc-adr`, 16 `ywc-resolve-conflict` (Claude Code 전용). Codex tab 에 대체 방법을 적었다.
- 실행 예시의 호출 형태는 이미 공개된 skill page 의 사례·option 표에서 가져왔다 (option 이름 SC002 일치).
- 확인: `pnpm run build` 성공, `pnpm run guard` 통과, preview 375px 에서 8 page 모두 scrollWidth = clientWidth, FlowStep 수 = titleBlock.steps.
- 미반영 (Ownership 밖): design-system 의 "sidebar 흐름 번호를 mono 로" 는 CSS 작업이다. 이 task 는 `sidebar.label` 앞에 번호만 붙였다.
