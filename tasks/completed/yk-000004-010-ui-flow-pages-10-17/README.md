# yk-000004-010-ui-flow-pages-10-17

## Purpose
상황별 흐름 page 10–17 (8개)를 작성한다. 각 단계는 SkillLink 로 skill page 의 option 표에 연결된다.

## Scope
- 흐름 page 8개 (`src/content/docs/flows/`):
  - 10 새 project 시작하기 (`flows/new-project.mdx`)
  - 11 기존 repo 진입하기 (`flows/onboarding-existing-repo.mdx`)
  - 12 작은 변경
  - 13 중·대형 기능
  - 14 목표 하나로 자율 실행
  - 15 장기·불확실한 initiative
  - 16 PR review 대응과 merge
  - 17 디버깅과 장애 회고
- "관련 흐름" 절은 비워 두지 않고 생략 — `yk-000004-020-ui-flow-pages-18-25` 가 16개 전부에 채운다

## Spec Reference

### Primary Sources
- `docs/specification/02-features.md#f-flow-상황별-흐름-페이지` — 16개 표와 흐름 표기 범례
- `docs/specification/03-data.md#flow-page`
- `docs/specification/05-user-flows.md#uf-2-상황에서-출발해-찾기`
- `docs/specification/06-requirements.md#r-search-한국어-검색-실측`

### Summary
spec 표의 핵심 skill 순서를 FlowStep 으로 옮기고 범례(→ step, ↔ loop 2단계, 또는 alt, `,` 선택)를 따른다. titleBlock 의 단계 수·필수/선택 수는 확정한 FlowStep 목록에서 계산한다. 실행 예시는 단계별 Claude Code/Codex Tabs 이며 한쪽 전용 skill 은 대체 안내를 붙인다.

### Out of Scope (from spec)
- 흐름 18–25 와 관련 흐름 절 — `yk-000004-020-ui-flow-pages-18-25`
- 홈의 흐름 진입 목록 — `yk-000004-030-ui-agent-getting-started-pages`
- skill page 의 관련 흐름 — `yk-000005-010-ui-skill-crosslinks-plan-to-review`, `yk-000005-020-ui-skill-crosslinks-test-to-meta`

## Criticality

`normal` — 공개 content

## Dependencies

### Depends On
- Phase yk-000003 전체 — SkillLink 대상 63 page
- `yk-000002-040-ui-flow-components` — Flow/FlowStep/TitleBlock

### Depended By
- `yk-000004-020-ui-flow-pages-18-25` — 관련 흐름 대상 page
- `yk-000004-030-ui-agent-getting-started-pages` — 홈 진입 목록 대상 page
- `yk-000005-010-ui-skill-crosslinks-plan-to-review`, `yk-000005-020-ui-skill-crosslinks-test-to-meta` — skill page 관련 흐름 대상

## Key Files
- `src/content/docs/flows/new-project.mdx`
- `src/content/docs/flows/onboarding-existing-repo.mdx`
- `src/content/docs/flows/<slug>.mdx` (흐름 12–17, 6개)

## Notes
- **Base branch: `content/initial`** (R-RELEASE). task branch 는 `content/initial` 에서 만들고 `content/initial` 로 병합한다. main 에 직접 병합하지 않는다.
- **사례 값**: project 이름·경로·PR 번호는 가상의 값이나 이 guide 저장소 자체의 값만 쓴다. owner 의 다른 private project 이름은 쓰지 않는다.
- **호출 표기**: Claude Code `/ywc-…`, Codex `$ywc-…`. Tabs 는 `syncKey="tool"` 이고 Claude Code tab 을 먼저 둔다. code block 에 프롬프트 기호(›)를 넣지 않고 placeholder 는 `<PR#>` 처럼 꺾쇠로 쓴다.
- **확인 기준**: `verifiedAt` 은 작성일, `sourceVersion` 은 작성 시점의 `../develop-with-llm` 도구별 VERSION 값 (spec 03-data 기준값 참조). 한쪽 도구 전용 page 는 해당 도구 key 만 둔다.
- task 파일·commit·page 어디에도 민감 단어, 로컬 절대 경로, private 저장소 원문을 쓰지 않는다. private 저장소는 `../develop-with-llm` 으로만 지칭한다.
- file 이름은 lowercase kebab-case 영어 slug (예: `new-project.mdx`, `onboarding-existing-repo.mdx`). 나머지 slug 는 이 task 에서 정하고 Implementation Notes 에 기록한다.
- `sidebar.order` = 흐름 번호, `sidebar.label` 앞에 번호. description 과 소제목에 한국어 상황어 (R-SEARCH: "새 프로젝트", "리뷰 대응", "병렬", "인프라", "장애").
- 본문 순서 고정: 리드 → "언제 쓰나" Aside → Flow → 실행 예시(단계별 Tabs) → 건너뛸 수 있는 조건 → 관련 흐름. 필수/선택은 범례 기본 규칙을 따르고 예외는 "건너뛸 수 있는 조건"에 함께 적는다.
- CN004: skill 의 내부 절차는 쓰지 않는다. 흐름은 skill 간 순서만 다룬다.
- **Mobile-first**: layout 은 component 소유. 375px 가로 scroll 0 만 확인한다.

## Parallel Execution Metadata

- Model Hint: opus — M1 (`Depended By` 3개 이상 + `Owned Interface` 있음)

### Ownership
- `src/content/docs/flows/` 의 흐름 10–17 page 8개

### Owned Interface
- 흐름 10–17 page slug (`/develop-with-llm-guide/flows/<slug>/`)

### Shared Surfaces
- Content schema (읽기)
- sidebar 상황별 흐름 group (autogenerate)

### Conflicts With
- `yk-000004-020-ui-flow-pages-18-25` — 흐름 10–17 의 관련 흐름 절 (의존 순서로 해소)

### Parallelizable After
- Phase yk-000003 전체

### Task Verify
- `pnpm run build`
- `pnpm run guard`

## Out of Scope
- skill page 수정
- 흐름 18–25
