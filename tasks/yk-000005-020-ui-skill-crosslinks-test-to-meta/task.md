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
  - [ ] `npm run build` (links-validator·SkillLink·`next` 검증 통과)
  - [ ] `npm run guard`

## Acceptance Coverage
Covers: F-NAV (본문 skill 이름 link → `#options`), SC005 (1 클릭 option 도달), 03-data Skill page 본문 4·5, R-RELEASE (2차 pass), R-CONTENT (깨진 link 0건)

<!-- Write portable commands: see references/execution-convention.md#task-verify-portability -->
## Task Verify
- [ ] `npm run build`
- [ ] `npm run guard`
- [ ] (대상 page 마다 `관련 흐름` 절에 link 1개 이상 — grep 결과를 Implementation Notes 에 기록)

## Verification
- [ ] build 성공 (`npm run build`)
- [ ] 공개 가드 통과 (`npm run guard`)
- [ ] lint / typecheck: N/A — spec·tech-stack 이 정의한 npm script 가 없다

## Implementation Notes (optional)
