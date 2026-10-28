# yk-000002-040-ui-flow-components — Implementation Checklist

## Prerequisites
- [ ] `yk-000002-010-domain-content-schema`, `yk-000002-020-ui-design-theme`, `yk-000002-030-ui-skill-components` 병합 완료

## Allowed Edit Scope
- [ ] `README.md` 의 Ownership 안에서만 수정한다: `src/components/Flow.astro`; `src/components/FlowStep.astro`; `src/components/TitleBlock.astro`; `src/components/overrides/PageTitle.astro`; `astro.config.mjs` (`components.PageTitle` 항목만)
- [ ] Ownership 밖의 수정이 필요하면 진행하지 말고 먼저 보고한다

## Stop Conditions
- [ ] 선행 task 가 실제로 병합되지 않았거나 그 산출 contract 가 없으면 멈추고 보고한다
- [ ] 다른 task 의 Ownership 으로 수정이 번지면 멈추고 보고한다
- [ ] 공유 contract(schema, component props, astro.config, package.json)를 Scope 이상으로 바꿔야 하면 멈추고 보고한다
- [ ] 진행 중인 다른 task 가 이미 같은 surface 를 소유하고 있으면 멈추고 보고한다

## Implementation Steps
- [ ] FlowStep (375px base)
  - [ ] 번호 원 + 카드, optional 이면 점선 원·카드 + 숨김 텍스트 "선택 단계"
  - [ ] kind=loop 표시, kind=alt 는 대안 skill 을 "또는" 으로 나란히 (모두 SkillLink)
  - [ ] tools 가 한쪽이면 사용 가능 도구 표시
- [ ] Flow
  - [ ] 자식 FlowStep 번호 자동 부여와 연결선
  - [ ] FlowStep 수와 `titleBlock.steps` 비교, 불일치 시 throw
- [ ] TitleBlock 과 PageTitle
  - [ ] TitleBlock: 2×2 base, `min-width` 에서 4칸
  - [ ] PageTitle override: 기본 h1 유지 + kind=flow 일 때 TitleBlock, `astro.config.mjs` 등록
- [ ] 임시 page 검증
  - [ ] 가상 flow page 로 점선·loop·alt·불일치 실패 확인 후 삭제

## Acceptance Coverage
Covers: F-FLOW (표제란, 연결선, 점선 선택 단계, 도구 표시), 03-data 교차 검증 (`titleBlock.steps` = FlowStep 수), R-UX (텍스트 대체, 375px)

<!-- Write portable commands: see references/execution-convention.md#task-verify-portability -->
## Task Verify
- [ ] `npm run build`
- [ ] `npm run guard`

## Verification
- [ ] build 성공 (`npm run build`)
- [ ] 공개 가드 통과 (`npm run guard`)
- [ ] lint / typecheck: N/A — spec·tech-stack 이 정의한 npm script 가 없다

## Implementation Notes (optional)
