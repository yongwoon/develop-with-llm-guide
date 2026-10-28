# yk-000005-020-ui-skill-crosslinks-test-to-meta

## Purpose
skill page 27개 (테스트·검증 + Git·PR·릴리스 + 인프라 + 문서·프로젝트 + 세션·메타)의 2차 pass: `next`, 본문 SkillLink, "쓰지 말아야 할 때" sibling link, "관련 흐름" 절을 채운다 (R-RELEASE).

## Scope
- 대상: `ywc-tdd-ritual`, `ywc-gen-testcase`, `ywc-e2e-test-strategy`, `ywc-verification-map`, `ywc-verify-done`, `ywc-commit`, `ywc-create-pr`, `ywc-handle-pr-reviews`, `ywc-finish-branch`, `ywc-release-pr-list`, `ywc-changelog-release-notes`, `ywc-merge-dependabot`, `ywc-resolve-conflict`, `ywc-issue-triage`, `ywc-infra-design`, `ywc-iac-author`, `ywc-infra-review`, `ywc-infra-optimize`, `ywc-project-scaffold`, `ywc-project-docs`, `ywc-ubiquitous-language`, `ywc-onboard-repo`, `ywc-incident-postmortem`, `ywc-setup`, `ywc-retro`, `ywc-handoff`, `ywc-skill-author`
- frontmatter `next` (SkillCard 가 존재 검증)
- 본문 inline code skill 이름 → `<SkillLink name="…" />`
- sibling skill → SkillLink
- "관련 흐름" 절: 이 skill 이 등장하는 흐름 page 목록 (base prefix 절대 경로)

## Spec Reference

### Primary Sources
- `docs/specification/06-requirements.md#r-release-증분-작성과-첫-공개-oq-16-결정`
- `docs/specification/03-data.md#skill-page` — 본문 구성 4·5
- `docs/specification/02-features.md#f-nav-탐색-구조` — 본문 skill 이름은 항상 link

### Summary
모든 skill page 와 흐름 page 가 생긴 뒤의 기계적 link 보강이다. 사용 case·option 내용은 바꾸지 않는다. 관련 흐름은 `src/content/docs/flows/*.mdx` 에서 skill 이름을 검색해 정한다.

### Out of Scope (from spec)
- option·사용 case 수정
- 다른 분류 skill page — `yk-000005-010-ui-skill-crosslinks-plan-to-review`

## Criticality

`normal` — link 보강

## Dependencies

### Depends On
- Phase yk-000004 전체 (흐름 16 page)
- Phase yk-000003 의 해당 분류 task

### Depended By
- `yk-000005-030-test-first-release-gate` — 깨진 link 0건 상태

## Key Files
- `src/content/docs/skills/<skill>.mdx` (27개, 위 대상)

## Notes
- **Base branch: `content/initial`** (R-RELEASE). task branch 는 `content/initial` 에서 만들고 `content/initial` 로 병합한다. main 에 직접 병합하지 않는다.
- task 파일·commit·page 어디에도 민감 단어, 로컬 절대 경로, private 저장소 원문을 쓰지 않는다. private 저장소는 `../develop-with-llm` 으로만 지칭한다.
- file 수 27개로 llm 기준(~30 files)을 넘지 않으며 page 당 수정은 frontmatter 1줄과 link·절 몇 줄의 기계적 변경이다.
- 모든 skill page 는 1개 이상의 관련 흐름을 가져야 한다. 없으면 yk-000004-020-ui-flow-pages-18-25 등장 검사 결과와 대조해 보고한다.
- 내용 수정이 필요해 보이면 이 task 에서 고치지 않고 Implementation Notes 에 기록한다.

## Parallel Execution Metadata

- Model Hint: sonnet — M3 (`Depended By` 1개)

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
- `src/content/docs/skills/ywc-infra-design.mdx`
- `src/content/docs/skills/ywc-iac-author.mdx`
- `src/content/docs/skills/ywc-infra-review.mdx`
- `src/content/docs/skills/ywc-infra-optimize.mdx`
- `src/content/docs/skills/ywc-project-scaffold.mdx`
- `src/content/docs/skills/ywc-project-docs.mdx`
- `src/content/docs/skills/ywc-ubiquitous-language.mdx`
- `src/content/docs/skills/ywc-onboard-repo.mdx`
- `src/content/docs/skills/ywc-incident-postmortem.mdx`
- `src/content/docs/skills/ywc-setup.mdx`
- `src/content/docs/skills/ywc-retro.mdx`
- `src/content/docs/skills/ywc-handoff.mdx`
- `src/content/docs/skills/ywc-skill-author.mdx`

### Owned Interface
- (None — no public interface owned)

### Shared Surfaces
- Content schema (읽기)
- Component contract SkillLink (읽기)

### Conflicts With
- (None identified) — `yk-000005-010-ui-skill-crosslinks-plan-to-review` 와 file 비중복

### Parallelizable After
- Phase yk-000004 전체

### Task Verify
- `pnpm run build`
- `pnpm run guard`
- (대상 page 마다 `관련 흐름` 절에 link 1개 이상 — grep 결과를 Implementation Notes 에 기록)

## Out of Scope
- option·사용 case 변경
- 흐름 page 수정
