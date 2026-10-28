# yk-000003-040-ui-skill-pages-test-git — Implementation Checklist

## Prerequisites
- [ ] Phase yk-000002 전체 병합 완료 (`content/initial`)
- [ ] 로컬에 `../develop-with-llm` checkout 이 있다
- [ ] `git check-ignore .fact-memos/skills/x.md` 통과

## Allowed Edit Scope
- [ ] `README.md` 의 Ownership 안에서만 수정한다: `src/content/docs/skills/ywc-tdd-ritual.mdx`; `src/content/docs/skills/ywc-gen-testcase.mdx`; `src/content/docs/skills/ywc-e2e-test-strategy.mdx`; `src/content/docs/skills/ywc-verification-map.mdx`; `src/content/docs/skills/ywc-verify-done.mdx`; `src/content/docs/skills/ywc-commit.mdx`; `src/content/docs/skills/ywc-create-pr.mdx`; `src/content/docs/skills/ywc-handle-pr-reviews.mdx`; `src/content/docs/skills/ywc-finish-branch.mdx`; `src/content/docs/skills/ywc-release-pr-list.mdx`; `src/content/docs/skills/ywc-changelog-release-notes.mdx`; `src/content/docs/skills/ywc-merge-dependabot.mdx`; `src/content/docs/skills/ywc-resolve-conflict.mdx`; `src/content/docs/skills/ywc-issue-triage.mdx`; `.fact-memos/skills/` 아래 같은 skill 이름의 메모 (local, 비추적)
- [ ] Ownership 밖의 수정이 필요하면 진행하지 말고 먼저 보고한다

## Stop Conditions
- [ ] 선행 task 가 실제로 병합되지 않았거나 그 산출 contract 가 없으면 멈추고 보고한다
- [ ] 다른 task 의 Ownership 으로 수정이 번지면 멈추고 보고한다
- [ ] 공유 contract(schema, component props, astro.config, package.json)를 Scope 이상으로 바꿔야 하면 멈추고 보고한다
- [ ] 진행 중인 다른 task 가 이미 같은 surface 를 소유하고 있으면 멈추고 보고한다
- [ ] `excludedOptions` 판정이 필요한 option 이 있는데 owner 판정을 받을 수 없으면 해당 skill 을 보류하고 보고한다
- [ ] `SKILL.md` 문장을 그대로 옮기지 않고는 설명할 수 없는 경우 멈추고 보고한다

## Implementation Steps
- [ ] 사실 메모 작성 (skill 마다)
  - [ ] 도구별 `SKILL.md` 의 description·Arguments·산출물·userInvoked 만 보고 `.fact-memos/skills/<skill>.md` 에 사실을 목록으로 적는다
  - [ ] 위임 전용 후보 option 은 owner 판정 대기 표시 → 판정 결과를 `excludedOptions` 에 도구별 기록
  - [ ] 내부 절차·판정 규칙·dispatch 는 메모에도 적지 않는다
- [ ] frontmatter (메모만 보고)
  - [ ] `kind: skill`, `title` = file 이름, `description`(한국어 상황어 포함), `category`, `tools`, `summary`, `outputs`, `userInvoked`, `argsNote`, `excludedOptions`, `verifiedAt`, `sourceVersion`
  - [ ] `options`: name 원본 표기, format, default, when(새로 쓴 한국어 1–2문장), tools, note. 도구별 차이 있으면 행 분리
- [ ] 본문 (메모만 보고)
  - [ ] `<SkillCard />` → 사용 case 1개 이상 (상황 → `<Tabs syncKey="tool">` Claude Code/Codex 호출 → 결과물)
  - [ ] `## Options` + `<OptionTable />` → "쓰지 말아야 할 때" (sibling 이름은 inline code, link 없음) → `<VerifiedStamp />`
  - [ ] `next`·SkillLink·관련 흐름 생략 (1차 pass)
- [ ] 점검
  - [ ] `npm run fresh-check` 에서 이 task 의 skill 차이 0건이 될 때까지 options/excludedOptions 보정
  - [ ] CN004·원문 비복사 self-review: 각 page 에 Phase/Step·판정 규칙·dispatch 서술이 없는지 확인
  - [ ] `npm run build && npm run guard`

## Acceptance Coverage
Covers: SC001 (14/63), SC002, SC005 (option 표), F-SKILL, R-CONTENT (사용 case·options·CN004·원문 복사 0건), R-FRESH (option 완전성, 이 task 범위)

<!-- Write portable commands: see references/execution-convention.md#task-verify-portability -->
## Task Verify
- [ ] `npm run build`
- [ ] `npm run guard`
- [ ] (`npm run fresh-check` 보고서에서 이 task 의 skill 에 대한 skill·tools·option·userInvoked 차이 0건. 다른 skill 미작성으로 인한 exit 1 은 허용)
- [ ] `test -z "$(git ls-files .fact-memos)"`

## Verification
- [ ] build 성공 (`npm run build`)
- [ ] 공개 가드 통과 (`npm run guard`)
- [ ] lint / typecheck: N/A — spec·tech-stack 이 정의한 npm script 가 없다

## Implementation Notes (optional)
