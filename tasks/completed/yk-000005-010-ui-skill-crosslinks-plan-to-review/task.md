# yk-000005-010-ui-skill-crosslinks-plan-to-review — Implementation Checklist

## Prerequisites
- [ ] Phase yk-000004 전체 병합 완료

## Allowed Edit Scope
- [ ] `README.md` 의 Ownership 안에서만 수정한다: `src/content/docs/skills/ywc-brainstorm.mdx`; `src/content/docs/skills/ywc-tech-research.mdx`; `src/content/docs/skills/ywc-plan.mdx`; `src/content/docs/skills/ywc-spec-writer.mdx`; `src/content/docs/skills/ywc-spec-validate.mdx`; `src/content/docs/skills/ywc-spec-ready.mdx`; `src/content/docs/skills/ywc-task-generator.mdx`; `src/content/docs/skills/ywc-confidence-gate.mdx`; `src/content/docs/skills/ywc-adr.mdx`; `src/content/docs/skills/ywc-mission.mdx`; `src/content/docs/skills/ywc-wayfinder.mdx`; `src/content/docs/skills/ywc-code-gen.mdx`; `src/content/docs/skills/ywc-sequential-executor.mdx`; `src/content/docs/skills/ywc-parallel-executor.mdx`; `src/content/docs/skills/ywc-task-executor.mdx`; `src/content/docs/skills/ywc-agentic.mdx`; `src/content/docs/skills/ywc-worktrees.mdx`; `src/content/docs/skills/ywc-docker-isolate.mdx`; `src/content/docs/skills/ywc-docker-compose.mdx`; `src/content/docs/skills/ywc-auth-implement.mdx`; `src/content/docs/skills/ywc-manual-wizard.mdx`; `src/content/docs/skills/ywc-team-assemble.mdx`; `src/content/docs/skills/ywc-impl-review.mdx`; `src/content/docs/skills/ywc-review-learnings.mdx`; `src/content/docs/skills/ywc-mine-review-history.mdx`; `src/content/docs/skills/ywc-security-audit.mdx`; `src/content/docs/skills/ywc-ui-ux-review.mdx`; `src/content/docs/skills/ywc-design-renew.mdx`; `src/content/docs/skills/ywc-product-review.mdx`; `src/content/docs/skills/ywc-receive-review.mdx`; `src/content/docs/skills/ywc-debug-rootcause.mdx`; `src/content/docs/skills/ywc-refactor-clean.mdx`; `src/content/docs/skills/ywc-agent-legibility-audit.mdx`; `src/content/docs/skills/ywc-architecture-invariants.mdx`; `src/content/docs/skills/ywc-improve-architecture.mdx`; `src/content/docs/skills/ywc-blast-radius.mdx`
- [ ] Ownership 밖의 수정이 필요하면 진행하지 말고 먼저 보고한다

## Stop Conditions
- [ ] 선행 task 가 실제로 병합되지 않았거나 그 산출 contract 가 없으면 멈추고 보고한다
- [ ] 다른 task 의 Ownership 으로 수정이 번지면 멈추고 보고한다
- [ ] 공유 contract(schema, component props, astro.config, package.json)를 Scope 이상으로 바꿔야 하면 멈추고 보고한다
- [ ] 진행 중인 다른 task 가 이미 같은 surface 를 소유하고 있으면 멈추고 보고한다

## Implementation Steps
- [ ] `next` 와 SkillLink
  - [ ] 대상 page 의 frontmatter `next` 를 흐름에서 이어지는 skill 로 채움
  - [ ] 본문의 inline code skill 이름을 `<SkillLink />` 로 교체 (code block 안의 호출 명령은 교체하지 않음)
- [ ] sibling 과 관련 흐름
  - [ ] "쓰지 말아야 할 때" sibling → SkillLink
  - [ ] `## 관련 흐름` 절: `grep -l <skill> src/content/docs/flows/*.mdx` 결과로 흐름 link 목록 작성, `<VerifiedStamp />` 앞에 배치
- [ ] 점검
  - [ ] `pnpm run build` (links-validator·SkillLink·`next` 검증 통과)
  - [ ] `pnpm run guard`

## Acceptance Coverage
Covers: F-NAV (본문 skill 이름 link → `#options`), SC005 (1 클릭 option 도달), 03-data Skill page 본문 4·5, R-RELEASE (2차 pass), R-CONTENT (깨진 link 0건)

<!-- Write portable commands: see references/execution-convention.md#task-verify-portability -->
## Task Verify
- [ ] `pnpm run build`
- [ ] `pnpm run guard`
- [ ] (대상 page 마다 `관련 흐름` 절에 link 1개 이상 — grep 결과를 Implementation Notes 에 기록)

## Verification
- [ ] build 성공 (`pnpm run build`)
- [ ] 공개 가드 통과 (`pnpm run guard`)
- [ ] lint / typecheck: N/A — spec·tech-stack 이 정의한 script 가 없다

## Implementation Notes (optional)

- 방법: 흐름 page 의 FlowStep 목록(`skill`·`alt` prop)을 읽어 기계적으로 채웠다. 변환 script 는 저장소에 두지 않았다 (일회성).
  - `next`: 필수 단계가 있는 흐름에서 이 skill 바로 다음 단계의 skill (alt 대안 포함), 흐름 번호 순, 최대 3개. 단계가 모두 `,` 인 흐름(18, 25)은 순서가 없으므로 제외. 다음 단계가 없는 skill(ywc-adr, ywc-agentic, ywc-auth-implement, ywc-manual-wizard, ywc-team-assemble, ywc-review-learnings, ywc-mine-review-history, ywc-product-review, ywc-agent-legibility-audit)은 `next` 를 두지 않았다.
  - 본문: code block 밖의 `` `ywc-<name>` `` inline code 를 `<SkillLink name="…" />` 로 교체 (자기 자신 제외, 호출 명령 `/ywc-…`·`$ywc-…` 은 그대로).
  - 관련 흐름: 이 skill 이 FlowStep 으로 등장하는 흐름 (흐름 번호 순), `<VerifiedStamp />` 앞. 단순 grep 은 `docs/ywc-plans/` 같은 경로에도 걸려 쓰지 않았다.
- 관련 흐름 검사: 대상 36 page 모두 link 1개 이상 (최소 1, 최대 2). 누락 0건.
- 내용 수정 필요 사항: 없음.
- 확인: `pnpm run build` 성공 (SkillLink·`next`·links-validator), `pnpm run guard` 통과, preview 375px 에서 4 page 표본 scrollWidth = clientWidth, SkillCard 에 "다음 skill" 표시.
- review 반영 (`next` 손질): 흐름 순서만으로 정하면 어색한 3건을 고쳤다. `ywc-spec-validate` → `ywc-task-generator` (흐름 10 의 loop 다음 단계 대신 검토 통과 후 단계), `ywc-receive-review` → `ywc-finish-branch` (선택·Claude Code 전용인 `ywc-resolve-conflict` 를 건너뜀), `ywc-design-renew` 는 `next` 삭제 (`ywc-product-review` 는 `,` 독립 단계).
