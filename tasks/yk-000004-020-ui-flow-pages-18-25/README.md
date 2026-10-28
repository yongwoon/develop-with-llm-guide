# yk-000004-020-ui-flow-pages-18-25

## Purpose
상황별 흐름 page 18–25 (8개)를 작성하고, 흐름 16개 전부에 "관련 흐름" 절을 채운다. 63개 skill 이 모두 1개 이상의 흐름에 등장하는지 확인한다.

## Scope
- 흐름 page 8개:
  - 18 테스트와 완료 검증
  - 19 디자인·제품 점검
  - 20 인프라·클라우드
  - 21 인증 구현
  - 22 코드 구조 개선 (`ywc-blast-radius` 는 Codex 전용 표시)
  - 23 릴리스와 저장소 운영
  - 24 로컬 환경과 병렬 작업
  - 25 세션 운영과 skill 관리
- 흐름 10–25 전부의 "관련 흐름" 절 (base prefix 절대 경로 link)
- 63개 skill 의 흐름 등장 여부 확인 (alt 대안 포함)

## Spec Reference

### Primary Sources
- `docs/specification/02-features.md#f-flow-상황별-흐름-페이지`
- `docs/specification/03-data.md#flow-page`
- `docs/specification/06-requirements.md#r-search-한국어-검색-실측`

### Summary
`yk-000004-010-ui-flow-pages-10-17` 와 같은 규칙으로 흐름 18–25 를 쓴다. 16개가 모두 생긴 뒤이므로 관련 흐름 link 가 깨지지 않는다. 흐름에 한 번도 등장하지 않는 skill 이 있으면 spec 표와 대조해 보고한다.

### Out of Scope (from spec)
- 홈 진입 목록 — `yk-000004-030-ui-agent-getting-started-pages`
- skill page 의 관련 흐름 — `yk-000005-010-ui-skill-crosslinks-plan-to-review`, `yk-000005-020-ui-skill-crosslinks-test-to-meta`

## Criticality

`normal` — 공개 content

## Dependencies

### Depends On
- `yk-000004-010-ui-flow-pages-10-17` — 흐름 10–17 page (관련 흐름 대상)
- Phase yk-000003 전체

### Depended By
- `yk-000004-030-ui-agent-getting-started-pages` — 홈 진입 목록 대상
- `yk-000005-010-ui-skill-crosslinks-plan-to-review` — 관련 흐름 대상
- `yk-000005-020-ui-skill-crosslinks-test-to-meta` — 관련 흐름 대상

## Key Files
- `src/content/docs/flows/<slug>.mdx` (흐름 18–25, 8개)
- 흐름 10–17 page 의 관련 흐름 절

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

- Model Hint: opus — M1 (`Depended By` 3개 + `Owned Interface` 있음)

### Ownership
- `src/content/docs/flows/` 의 흐름 18–25 page 8개
- `src/content/docs/flows/` 흐름 10–17 page 의 "관련 흐름" 절만

### Owned Interface
- 흐름 18–25 page slug

### Shared Surfaces
- Content schema (읽기)
- sidebar 상황별 흐름 group

### Conflicts With
- `yk-000004-010-ui-flow-pages-10-17` — 흐름 10–17 file (의존 순서로 해소)

### Parallelizable After
- yk-000004-010-ui-flow-pages-10-17

### Task Verify
- `pnpm run build`
- `pnpm run guard`
- (63개 skill 각각이 `src/content/docs/flows/*.mdx` 에 1회 이상 등장 — grep 으로 확인해 Implementation Notes 에 결과 기록)

## Out of Scope
- skill page 수정
- 홈 수정
