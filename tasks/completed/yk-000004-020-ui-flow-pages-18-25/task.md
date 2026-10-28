# yk-000004-020-ui-flow-pages-18-25 — Implementation Checklist

## Prerequisites
- [ ] `yk-000004-010-ui-flow-pages-10-17` 병합 완료

## Allowed Edit Scope
- [ ] `README.md` 의 Ownership 안에서만 수정한다: `src/content/docs/flows/` 의 흐름 18–25 page 8개; `src/content/docs/flows/` 흐름 10–17 page 의 "관련 흐름" 절만
- [ ] Ownership 밖의 수정이 필요하면 진행하지 말고 먼저 보고한다

## Stop Conditions
- [ ] 선행 task 가 실제로 병합되지 않았거나 그 산출 contract 가 없으면 멈추고 보고한다
- [ ] 다른 task 의 Ownership 으로 수정이 번지면 멈추고 보고한다
- [ ] 공유 contract(schema, component props, astro.config, package.json)를 Scope 이상으로 바꿔야 하면 멈추고 보고한다
- [ ] 진행 중인 다른 task 가 이미 같은 surface 를 소유하고 있으면 멈추고 보고한다

## Implementation Steps
- [ ] 흐름 18–25 작성
  - [ ] 단계 목록 확정·titleBlock 계산 (yk-000004-010-ui-flow-pages-10-17 와 같은 절차)
  - [ ] `ywc-blast-radius` 단계는 Codex 전용 표시와 Claude Code 대체 안내
- [ ] 관련 흐름 절 (16개)
  - [ ] 각 흐름 끝에 관련 흐름 2–4개를 base prefix 절대 경로로 link
  - [ ] `<VerifiedStamp />` 앞에 배치
- [ ] 등장 검사
  - [ ] `for s in $(ls src/content/docs/skills | grep -v index | sed 's/.mdx//'); do grep -lq "$s" src/content/docs/flows/*.mdx || echo MISSING $s; done` 결과 0건
  - [ ] 누락이 있으면 spec 표와 대조해 보고

## Acceptance Coverage
Covers: F-FLOW (흐름 18–25, 63개 skill 흐름 등장, 도구 한정 skill 대체 안내), 03-data Flow page 본문 6번(관련 흐름), R-CONTENT (flow page 16)

<!-- Write portable commands: see references/execution-convention.md#task-verify-portability -->
## Task Verify
- [ ] `pnpm run build`
- [ ] `pnpm run guard`
- [ ] (63개 skill 각각이 `src/content/docs/flows/*.mdx` 에 1회 이상 등장 — grep 으로 확인해 Implementation Notes 에 결과 기록)

## Verification
- [ ] build 성공 (`pnpm run build`)
- [ ] 공개 가드 통과 (`pnpm run guard`)
- [ ] lint / typecheck: N/A — spec·tech-stack 이 정의한 script 가 없다

## Implementation Notes (optional)

- slug: 18 `testing-verification`, 19 `design-product-review`, 20 `infra-cloud`, 21 `auth-implementation`, 22 `code-structure`, 23 `release-repo-ops`, 24 `local-parallel`, 25 `session-skill-management`.
- 필수/선택 (범례 기본 규칙 + 예외, 각 page "건너뛸 수 있는 조건"에 근거):
  - 18: 행 전체가 `,` → 5개 모두 선택 → 0/5
  - 19: 예외 `ywc-design-renew` 선택 (1단계 리뷰에서 디자인 문제가 없을 때), `ywc-product-review` 선택(`,`) → 1/2
  - 20: 예외 `ywc-infra-optimize` 선택 (운영 전·사용량 data 없음) → 3/1
  - 21: 1/0
  - 22: 예외 `ywc-blast-radius` 선택 (Codex 전용, Claude Code 는 대체 안내) → 3/1
  - 23: `ywc-merge-dependabot`, `ywc-issue-triage` 선택(`,`) → 2/2
  - 24: 예외 `ywc-docker-compose`, `ywc-docker-isolate` 선택 (Docker 미사용 project), `ywc-team-assemble` 선택(`,`) → 2/3
  - 25: 행 전체가 `,` → 7개 모두 선택 → 0/7
- 한쪽 도구 전용 단계: 22 `ywc-blast-radius` (Codex), 23 `ywc-issue-triage`, 25 `ywc-manual-wizard` (Claude Code). 다른 도구 tab 에 대체 방법.
- 관련 흐름: 16개 page 모두 `<VerifiedStamp />` 앞에 2–4개, `/develop-with-llm-guide/flows/<slug>/` 절대 경로.
- 등장 검사: 63개 skill 각각을 `src/content/docs/flows/*.mdx` 에서 grep → MISSING 0건. FlowStep 의 `skill`/`alt` prop (따옴표 포함 일치) 기준으로도 0건.
- 확인: `pnpm run build` 성공, `pnpm run guard` 통과, preview 375px 에서 16 page scrollWidth = clientWidth.
