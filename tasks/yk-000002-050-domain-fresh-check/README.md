# yk-000002-050-domain-fresh-check

## Purpose
최신성 점검 script(R-FRESH)를 만들어, 로컬 `../develop-with-llm` 의 skill·agent 메타데이터와 사이트 frontmatter 의 차이를 도구별 양방향으로 보고한다. skill page 작성 task 가 option 완전성을 확인하는 수단이 된다.

## Scope
- `scripts/fresh-check.mjs` (Node stdlib 만, 저장소에 아무것도 쓰지 않음)
- npm script `fresh-check`
- `scripts/fresh-check.test.mjs` + 가상 fixture (Arguments 표 파서 정규화 규칙)
- exit code 0 / 1 / 2

## Spec Reference

### Primary Sources
- `docs/specification/06-requirements.md#r-fresh-최신성-sc002` — 비교 항목, option 비교 키 정규화, 종료 코드
- `docs/specification/04-interfaces.md#로컬-명령-owner-용`
- `docs/specification/05-user-flows.md#uf-4-develop-with-llm-변경을-사이트에-반영-유지보수`
- `docs/specification/03-data.md#skill-page` — `options`, `excludedOptions`, `userInvoked`

### Summary
skill 목록(합집합, `ywc-shared-scripts` 제외), 도구별 존재, option 이름 집합(`options` ∪ `excludedOptions` vs `## Arguments` 첫 표), option 별 지원 도구, userInvoked, agent 이름·도구별 존재, stale `sourceVersion` 을 비교한다. 본문은 읽어 저장하지 않으며 결과는 화면에만 출력한다(OQ-05, RA002 아님). 위임 문구 후보는 참고 경고로만 출력한다.

### Out of Scope (from spec)
- 사이트 content 자동 수정·sync (RA002)
- agent page 작성 — `yk-000004-030-ui-agent-getting-started-pages`

## Criticality

`normal` — 로컬 전용 읽기 script

## Dependencies

### Depends On
- `yk-000002-010-domain-content-schema` — frontmatter 필드 이름

### Depended By
- Phase yk-000003 skill page task 5개 — option 완전성 확인
- `yk-000005-030-test-first-release-gate` — 출시 전 전체 차이 0건 확인

## Key Files
- `scripts/fresh-check.mjs`
- `scripts/fresh-check.test.mjs`
- `scripts/fixtures/fresh-check/**`
- `package.json` (`scripts.fresh-check`)

## Notes
- **Base branch: `content/initial`** (R-RELEASE). task branch 는 `content/initial` 에서 만들고 `content/initial` 로 병합한다. main 에 직접 병합하지 않는다.
- private 저장소 경로는 기본값 `../develop-with-llm` 이며 다른 경로는 env 로만 받는다. 절대 경로를 code·문서에 쓰지 않는다.
- fixture 는 가상의 skill 이름·option 으로 만들고 `SKILL.md` 원문을 복사하지 않는다.
- 도구별 skill·agent·VERSION 위치는 `../develop-with-llm` 의 directory 구조를 읽어 정한다 (Implementation Notes 에 기록, 경로 자체는 상대 경로로만).
- Arguments 파싱 규칙: `## Arguments` 아래 첫 표만, backtick 안 `|` 무시, `--flag` 와 alias 각각 키, `--flag <값>` 의 `<값>` 은 키 아님, 단독 `<…>` 는 `positional:<…>`, 자연어 행 제외, `N/A —` 는 빈 집합.

## Parallel Execution Metadata

- Model Hint: opus — M1 (`Depended By` 2개 이상 + `Owned Interface` 있음)

### Ownership
- `scripts/fresh-check.mjs`
- `scripts/fresh-check.test.mjs`
- `scripts/fixtures/fresh-check/**`
- `package.json` (`scripts.fresh-check` 항목만)

### Owned Interface
- `npm run fresh-check` — exit 0 일치 / 1 차이 있음 / 2 경로 없음·읽기 실패. 보고서는 stdout 에 skill·항목별로 출력

### Shared Surfaces
- Workspace config: `package.json`

### Conflicts With
- (None identified) — Phase yk-000002 안에서 `package.json` 은 이 task 만 수정

### Parallelizable After
- yk-000002-010-domain-content-schema

### Task Verify
- `node --test scripts/fresh-check.test.mjs`
- `npm run fresh-check; test $? -le 1`
- `git status --porcelain`

## Out of Scope
- 보고서 file 저장
- content 자동 생성
- CI 실행 (로컬 전용)
