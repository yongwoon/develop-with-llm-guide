# yk-000002-050-domain-fresh-check — Implementation Checklist

## Prerequisites
- [x] `yk-000002-010-domain-content-schema` 병합 완료
- [x] 로컬에 `../develop-with-llm` checkout 이 있다

## Allowed Edit Scope
- [x] `README.md` 의 Ownership 안에서만 수정한다: `scripts/fresh-check.mjs`; `scripts/fresh-check.test.mjs`; `scripts/fixtures/fresh-check/**`; `package.json` (`scripts.fresh-check` 항목만)
- [x] Ownership 밖의 수정이 필요하면 진행하지 말고 먼저 보고한다

## Stop Conditions
- [x] 선행 task 가 실제로 병합되지 않았거나 그 산출 contract 가 없으면 멈추고 보고한다
- [x] 다른 task 의 Ownership 으로 수정이 번지면 멈추고 보고한다
- [x] 공유 contract(schema, component props, astro.config, package.json)를 Scope 이상으로 바꿔야 하면 멈추고 보고한다
- [x] 진행 중인 다른 task 가 이미 같은 surface 를 소유하고 있으면 멈추고 보고한다

## Implementation Steps
- [x] 소스 읽기
  - [x] 도구별 skill directory 와 `SKILL.md` frontmatter(userInvoked), Codex openai.yaml 정책 값, agent 목록, VERSION 읽기
  - [x] 경로 없음·읽기 실패 시 exit 2
- [x] Arguments 파서
  - [x] Notes 의 정규화 규칙 구현
  - [x] Arguments 섹션 없음·파싱 실패는 skill 이름과 함께 오류 보고
- [x] 사이트 쪽 수집
  - [x] `src/content/docs/skills/*.mdx` frontmatter 를 읽어 `options[].name` 에 같은 키 규칙 적용 (`--a / --b` alias 분리)
  - [x] agent page 표의 agent 이름·도구 수집 (page 가 아직 없으면 "agent page 없음" 으로 보고)
- [x] 비교와 출력
  - [x] skill 합집합, tools, option 집합(누락·초과), option 별 도구, userInvoked, agent, stale sourceVersion
  - [x] 위임 문구 후보(Caller-only, passed by, alias)는 참고 경고
  - [x] 차이 있으면 exit 1
- [x] self-check
  - [x] `scripts/fresh-check.test.mjs` 로 파서 규칙과 exit code 확인 (가상 fixture)

## Acceptance Coverage
Covers: R-FRESH (전 항목), UF-4, F-FRESH (차이 점검 절차), SC002, SC005 (option 완전성 검증 수단)

<!-- Write portable commands: see references/execution-convention.md#task-verify-portability -->
## Task Verify
- [x] `node --test scripts/fresh-check.test.mjs`
- [x] `npm run fresh-check; test $? -le 1`
- [x] `git status --porcelain`

## Verification
- [x] build 성공 (`npm run build`)
- [x] 공개 가드 통과 (`npm run guard`)
- [x] fresh-check self-check 통과 (`node --test scripts/fresh-check.test.mjs`)
- [x] 실행 후 `git status --porcelain` 에 변경 없음

## Implementation Notes (optional)

- 소스 위치 (상대 경로, 기본 `../develop-with-llm`, 다른 위치는 `FRESH_CHECK_SOURCE`): 도구별 `tools/claude-code/`, `tools/codex-skill/` 아래의 `VERSION`, `skills/ywc-*/SKILL.md`, `agents/ywc-*` (Claude Code `.md`, Codex `.toml`). `ywc-shared-scripts` 와 `SKILL.md` 없는 directory 는 제외.
- userInvoked 출처: Claude Code 는 `SKILL.md` frontmatter `disable-model-invocation: true`, Codex 는 `skills/<skill>/agents/openai.yaml` 의 `policy.allow_implicit_invocation: false`. 값이 없으면 false.
- YAML 파싱: Node stdlib 에는 YAML parser 가 없어, astro 가 직접 의존하는 `yaml` package(이미 설치됨, package.json 변경 없음)를 쓴다. frontmatter 의 flow map·따옴표를 직접 파싱하는 것보다 안전하다고 판단했다.
- agent page 표 규약 (yk-000004-030 이 따름): 첫 열에 `ywc-…` agent 이름, 둘째 열에 사용 가능 도구("Claude Code", "Codex" 문구). agent page 가 없으면 "agent page 없음" 1건으로 보고.
- 차이(exit 1)로 세는 것: skill page 누락·초과, tools 불일치, 도구별 option 누락·초과(`options` 의 해당 도구 항목 ∪ `excludedOptions[도구]` vs Arguments), userInvoked 불일치, Arguments 파싱 오류, agent 누락·초과, stale `sourceVersion`. 참고(exit 에 영향 없음): 위임 문구 후보, 자연어 인자 행 수.
- 실제 저장소 대상 실행 (2026-10-28): skill 합집합 63개, Arguments 파싱 오류 0건, 7개 skill 은 `N/A —`. 현재 skill page 가 없어 "skill page 없음" 63건 + "agent page 없음" 1건으로 exit 1. 저장소에 쓰는 file 없음.
- spec 규칙의 한계: `` `security` `` 처럼 꺾쇠 없이 쓴 위치 인자는 첫 열 규칙상 key 가 아니라 자연어 행으로 빠진다(현재 몇 개 skill). 비교에서는 빠지고 "참고"에 행 수로만 나온다. skill page 작성 시 이 skill 들은 option 표를 직접 대조한다.
- test: `scripts/fresh-check.test.mjs` 26개 (파서 규칙, 사이트 key, 가상 fixture 일치 exit 0, 13가지 차이 각각 exit 1, source 없음·VERSION 없음 exit 2, file 무변경). mutation 7개(값을 key 로 셈, 제외 skill 무시, `###` 경계, stale, userInvoked, excludedOptions, exit code) 모두 test 가 잡음. 첫 mutation 에서 `###` 경계 mutant 가 살아남아 test 를 보강했다. fixture 의 `:--` 구분선으로 parser 가 GFM 짧은 구분선을 거부하던 결함도 고쳤다.
