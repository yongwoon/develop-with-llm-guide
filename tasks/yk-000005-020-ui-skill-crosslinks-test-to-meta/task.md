# yk-000005-020-ui-skill-crosslinks-test-to-meta — Implementation Checklist

## Prerequisites
- [ ] Phase yk-000004 전체 병합 완료

## Allowed Edit Scope
- [ ] `README.md` 의 Ownership 안에서만 수정한다: `src/content/docs/skills/ywc-tdd-ritual.mdx`; `src/content/docs/skills/ywc-gen-testcase.mdx`; `src/content/docs/skills/ywc-e2e-test-strategy.mdx`; `src/content/docs/skills/ywc-verification-map.mdx`; `src/content/docs/skills/ywc-verify-done.mdx`; `src/content/docs/skills/ywc-commit.mdx`; `src/content/docs/skills/ywc-create-pr.mdx`; `src/content/docs/skills/ywc-handle-pr-reviews.mdx`; `src/content/docs/skills/ywc-finish-branch.mdx`; `src/content/docs/skills/ywc-release-pr-list.mdx`; `src/content/docs/skills/ywc-changelog-release-notes.mdx`; `src/content/docs/skills/ywc-merge-dependabot.mdx`; `src/content/docs/skills/ywc-resolve-conflict.mdx`; `src/content/docs/skills/ywc-issue-triage.mdx`; `src/content/docs/skills/ywc-infra-design.mdx`; `src/content/docs/skills/ywc-iac-author.mdx`; `src/content/docs/skills/ywc-infra-review.mdx`; `src/content/docs/skills/ywc-infra-optimize.mdx`; `src/content/docs/skills/ywc-project-scaffold.mdx`; `src/content/docs/skills/ywc-project-docs.mdx`; `src/content/docs/skills/ywc-ubiquitous-language.mdx`; `src/content/docs/skills/ywc-onboard-repo.mdx`; `src/content/docs/skills/ywc-incident-postmortem.mdx`; `src/content/docs/skills/ywc-setup.mdx`; `src/content/docs/skills/ywc-retro.mdx`; `src/content/docs/skills/ywc-handoff.mdx`; `src/content/docs/skills/ywc-skill-author.mdx`
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

- 방법: `yk-000005-010-ui-skill-crosslinks-plan-to-review` 와 같은 규칙으로 기계적으로 채웠다 (흐름 page 의 FlowStep `skill`·`alt` prop 기준, 변환 script 는 저장소에 두지 않음).
  - `next`: 필수 단계가 있는 흐름에서 바로 다음 단계, 최대 3개. `,` 로 이어진 독립 선택 단계는 "다음"이 아니므로 제외했다 (`ywc-finish-branch`, `ywc-changelog-release-notes`, `ywc-merge-dependabot` 은 `next` 없음). 그 밖에 다음 단계가 없는 skill: ywc-gen-testcase, ywc-e2e-test-strategy, ywc-verification-map, ywc-create-pr, ywc-issue-triage, ywc-infra-optimize, ywc-incident-postmortem, ywc-setup, ywc-retro, ywc-handoff, ywc-skill-author.
  - 본문: code block 밖의 `` `ywc-<name>` `` inline code → `<SkillLink />` (자기 자신 제외).
  - 관련 흐름: 이 skill 이 FlowStep 으로 등장하는 흐름, 흐름 번호 순, `<VerifiedStamp />` 앞.
- 관련 흐름 검사: 대상 27 page 모두 link 1개 이상 (최소 1, 최대 2). 누락 0건. 63 page 전체로도 `## 관련 흐름` 없는 page 0건, link 안 된 본문 skill 이름 0건.
- 내용 수정 필요 사항: 없음.
- 확인: `pnpm run build` 성공, `pnpm run guard` 통과.
- review 반영: `ywc-handle-pr-reviews` 의 `next` 를 `ywc-finish-branch` 로 바꿨다 (`ywc-receive-review` 는 이 page 의 "쓰지 말아야 할 때" 대안이라 후속 단계로 읽히지 않음).
