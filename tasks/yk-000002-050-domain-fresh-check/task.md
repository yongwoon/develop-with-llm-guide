# yk-000002-050-domain-fresh-check — Implementation Checklist

## Prerequisites
- [ ] `yk-000002-010-domain-content-schema` 병합 완료
- [ ] 로컬에 `../develop-with-llm` checkout 이 있다

## Allowed Edit Scope
- [ ] `README.md` 의 Ownership 안에서만 수정한다: `scripts/fresh-check.mjs`; `scripts/fresh-check.test.mjs`; `scripts/fixtures/fresh-check/**`; `package.json` (`scripts.fresh-check` 항목만)
- [ ] Ownership 밖의 수정이 필요하면 진행하지 말고 먼저 보고한다

## Stop Conditions
- [ ] 선행 task 가 실제로 병합되지 않았거나 그 산출 contract 가 없으면 멈추고 보고한다
- [ ] 다른 task 의 Ownership 으로 수정이 번지면 멈추고 보고한다
- [ ] 공유 contract(schema, component props, astro.config, package.json)를 Scope 이상으로 바꿔야 하면 멈추고 보고한다
- [ ] 진행 중인 다른 task 가 이미 같은 surface 를 소유하고 있으면 멈추고 보고한다

## Implementation Steps
- [ ] 소스 읽기
  - [ ] 도구별 skill directory 와 `SKILL.md` frontmatter(userInvoked), Codex openai.yaml 정책 값, agent 목록, VERSION 읽기
  - [ ] 경로 없음·읽기 실패 시 exit 2
- [ ] Arguments 파서
  - [ ] Notes 의 정규화 규칙 구현
  - [ ] Arguments 섹션 없음·파싱 실패는 skill 이름과 함께 오류 보고
- [ ] 사이트 쪽 수집
  - [ ] `src/content/docs/skills/*.mdx` frontmatter 를 읽어 `options[].name` 에 같은 키 규칙 적용 (`--a / --b` alias 분리)
  - [ ] agent page 표의 agent 이름·도구 수집 (page 가 아직 없으면 "agent page 없음" 으로 보고)
- [ ] 비교와 출력
  - [ ] skill 합집합, tools, option 집합(누락·초과), option 별 도구, userInvoked, agent, stale sourceVersion
  - [ ] 위임 문구 후보(Caller-only, passed by, alias)는 참고 경고
  - [ ] 차이 있으면 exit 1
- [ ] self-check
  - [ ] `scripts/fresh-check.test.mjs` 로 파서 규칙과 exit code 확인 (가상 fixture)

## Acceptance Coverage
Covers: R-FRESH (전 항목), UF-4, F-FRESH (차이 점검 절차), SC002, SC005 (option 완전성 검증 수단)

<!-- Write portable commands: see references/execution-convention.md#task-verify-portability -->
## Task Verify
- [ ] `node --test scripts/fresh-check.test.mjs`
- [ ] `npm run fresh-check; test $? -le 1`
- [ ] `git status --porcelain`

## Verification
- [ ] build 성공 (`npm run build`)
- [ ] 공개 가드 통과 (`npm run guard`)
- [ ] fresh-check self-check 통과 (`node --test scripts/fresh-check.test.mjs`)
- [ ] 실행 후 `git status --porcelain` 에 변경 없음

## Implementation Notes (optional)
