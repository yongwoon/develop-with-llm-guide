# yk-000001-030-infra-public-guard — Implementation Checklist

## Prerequisites
- [ ] `yk-000001-020-lib-starlight-links-validator` 병합 완료
- [ ] 로컬에 `guard-words.local.txt` 가 있고 `git check-ignore guard-words.local.txt` 가 통과한다

## Allowed Edit Scope
- [ ] `README.md` 의 Ownership 안에서만 수정한다: `scripts/guard.mjs`; `scripts/guard.test.mjs`; `scripts/fixtures/guard/**`; `guard.config.json`; `.githooks/pre-push`; `package.json` (`scripts.guard` 항목만)
- [ ] Ownership 밖의 수정이 필요하면 진행하지 말고 먼저 보고한다

## Stop Conditions
- [ ] 선행 task 가 실제로 병합되지 않았거나 그 산출 contract 가 없으면 멈추고 보고한다
- [ ] 다른 task 의 Ownership 으로 수정이 번지면 멈추고 보고한다
- [ ] 공유 contract(schema, component props, astro.config, package.json)를 Scope 이상으로 바꿔야 하면 멈추고 보고한다
- [ ] 진행 중인 다른 task 가 이미 같은 surface 를 소유하고 있으면 멈추고 보고한다
- [ ] 검사 구현을 위해 민감 단어 원문을 file·log·task 문서에 써야 하는 상황이 생기면 즉시 멈추고 보고한다

## Implementation Steps
- [ ] `guard.config.json` 작성
  - [ ] 규칙 번호별 일반 패턴: 로컬 절대 경로, email 형식, 저장소명 접두 비공개 자료 경로
  - [ ] 규칙별 allowlist (예: 공개 noreply 주소)
  - [ ] 일반 패턴 검사 대상 경로(`src/`, `public/`, `.github/`)와 제외 경로 명시
- [ ] `scripts/guard.mjs` 구현
  - [ ] 대상 수집: `dist/**` 텍스트 file(`dist/pagefind/` 제외), `git ls-files` 결과
  - [ ] 민감 단어 로드: CI 는 env, 로컬은 `guard-words.local.txt`. 정규화 규칙 적용
  - [ ] fail-closed: `GITHUB_ACTIONS=true` 에서 단어 0개면 exit 1, 로컬은 경고 후 일반 패턴 검사 계속
  - [ ] email 패턴은 `.html` 에만 적용
  - [ ] 실패 출력은 file 경로 + 규칙 번호만. 일치 문자열·단어 목록 출력 금지
- [ ] self-check test
  - [ ] `scripts/fixtures/guard/` 에 가상 금지 문자열 fixture (실제 민감 단어 금지)
  - [ ] `scripts/guard.test.mjs` (node:test): 검출, allowlist 통과, fail-closed, log 에 일치 문자열 미출력 4가지 확인
- [ ] pre-push hook 과 npm script
  - [ ] `.githooks/pre-push`: `npm run build && npm run guard`, `set -x` 금지
  - [ ] `package.json` 에 `"guard": "node scripts/guard.mjs"`

## Acceptance Coverage
Covers: R-GUARD (전 항목), F-DEPLOY (가드 실패 시 배포 차단의 전제), UF-5 (log 에 경로·규칙 번호만)

<!-- Write portable commands: see references/execution-convention.md#task-verify-portability -->
## Task Verify
- [ ] `node --test scripts/guard.test.mjs`
- [ ] `npm run build`
- [ ] `npm run guard`
- [ ] `GITHUB_ACTIONS=true GUARD_SENSITIVE_WORDS= npm run guard; test $? -ne 0`

## Verification
- [ ] build 성공 (`npm run build`)
- [ ] 공개 가드 통과 (`npm run guard`)
- [ ] guard self-check 통과 (`node --test scripts/guard.test.mjs`)

## Implementation Notes (optional)
