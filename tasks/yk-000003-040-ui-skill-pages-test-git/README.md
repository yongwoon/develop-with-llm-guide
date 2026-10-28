# yk-000003-040-ui-skill-pages-test-git

## Purpose
분류 테스트·검증 + Git·PR·릴리스 의 skill page 14개를 1차 pass 로 작성한다. 각 page 는 사용 case 1개 이상과 전체 option 표를 가진다 (SC001, SC005).

## Scope
- 대상 skill 14개 (`src/content/docs/skills/<skill>.mdx`):
  - `test` (테스트·검증, 5): `ywc-tdd-ritual`, `ywc-gen-testcase`, `ywc-e2e-test-strategy`, `ywc-verification-map`, `ywc-verify-done`
  - `git` (Git·PR·릴리스, 9): `ywc-commit`, `ywc-create-pr`, `ywc-handle-pr-reviews`, `ywc-finish-branch`, `ywc-release-pr-list`, `ywc-changelog-release-notes`, `ywc-merge-dependabot`, `ywc-resolve-conflict` (Claude Code 전용), `ywc-issue-triage` (Claude Code 전용)
- skill 마다 사실 메모 `.fact-memos/skills/<skill>.md` (local 전용, commit 금지)를 먼저 작성

## Spec Reference

### Primary Sources
- `docs/specification/03-data.md#skill-page` — frontmatter·option 항목·"모든 option" 정의·본문 구성·작성 규칙
- `docs/specification/02-features.md#f-skill-skill-reference` — 분류·도구 한정 skill
- `docs/specification/04-interfaces.md#호출-표기-규칙`
- `docs/specification/06-requirements.md#r-release-증분-작성과-첫-공개-oq-16-결정` — 1차 pass 규칙
- `docs/specification/06-requirements.md#r-content-내용-품질`, `#r-search-한국어-검색-실측`
- `docs/mission.md` — CN001, CN004, SC002

### Summary
각 page 는 SkillCard → 사용 case(상황 → 호출 명령 Tabs → 결과물) → `## Options` + `<OptionTable />` → 쓰지 말아야 할 때(이름만, link 없음) → `<VerifiedStamp />` 순서다. option 은 도구별 `SKILL.md` Arguments 전부를 싣되 위임 전용·내부 명령 flag 는 owner 판정으로 `excludedOptions` 에 도구별로 둔다. 도구별 이름·형식·기본값이 하나라도 다르면 도구별 행으로 나눈다(OQ-10).

### Out of Scope (from spec)
- `next`, 본문 SkillLink, sibling link, 관련 흐름 — `yk-000005-020-ui-skill-crosslinks-test-to-meta`
- flow page — `yk-000004-010-ui-flow-pages-10-17`, `yk-000004-020-ui-flow-pages-18-25`
- Skill 색인 (자동 생성) — `yk-000002-030-ui-skill-components`

## Criticality

`normal` — 공개 content. 유출 방지는 공개 가드와 작성 규칙으로 다룬다

## Dependencies

### Depends On
- `yk-000002-030-ui-skill-components` — SkillCard·OptionTable·VerifiedStamp
- `yk-000002-050-domain-fresh-check` — option 완전성 점검
- `yk-000002-010-domain-content-schema` — frontmatter schema

### Depended By
- `yk-000004-010-ui-flow-pages-10-17` — FlowStep SkillLink 대상 page
- `yk-000004-020-ui-flow-pages-18-25` — FlowStep SkillLink 대상 page
- `yk-000005-020-ui-skill-crosslinks-test-to-meta` — 2차 pass 대상 page

## Key Files
- `src/content/docs/skills/ywc-tdd-ritual.mdx`
- `src/content/docs/skills/ywc-gen-testcase.mdx`
- `src/content/docs/skills/ywc-e2e-test-strategy.mdx`
- `src/content/docs/skills/ywc-verification-map.mdx`
- `src/content/docs/skills/ywc-verify-done.mdx`
- `src/content/docs/skills/ywc-commit.mdx`
- `src/content/docs/skills/ywc-create-pr.mdx`
- `src/content/docs/skills/ywc-handle-pr-reviews.mdx`
- `src/content/docs/skills/ywc-finish-branch.mdx`
- `src/content/docs/skills/ywc-release-pr-list.mdx`
- `src/content/docs/skills/ywc-changelog-release-notes.mdx`
- `src/content/docs/skills/ywc-merge-dependabot.mdx`
- `src/content/docs/skills/ywc-resolve-conflict.mdx`
- `src/content/docs/skills/ywc-issue-triage.mdx`

## Notes
- **Base branch: `content/initial`** (R-RELEASE). task branch 는 `content/initial` 에서 만들고 `content/initial` 로 병합한다. main 에 직접 병합하지 않는다.
- **사실 메모 우선 (CN001, OQ-06)**: `../develop-with-llm` 의 `SKILL.md` 를 보고 바로 본문을 쓰지 않는다. 먼저 `.fact-memos/skills/<skill>.md` (저장소 root, `.gitignore` 로 추적 제외 — `yk-000001-010-lib-astro-starlight-scaffold` 에서 등록) 에 사실 메모(사용 case, option 이름·형식·기본값·지원 도구, 산출물, userInvoked)를 쓰고, 그 메모만 보고 page 를 쓴다. 메모는 절대 commit 하지 않는다 (`git add -f` 금지).
- **CN004**: 단계 절차(Phase/Step), 내부 판정 규칙·점수 산식, subagent dispatch 방식, 내부 file·script 구조를 쓰지 않는다. 결과물은 "무엇이 어디에 생기는가"까지만 쓴다.
- **SC002**: skill 이름·option 이름은 `SKILL.md` 표기 그대로 옮기고, 설명 문장은 새로 쓴다. 원문 문장 복사·번역 이식 금지.
- **사례 값**: project 이름·경로·PR 번호는 가상의 값이나 이 guide 저장소 자체의 값만 쓴다. owner 의 다른 private project 이름은 쓰지 않는다.
- **호출 표기**: Claude Code `/ywc-…`, Codex `$ywc-…`. Tabs 는 `syncKey="tool"` 이고 Claude Code tab 을 먼저 둔다. code block 에 프롬프트 기호(›)를 넣지 않고 placeholder 는 `<PR#>` 처럼 꺾쇠로 쓴다.
- **확인 기준**: `verifiedAt` 은 작성일, `sourceVersion` 은 작성 시점의 `../develop-with-llm` 도구별 VERSION 값 (spec 03-data 기준값 참조). 한쪽 도구 전용 page 는 해당 도구 key 만 둔다.
- task 파일·commit·page 어디에도 민감 단어, 로컬 절대 경로, private 저장소 원문을 쓰지 않는다. private 저장소는 `../develop-with-llm` 으로만 지칭한다.
- **1차 pass (R-RELEASE)**: frontmatter `next`, 본문 SkillLink, "쓰지 말아야 할 때"의 sibling link, "관련 흐름" 절을 넣지 않는다. 다른 skill 이름은 일단 inline code(`ywc-…`)로 쓰고, 2차 pass (`yk-000005-010-ui-skill-crosslinks-plan-to-review` / `yk-000005-020-ui-skill-crosslinks-test-to-meta`)에서 SkillLink 로 바꾼다.
- description 에 한국어 상황어를 넣어 검색 적중을 돕는다 (R-SEARCH, 예: `ywc-commit` → "커밋", `ywc-gen-testcase` → "테스트시트", `ywc-ubiquitous-language` → "용어집").
- 한쪽 도구 전용 skill 은 다른 도구 tab 에 "이 도구에는 없음"과 대안을 적는다.
- `userInvoked` 의 Codex 값은 화면에서 "권고"로 병기한다 (OQ-13).
- **크기 주의**: page 당 option 표·예시 포함 약 100 LOC 로 task 합계가 llm 기준(~1,000 LOC)을 넘을 수 있다. session 안에서 끝나지 않으면 완료한 page 까지 병합하고 남은 page 를 Implementation Notes 에 기록해 보고한다.
- **Mobile-first**: layout 은 component 가 소유한다. 이 task 는 375px 에서 page 가로 scroll 0 만 확인한다 (긴 명령은 code block 내부 scroll).
- **owner 판정 (excludedOptions, 2026-10-28)**: 다른 skill 이 넘겨줄 때만 쓰는 option 은 표에서 빼고 `excludedOptions` 에 도구별로 기록한다.
  - `ywc-commit`: `--skip-ubiquitous-update` 제외 (Claude Code·Codex)
  - `ywc-create-pr`: `--skip-ubiquitous-update`, `--skip-post-ci-check` 제외 (Claude Code·Codex). Codex 의 `--base` 는 포함하며 `--base / --base-branch` 한 행으로 쓴다
  - `ywc-finish-branch`: `--worktree-path` 제외 (Claude Code)
  - 사실 메모 작성 중 새 후보가 나오면 해당 skill 을 보류하고 owner 판정을 받는다.
- **문체·template (owner 결정, 2026-10-28)**: 사이트 문장은 `docs/specification/06-requirements.md` 의 "사이트 문체"(합니다체)를 따른다. 구성·분량·사례 값 수준은 owner 가 확인한 `src/content/docs/skills/ywc-plan.mdx` 를 기준으로 삼는다. "쓰지 말아야 할 때" 항목은 "~할 때 → `ywc-…`" 형식으로 쓴다.
- **owner 판정 (excludedOptions, 2026-10-28, 실행 중 추가)**: `ywc-finish-branch` 의 `--defer-push`, `--keep-branch` (Claude Code·Codex) 는 executor 가 넘길 때만 쓰는 위임 전용 option 이므로 제외한다. `ywc-create-pr` Codex 의 `--base` 는 원본에서 `--base-branch` alias 를 형식 칸에 두므로, 행 이름은 `--base` 로 쓰고 alias 는 note 에 적는다.

## Parallel Execution Metadata

- Model Hint: opus — M1 (`Depended By` 3개 + `Owned Interface` 있음)

### Ownership
- `src/content/docs/skills/ywc-tdd-ritual.mdx`
- `src/content/docs/skills/ywc-gen-testcase.mdx`
- `src/content/docs/skills/ywc-e2e-test-strategy.mdx`
- `src/content/docs/skills/ywc-verification-map.mdx`
- `src/content/docs/skills/ywc-verify-done.mdx`
- `src/content/docs/skills/ywc-commit.mdx`
- `src/content/docs/skills/ywc-create-pr.mdx`
- `src/content/docs/skills/ywc-handle-pr-reviews.mdx`
- `src/content/docs/skills/ywc-finish-branch.mdx`
- `src/content/docs/skills/ywc-release-pr-list.mdx`
- `src/content/docs/skills/ywc-changelog-release-notes.mdx`
- `src/content/docs/skills/ywc-merge-dependabot.mdx`
- `src/content/docs/skills/ywc-resolve-conflict.mdx`
- `src/content/docs/skills/ywc-issue-triage.mdx`
- `.fact-memos/skills/` 아래 같은 skill 이름의 메모 (local, 비추적)

### Owned Interface
- page slug `/develop-with-llm-guide/skills/<skill>/` 와 `#options` anchor (14개)

### Shared Surfaces
- Content schema contract (`src/content.config.ts`, 읽기만)
- Pagefind index (검색 결과)

### Conflicts With
- (None identified) — Phase yk-000003 의 다른 skill page task 와 file 이 겹치지 않는다

### Parallelizable After
- yk-000002-030-ui-skill-components
- yk-000002-050-domain-fresh-check

### Task Verify
- `pnpm run build`
- `pnpm run guard`
- (`pnpm run fresh-check` 보고서에서 이 task 의 skill 에 대한 skill·tools·option·userInvoked 차이 0건. 다른 skill 미작성으로 인한 exit 1 은 허용)
- `test -z "$(git ls-files .fact-memos)"`

## Out of Scope
- 다른 분류의 skill page
- component 수정
- SKILL.md 원문 인용
