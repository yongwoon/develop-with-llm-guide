# yk-000004-030-ui-agent-getting-started-pages

## Purpose
Agent reference 3 page 와 시작하기 page(홈, 설치, 두 도구의 차이)를 작성하고, 홈에 흐름 16개 진입 목록을 둔다.

## Scope
- `src/content/docs/agents/overview.mdx`, `workers.mdx`, `advisors.mdx` (agent 17개 표, `agentGroup`, `sidebar.order` 개요 → 작업 → 자문·리뷰)
- `src/content/docs/index.mdx`: guide 사용법 + 흐름 16개 진입 목록 + Skill 색인 link
- `src/content/docs/getting-started/install.mdx`, `tool-differences.mdx`
- `astro.config.mjs` 시작하기 group 에 설치·두 도구의 차이 항목 추가
- agent 사실 메모 `.fact-memos/agents/<agent>.md` (local 전용)

## Spec Reference

### Primary Sources
- `docs/specification/02-features.md#f-agent-agent-reference`, `#f-start-시작하기`, `#f-nav-탐색-구조`
- `docs/specification/03-data.md#agent-page`, `#sidebar-구성`
- `docs/specification/04-interfaces.md#url-구조` — agent 경로 예 `agents/advisors/`
- `docs/specification/01-overview.md#배경` — 도구별 구성 차이

### Summary
agent 표는 이름, 사용 가능 도구, 권한(read-only/write-enabled), 역할, 주로 dispatch 하는 skill 열이다. "어느 skill 이 어느 agent 를 쓰는가"만 쓰고 dispatch 방식·순서·조건은 쓰지 않는다(OQ-12). 설치 page 에는 private 저장소 URL, clone 명령, 인증 정보를 쓰지 않는다. `ywc-setup` 은 SkillLink 로 연결한다.

### Out of Scope (from spec)
- skill page — Phase yk-000003
- 검색 실측 — `yk-000005-030-test-first-release-gate`

## Criticality

`normal` — 공개 content

## Dependencies

### Depends On
- `yk-000004-010-ui-flow-pages-10-17`, `yk-000004-020-ui-flow-pages-18-25` — 홈 진입 목록 대상 흐름 16 page

### Depended By
- `yk-000005-030-test-first-release-gate` — 86 page 완성

## Key Files
- `src/content/docs/agents/overview.mdx`
- `src/content/docs/agents/workers.mdx`
- `src/content/docs/agents/advisors.mdx`
- `src/content/docs/index.mdx`
- `src/content/docs/getting-started/install.mdx`
- `src/content/docs/getting-started/tool-differences.mdx`
- `astro.config.mjs` (sidebar 시작하기 items)

## Notes
- **Base branch: `content/initial`** (R-RELEASE). task branch 는 `content/initial` 에서 만들고 `content/initial` 로 병합한다. main 에 직접 병합하지 않는다.
- **사실 메모 우선 (CN001, OQ-06)**: `../develop-with-llm` 의 `SKILL.md` 를 보고 바로 본문을 쓰지 않는다. 먼저 `.fact-memos/skills/<skill>.md` (저장소 root, `.gitignore` 로 추적 제외 — `yk-000001-010-lib-astro-starlight-scaffold` 에서 등록) 에 사실 메모(사용 case, option 이름·형식·기본값·지원 도구, 산출물, userInvoked)를 쓰고, 그 메모만 보고 page 를 쓴다. 메모는 절대 commit 하지 않는다 (`git add -f` 금지).
- **CN004**: 단계 절차(Phase/Step), 내부 판정 규칙·점수 산식, subagent dispatch 방식, 내부 file·script 구조를 쓰지 않는다. 결과물은 "무엇이 어디에 생기는가"까지만 쓴다.
- **SC002**: skill 이름·option 이름은 `SKILL.md` 표기 그대로 옮기고, 설명 문장은 새로 쓴다. 원문 문장 복사·번역 이식 금지.
- **사례 값**: project 이름·경로·PR 번호는 가상의 값이나 이 guide 저장소 자체의 값만 쓴다. owner 의 다른 private project 이름은 쓰지 않는다.
- **호출 표기**: Claude Code `/ywc-…`, Codex `$ywc-…`. Tabs 는 `syncKey="tool"` 이고 Claude Code tab 을 먼저 둔다. code block 에 프롬프트 기호(›)를 넣지 않고 placeholder 는 `<PR#>` 처럼 꺾쇠로 쓴다.
- **확인 기준**: `verifiedAt` 은 작성일, `sourceVersion` 은 작성 시점의 `../develop-with-llm` 도구별 VERSION 값 (spec 03-data 기준값 참조). 한쪽 도구 전용 page 는 해당 도구 key 만 둔다.
- task 파일·commit·page 어디에도 민감 단어, 로컬 절대 경로, private 저장소 원문을 쓰지 않는다. private 저장소는 `../develop-with-llm` 으로만 지칭한다.
- agent 17개: 두 도구 공통 8, Claude Code 전용 6, Codex 전용 3 (spec F-AGENT 표). 표시 개수는 표 행에서 나오며 spec 수치를 하드코딩하지 않는다.
- **Mobile-first**: 375px 에서 agent 표와 홈 진입 목록의 가로 scroll 0 확인 (표는 요소 내부 scroll 허용).

## Parallel Execution Metadata

- Model Hint: sonnet — M3 (`Depended By` 1개)

### Ownership
- `src/content/docs/agents/**`
- `src/content/docs/index.mdx`
- `src/content/docs/getting-started/**`
- `astro.config.mjs` (sidebar 시작하기 group 의 items 만)
- `.fact-memos/agents/` (local, 비추적)

### Owned Interface
- (None — no public interface owned)

### Shared Surfaces
- Build config: `astro.config.mjs`
- Content schema (읽기)

### Conflicts With
- (None identified)

### Parallelizable After
- yk-000004-020-ui-flow-pages-18-25

### Task Verify
- `npm run build`
- `npm run guard`
- `npm run fresh-check`
- `test -z "$(git ls-files .fact-memos)"`

## Out of Scope
- agent 내부 동작 설명
- skill page 수정
