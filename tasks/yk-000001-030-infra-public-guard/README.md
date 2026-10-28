# yk-000001-030-infra-public-guard

## Purpose
공개 가드(R-GUARD)를 구현해 build 산출물과 git 추적 file 에 금지 문자열이 있으면 실패시킨다. 로컬 pre-push 와 CI 가 같은 검사를 수행한다.

## Scope
- `scripts/guard.mjs` (Node stdlib 만 사용, 의존성 추가 없음)
- `guard.config.json` (일반 패턴 + 규칙별 allowlist, 공개되어도 무방한 내용만)
- `.githooks/pre-push` (build → guard)
- npm script `guard`
- `scripts/guard.test.mjs` + `scripts/fixtures/guard/**` (가상 단어·가상 경로만 쓰는 fixture)

## Spec Reference

### Primary Sources
- `docs/specification/06-requirements.md#r-guard-공개-가드-cn001-ng001` — 검사 대상·범위·금지 대상·두 층 금지 목록·fail-closed·log 규칙·단어 목록 형식
- `docs/specification/05-user-flows.md#uf-5-배포` — 실패 시 log
- `docs/tech-stack.md` — `scripts/guard.mjs`, `guard.config.json`, `.githooks/pre-push`
- `docs/research/2026-10-28-public-guard-tooling.md` — gitleaks·secretlint 대비 자체 script 를 택한 근거와 재검토 조건

### Summary
검사 대상은 `dist/` 텍스트 file 전부(`dist/pagefind/` 제외), git 추적 file 전부(민감 단어), `src/`·`public/`·`.github/`(일반 패턴)이다. email 패턴은 HTML 에만 적용한다. 민감 단어는 로컬 `guard-words.local.txt` 또는 CI 의 `GUARD_SENSITIVE_WORDS` env 에서 읽고, `GITHUB_ACTIONS=true` 인데 단어가 0개면 실패한다(fail-closed). 실패 log 에는 file 경로와 규칙 번호만 출력한다.

### Out of Scope (from spec)
- CI workflow 와 secret 전달 — `yk-000001-040-infra-github-actions-deploy`
- commit 이력 검사 (spec 상 대상 아님)

## Criticality

`critical` — spec 에 Critical Surfaces 선언은 없다. 이 task 는 secret(`GUARD_SENSITIVE_WORDS`) 을 읽고 공개 저장소의 유출 방지(CN001·NG001, 회수 불가)를 책임지므로 keyword heuristic(`secret`)으로 추론했다. 오판이면 owner 가 `normal` 로 낮출 수 있다.

## Dependencies

### Depends On
- `yk-000001-020-lib-starlight-links-validator` — `package.json`·lockfile 순서 (같은 file 을 연속 수정)

### Depended By
- `yk-000001-040-infra-github-actions-deploy` — CI 의 guard step 이 `npm run guard` 를 호출

## Key Files
- `scripts/guard.mjs`
- `scripts/guard.test.mjs`
- `scripts/fixtures/guard/**`
- `guard.config.json`
- `.githooks/pre-push`
- `package.json` (scripts.guard)

## Notes
- **Base branch: `main`** (R-RELEASE — 첫 공개 전 main 에는 scaffold·공개 가드·배포 workflow·최소 홈만 둔다).
- **민감 단어를 어디에도 쓰지 않는다.** 로컬 `guard-words.local.txt` 가 원본이며 이 task 는 그 file 의 내용을 읽어 출력·기록·commit 하지 않는다. test fixture 는 가상의 단어(예: `fixture-secret-word`)를 env 로 주입한다.
- 로컬 절대 경로 패턴, email 패턴, 저장소명 접두 비공개 경로 패턴(OQ-15: 맨 `prompts` 단어는 허용)은 `guard.config.json` 에 둔다. `docs/`, `tasks/`, `scripts/`, `guard.config.json` 은 일반 패턴 검사에서 제외한다(자기 검출 방지).
- 단어 목록 형식: UTF-8, 한 줄 한 단어, 빈 줄·`#` 주석 무시, CRLF 제거, NFC 정규화, 고정 문자열·대소문자 무시 비교.
- shell trace(`set -x`) 금지. pre-push hook 은 `git config core.hooksPath .githooks` 로 owner 가 1회 수동 등록한다 (README 안내는 이 task 범위 밖, 등록 명령은 test.md 에 기록).
- commit identity: 이 저장소의 commit email 은 owner 가 지정한 주소를 저장소 local 설정으로 쓴다 (spec R-GUARD). 이 task 에서 git 설정을 바꾸지 않는다.

## Parallel Execution Metadata

- Model Hint: opus — M1 (`Criticality: critical`)

### Ownership
- `scripts/guard.mjs`
- `scripts/guard.test.mjs`
- `scripts/fixtures/guard/**`
- `guard.config.json`
- `.githooks/pre-push`
- `package.json` (`scripts.guard` 항목만)

### Owned Interface
- `npm run guard` — exit 0 통과 / 0 이 아니면 실패, stdout 에 `<file 경로> <규칙 번호>` 만 출력
- env `GUARD_SENSITIVE_WORDS` (CI), file `guard-words.local.txt` (로컬)
- `guard.config.json` 형식: 규칙 번호별 pattern 과 allowlist

### Shared Surfaces
- Workspace config: `package.json`
- CI contract: `GUARD_SENSITIVE_WORDS` env 이름

### Conflicts With
- `yk-000001-020-lib-starlight-links-validator` — `package.json`·lockfile
- `yk-000001-040-infra-github-actions-deploy` — guard 호출 contract

### Parallelizable After
- yk-000001-020-lib-starlight-links-validator

### Task Verify
- `node --test scripts/guard.test.mjs`
- `npm run build`
- `npm run guard`
- `GITHUB_ACTIONS=true GUARD_SENSITIVE_WORDS= npm run guard; test $? -ne 0`

## Out of Scope
- GitHub Actions workflow
- 민감 단어 목록 편집
- commit 이력 scan
