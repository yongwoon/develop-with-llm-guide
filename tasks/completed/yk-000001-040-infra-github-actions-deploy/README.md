# yk-000001-040-infra-github-actions-deploy

## Purpose
main push 시 build → 공개 가드 → Pages 배포를 수행하는 `deploy.yml` 과, `content/initial` push·PR 에서 build + 가드만 수행하는 `check.yml` 을 만든다 (SC004, R-DEPLOY).

## Scope
- `.github/workflows/deploy.yml` (main push + workflow_dispatch)
- `.github/workflows/check.yml` (`content/initial` push 와 그 대상 PR)
- owner 1회 수동 설정 절차 (Pages source, secret, environment branch 제한) — test.md 에 기록

## Spec Reference

### Primary Sources
- `docs/specification/06-requirements.md#r-deploy-배포` — trigger, CI 구성, permissions, concurrency, 10분 목표
- `docs/specification/04-interfaces.md#외부-interface` — Pages·Actions
- `docs/specification/05-user-flows.md#uf-5-배포`
- `docs/tech-stack.md` — `.github/workflows/`

### Summary
withastro/action 을 쓰지 않고 step 을 직접 구성한다: checkout → setup-node(`.nvmrc`) → `npm ci --ignore-scripts` → `npm run build` → `npm run guard`(secret env 는 이 step 에만) → `actions/upload-pages-artifact` → `actions/deploy-pages`. permissions 는 contents: read, pages: write, id-token: write 로 최소화하고 action 버전을 고정하며 concurrency group 으로 배포 중복을 막는다. 가드 실패 시 artifact 가 없으므로 배포되지 않는다.

### Out of Scope (from spec)
- 가드 script 자체 — `yk-000001-030-infra-public-guard`
- 첫 공개(content 병합) — `yk-000005-030-test-first-release-gate`
- 별도 실패 알림 채널 (GitHub 기본 email 로 충분)

## Criticality

`critical` — spec 에 Critical Surfaces 선언은 없다. secret `GUARD_SENSITIVE_WORDS` 를 step env 로 전달하는 surface 이므로 keyword heuristic(`secret`)으로 추론했다. 오판이면 owner 가 `normal` 로 낮출 수 있다.

## Dependencies

### Depends On
- `yk-000001-030-infra-public-guard` — `npm run guard` 와 env `GUARD_SENSITIVE_WORDS` contract

### Depended By
- (None — Phase yk-000002 이후 task 는 phase gate 로만 의존)

## Key Files
- `.github/workflows/deploy.yml`
- `.github/workflows/check.yml`

## Notes
- **Base branch: `main`** (R-RELEASE — 첫 공개 전 main 에는 scaffold·공개 가드·배포 workflow·최소 홈만 둔다).
- **수동 1회 설정 (owner)**: (1) repo Settings → Pages → Source 를 GitHub Actions 로, (2) secret `GUARD_SENSITIVE_WORDS` 등록 — 값은 owner 로컬의 `guard-words.local.txt` 내용 그대로 (예: `gh secret set GUARD_SENSITIVE_WORDS < guard-words.local.txt`). 단어를 task 문서·commit·log 에 쓰지 않는다, (3) `github-pages` environment 의 deployment branch 를 `main` 으로 제한.
- secret 은 guard step 의 `env` 로만 전달하고 install·build step 에는 노출하지 않는다. `set -x` 금지.
- 이 task 병합 후 main 배포는 최소 홈만 공개한다 (R-RELEASE 허용 범위). 병합 직후 owner 가 main 에서 `content/initial` branch 를 만든다 — Phase yk-000002 의 시작 조건.
- action 은 commit SHA 또는 정확한 major tag 로 고정한다.

## Parallel Execution Metadata

- Model Hint: opus — M1 (`Criticality: critical`)

### Ownership
- `.github/workflows/deploy.yml`
- `.github/workflows/check.yml`

### Owned Interface
- workflow trigger: main push·workflow_dispatch → 배포, `content/initial` push·PR → build+guard 만

### Shared Surfaces
- CI config: `.github/workflows/**`
- GitHub repo 설정: Pages source, secret, environment

### Conflicts With
- (None identified)

### Parallelizable After
- yk-000001-030-infra-public-guard

### Task Verify
- (GitHub Actions) main 병합 후 deploy run 이 build → guard → deploy 순서로 성공
- (GitHub Actions) run 시작부터 배포 완료까지 10분 이내
- `curl -sf https://yongwoon.github.io/develop-with-llm-guide/ -o /dev/null`

## Out of Scope
- withastro/action 사용
- Slack 등 알림
- content 작성
