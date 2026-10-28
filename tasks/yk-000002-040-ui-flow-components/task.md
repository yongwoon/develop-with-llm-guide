# yk-000002-040-ui-flow-components — Implementation Checklist

## Prerequisites
- [x] `yk-000002-010-domain-content-schema`, `yk-000002-020-ui-design-theme`, `yk-000002-030-ui-skill-components` 병합 완료

## Allowed Edit Scope
- [x] `README.md` 의 Ownership 안에서만 수정한다: `src/components/Flow.astro`; `src/components/FlowStep.astro`; `src/components/TitleBlock.astro`; `src/components/overrides/PageTitle.astro`; `astro.config.mjs` (`components.PageTitle` 항목만)
- [x] Ownership 밖의 수정이 필요하면 진행하지 말고 먼저 보고한다

## Stop Conditions
- [x] 선행 task 가 실제로 병합되지 않았거나 그 산출 contract 가 없으면 멈추고 보고한다
- [x] 다른 task 의 Ownership 으로 수정이 번지면 멈추고 보고한다
- [x] 공유 contract(schema, component props, astro.config, package.json)를 Scope 이상으로 바꿔야 하면 멈추고 보고한다
- [x] 진행 중인 다른 task 가 이미 같은 surface 를 소유하고 있으면 멈추고 보고한다

## Implementation Steps
- [x] FlowStep (375px base)
  - [x] 번호 원 + 카드, optional 이면 점선 원·카드 + 숨김 텍스트 "선택 단계"
  - [x] kind=loop 표시, kind=alt 는 대안 skill 을 "또는" 으로 나란히 (모두 SkillLink)
  - [x] tools 가 한쪽이면 사용 가능 도구 표시
- [x] Flow
  - [x] 자식 FlowStep 번호 자동 부여와 연결선
  - [x] FlowStep 수와 `titleBlock.steps` 비교, 불일치 시 throw
- [x] TitleBlock 과 PageTitle
  - [x] TitleBlock: 2×2 base, `min-width` 에서 4칸
  - [x] PageTitle override: 기본 h1 유지 + kind=flow 일 때 TitleBlock, `astro.config.mjs` 등록
- [x] 임시 page 검증
  - [x] 가상 flow page 로 점선·loop·alt·불일치 실패 확인 후 삭제

## Acceptance Coverage
Covers: F-FLOW (표제란, 연결선, 점선 선택 단계, 도구 표시), 03-data 교차 검증 (`titleBlock.steps` = FlowStep 수), R-UX (텍스트 대체, 375px)

<!-- Write portable commands: see references/execution-convention.md#task-verify-portability -->
## Task Verify
- [x] `npm run build`
- [x] `npm run guard`

## Verification
- [x] build 성공 (`npm run build`)
- [x] 공개 가드 통과 (`npm run guard`)
- [x] lint / typecheck: N/A — spec·tech-stack 이 정의한 npm script 가 없다

## Implementation Notes (optional)

- Flow 는 `Astro.slots.render('default')` 로 자식 HTML 을 만든 뒤 FlowStep 의 `data-flow-step="<kind>"` 표식을 세어 `titleBlock.steps` 와 비교한다. 같은 순서 정보로 loop 단계가 연속 2개씩인지도 검사한다 (범례: `↔` 는 연속 FlowStep 2개). 번호는 CSS counter, 연결선은 각 단계에서 다음 번호 원까지만 그린다(마지막 단계 아래로 선이 나가지 않음).
- FlowStep 은 `kind="alt"` 인데 `alt` 가 없거나, alt 대안이 있는데 kind 가 alt 가 아니면 build 를 실패시킨다. skill·대안 이름은 SkillLink 로 렌더링하므로 없는 skill 은 SkillLink 가 build 를 실패시킨다.
- 필수/선택 텍스트 대체: 선택 단계는 화면에 "선택" 표시(점선 원·카드), 필수 단계는 숨김 텍스트 "필수". 한쪽 도구 전용이면 "Codex 전용" 같은 표시를 단다.
- PageTitle override 는 Starlight 기본 PageTitle(h1·id 유지)을 그대로 렌더링하고, kind=flow 일 때만 아래에 TitleBlock 을 붙인다. override → components 단방향 import.
- 확인 (임시 skill page 5개 + 임시 flow page, 확인 후 삭제):
  - 유효 page build 성공. 표식 순서 step, loop, loop, alt, step.
  - `titleBlock.steps` 불일치, 짝이 안 맞는 loop, 대안 없는 alt, 대안이 있는 step 은 각각 원인을 담은 메시지로 build 실패.
  - 1280px: 표제란 4칸, 번호 원 1–5 와 연결선, "↔ 반복"·"또는"·"Codex 전용"·점선 "선택" 표시. 375px: 표제란 2×2, page 가로 scroll 0, skill link 는 `/develop-with-llm-guide/skills/ywc-a/#options`.
