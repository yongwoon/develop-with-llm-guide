# yk-000005-010-ui-skill-crosslinks-plan-to-review

## Purpose
skill page 36개 (기획·사양 + 구현·실행 + 리뷰·품질)의 2차 pass: `next`, 본문 SkillLink, "쓰지 말아야 할 때" sibling link, "관련 흐름" 절을 채운다 (R-RELEASE).

## Scope
- 대상: `ywc-brainstorm`, `ywc-tech-research`, `ywc-plan`, `ywc-spec-writer`, `ywc-spec-validate`, `ywc-spec-ready`, `ywc-task-generator`, `ywc-confidence-gate`, `ywc-adr`, `ywc-mission`, `ywc-wayfinder`, `ywc-code-gen`, `ywc-sequential-executor`, `ywc-parallel-executor`, `ywc-task-executor`, `ywc-agentic`, `ywc-worktrees`, `ywc-docker-isolate`, `ywc-docker-compose`, `ywc-auth-implement`, `ywc-manual-wizard`, `ywc-team-assemble`, `ywc-impl-review`, `ywc-review-learnings`, `ywc-mine-review-history`, `ywc-security-audit`, `ywc-ui-ux-review`, `ywc-design-renew`, `ywc-product-review`, `ywc-receive-review`, `ywc-debug-rootcause`, `ywc-refactor-clean`, `ywc-agent-legibility-audit`, `ywc-architecture-invariants`, `ywc-improve-architecture`, `ywc-blast-radius`
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
- 다른 분류 skill page — `yk-000005-020-ui-skill-crosslinks-test-to-meta`

## Criticality

`normal` — link 보강

## Dependencies

### Depends On
- Phase yk-000004 전체 (흐름 16 page)
- Phase yk-000003 의 해당 분류 task

### Depended By
- `yk-000005-030-test-first-release-gate` — 깨진 link 0건 상태

## Key Files
- `src/content/docs/skills/<skill>.mdx` (36개, 위 대상)

## Notes
- **Base branch: `content/initial`** (R-RELEASE). task branch 는 `content/initial` 에서 만들고 `content/initial` 로 병합한다. main 에 직접 병합하지 않는다.
- task 파일·commit·page 어디에도 민감 단어, 로컬 절대 경로, private 저장소 원문을 쓰지 않는다. private 저장소는 `../develop-with-llm` 으로만 지칭한다.
- file 수 36개로 llm 기준(~30 files)을 넘지만 page 당 수정은 frontmatter 1줄과 link·절 몇 줄의 기계적 변경이다.
- 모든 skill page 는 1개 이상의 관련 흐름을 가져야 한다. 없으면 yk-000004-020-ui-flow-pages-18-25 등장 검사 결과와 대조해 보고한다.
- 내용 수정이 필요해 보이면 이 task 에서 고치지 않고 Implementation Notes 에 기록한다.

## Parallel Execution Metadata

- Model Hint: sonnet — M3 (`Depended By` 1개)

### Ownership
- `src/content/docs/skills/ywc-brainstorm.mdx`
- `src/content/docs/skills/ywc-tech-research.mdx`
- `src/content/docs/skills/ywc-plan.mdx`
- `src/content/docs/skills/ywc-spec-writer.mdx`
- `src/content/docs/skills/ywc-spec-validate.mdx`
- `src/content/docs/skills/ywc-spec-ready.mdx`
- `src/content/docs/skills/ywc-task-generator.mdx`
- `src/content/docs/skills/ywc-confidence-gate.mdx`
- `src/content/docs/skills/ywc-adr.mdx`
- `src/content/docs/skills/ywc-mission.mdx`
- `src/content/docs/skills/ywc-wayfinder.mdx`
- `src/content/docs/skills/ywc-code-gen.mdx`
- `src/content/docs/skills/ywc-sequential-executor.mdx`
- `src/content/docs/skills/ywc-parallel-executor.mdx`
- `src/content/docs/skills/ywc-task-executor.mdx`
- `src/content/docs/skills/ywc-agentic.mdx`
- `src/content/docs/skills/ywc-worktrees.mdx`
- `src/content/docs/skills/ywc-docker-isolate.mdx`
- `src/content/docs/skills/ywc-docker-compose.mdx`
- `src/content/docs/skills/ywc-auth-implement.mdx`
- `src/content/docs/skills/ywc-manual-wizard.mdx`
- `src/content/docs/skills/ywc-team-assemble.mdx`
- `src/content/docs/skills/ywc-impl-review.mdx`
- `src/content/docs/skills/ywc-review-learnings.mdx`
- `src/content/docs/skills/ywc-mine-review-history.mdx`
- `src/content/docs/skills/ywc-security-audit.mdx`
- `src/content/docs/skills/ywc-ui-ux-review.mdx`
- `src/content/docs/skills/ywc-design-renew.mdx`
- `src/content/docs/skills/ywc-product-review.mdx`
- `src/content/docs/skills/ywc-receive-review.mdx`
- `src/content/docs/skills/ywc-debug-rootcause.mdx`
- `src/content/docs/skills/ywc-refactor-clean.mdx`
- `src/content/docs/skills/ywc-agent-legibility-audit.mdx`
- `src/content/docs/skills/ywc-architecture-invariants.mdx`
- `src/content/docs/skills/ywc-improve-architecture.mdx`
- `src/content/docs/skills/ywc-blast-radius.mdx`

### Owned Interface
- (None — no public interface owned)

### Shared Surfaces
- Content schema (읽기)
- Component contract SkillLink (읽기)

### Conflicts With
- (None identified) — `yk-000005-020-ui-skill-crosslinks-test-to-meta` 와 file 비중복

### Parallelizable After
- Phase yk-000004 전체

### Task Verify
- `pnpm run build`
- `pnpm run guard`
- (대상 page 마다 `관련 흐름` 절에 link 1개 이상 — grep 결과를 Implementation Notes 에 기록)

## Out of Scope
- option·사용 case 변경
- 흐름 page 수정
