# yk-000004-030-ui-agent-getting-started-pages — Implementation Checklist

## Prerequisites
- [ ] `yk-000004-020-ui-flow-pages-18-25` 병합 완료

## Allowed Edit Scope
- [ ] `README.md` 의 Ownership 안에서만 수정한다: `src/content/docs/agents/**`; `src/content/docs/index.mdx`; `src/content/docs/getting-started/**`; `astro.config.mjs` (sidebar 시작하기 group 의 items 만); `.fact-memos/agents/` (local, 비추적)
- [ ] Ownership 밖의 수정이 필요하면 진행하지 말고 먼저 보고한다

## Stop Conditions
- [ ] 선행 task 가 실제로 병합되지 않았거나 그 산출 contract 가 없으면 멈추고 보고한다
- [ ] 다른 task 의 Ownership 으로 수정이 번지면 멈추고 보고한다
- [ ] 공유 contract(schema, component props, astro.config, package.json)를 Scope 이상으로 바꿔야 하면 멈추고 보고한다
- [ ] 진행 중인 다른 task 가 이미 같은 surface 를 소유하고 있으면 멈추고 보고한다

## Implementation Steps
- [ ] agent 사실 메모 → page
  - [ ] `.fact-memos/agents/<agent>.md` 에 도구별 존재·권한·역할·사용하는 skill 만 기록
  - [ ] `agents/overview.mdx`(도구별 구성·model 고정 정책 같은 설치 차이), `workers.mdx`(write-enabled), `advisors.mdx`(read-only). `kind: agent`, `agentGroup`, `sidebar.order`
- [ ] 시작하기
  - [ ] `getting-started/install.mdx`: 통합 install script·도구별 설치·사전 요구 도구(`gh` 인증, `jq` 등). 저장소 URL·clone 명령 없음
  - [ ] `getting-started/tool-differences.mdx`: 호출 표기, skill·agent 구성 차이, 설정 file 위치
  - [ ] `astro.config.mjs` 시작하기 items 에 두 page 추가
- [ ] 홈
  - [ ] 이 guide 사용법, 흐름 16개 진입 목록(번호 순, base prefix 절대 경로), Skill 색인 link, `<VerifiedStamp />`
- [ ] 점검
  - [ ] `pnpm run fresh-check` agent 항목 차이 0건
  - [ ] `pnpm run build && pnpm run guard`

## Acceptance Coverage
Covers: F-AGENT (3 page, 17행, CN004 경계), F-START (3 page, setup link, 설치 page 금지 사항), F-NAV (홈 → 흐름 1 클릭, sidebar 시작하기), R-CONTENT (agent page), R-FRESH (agent 일치)

<!-- Write portable commands: see references/execution-convention.md#task-verify-portability -->
## Task Verify
- [ ] `pnpm run build`
- [ ] `pnpm run guard`
- [ ] `pnpm run fresh-check`
- [ ] `test -z "$(git ls-files .fact-memos)"`

## Verification
- [ ] build 성공 (`pnpm run build`)
- [ ] 공개 가드 통과 (`pnpm run guard`)
- [ ] lint / typecheck: N/A — spec·tech-stack 이 정의한 script 가 없다

## Implementation Notes (optional)
