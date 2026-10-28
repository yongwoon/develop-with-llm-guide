# yk-000001-040-infra-github-actions-deploy — Implementation Checklist

## Prerequisites
- [ ] `yk-000001-030-infra-public-guard` 병합 완료
- [ ] owner 가 수동 1회 설정 (1)~(3) 을 완료했거나 이 task 와 함께 진행한다

## Allowed Edit Scope
- [ ] `README.md` 의 Ownership 안에서만 수정한다: `.github/workflows/deploy.yml`; `.github/workflows/check.yml`
- [ ] Ownership 밖의 수정이 필요하면 진행하지 말고 먼저 보고한다

## Stop Conditions
- [ ] 선행 task 가 실제로 병합되지 않았거나 그 산출 contract 가 없으면 멈추고 보고한다
- [ ] 다른 task 의 Ownership 으로 수정이 번지면 멈추고 보고한다
- [ ] 공유 contract(schema, component props, astro.config, package.json)를 Scope 이상으로 바꿔야 하면 멈추고 보고한다
- [ ] 진행 중인 다른 task 가 이미 같은 surface 를 소유하고 있으면 멈추고 보고한다
- [ ] Pages environment branch 제한이나 secret 등록 권한이 없으면 멈추고 owner 에게 보고한다

## Implementation Steps
- [ ] `deploy.yml`
  - [ ] trigger: `push: branches: [main]`, `workflow_dispatch`
  - [ ] permissions: `contents: read`, `pages: write`, `id-token: write`; `concurrency: { group: pages, cancel-in-progress: false }`
  - [ ] build job: checkout → setup-node(`node-version-file: .nvmrc`, npm cache) → `npm ci --ignore-scripts` → `npm run build` → `npm run guard` (env `GUARD_SENSITIVE_WORDS: ${{ secrets.GUARD_SENSITIVE_WORDS }}` 를 이 step 에만) → `actions/upload-pages-artifact` (`path: dist`)
  - [ ] deploy job: `environment: github-pages`, `actions/deploy-pages`
- [ ] `check.yml`
  - [ ] trigger: `push: branches: [content/initial]`, `pull_request: branches: [content/initial]`
  - [ ] install → build → guard (secret 은 guard step env 에만). upload·deploy 없음
  - [ ] fork PR 에서 secret 이 없으면 fail-closed 로 실패함을 Notes 로 남긴다 (owner 1인 저장소이므로 허용)
- [ ] 수동 설정과 확인
  - [ ] Notes 의 (1)~(3) 을 owner 가 수행
  - [ ] main 병합 후 Actions run 시간과 배포 URL 확인
  - [ ] `content/initial` branch 생성 (owner)

## Acceptance Coverage
Covers: SC004, R-DEPLOY (trigger·CI 구성·permissions·10분·실패 시 미배포), F-DEPLOY, UF-5

<!-- Write portable commands: see references/execution-convention.md#task-verify-portability -->
## Task Verify
- [ ] (GitHub Actions) main 병합 후 deploy run 이 build → guard → deploy 순서로 성공
- [ ] (GitHub Actions) run 시작부터 배포 완료까지 10분 이내
- [ ] `curl -sf https://yongwoon.github.io/develop-with-llm-guide/ -o /dev/null`

## Verification
- [ ] build 성공 (`npm run build`)
- [ ] 공개 가드 통과 (`npm run guard`)
- [ ] lint / typecheck: N/A — spec·tech-stack 이 정의한 npm script 가 없다

## Implementation Notes (optional)
