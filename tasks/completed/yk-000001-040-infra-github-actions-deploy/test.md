# yk-000001-040-infra-github-actions-deploy — Manual Test Plan

## Preconditions
- [ ] 수동 설정 (1)~(3) 완료
  - (1) Pages source 를 GitHub Actions 로: `gh api -X POST repos/{owner}/{repo}/pages -f build_type=workflow` (Settings → Pages 에서도 가능)
  - (2) secret 등록: `gh secret set GUARD_SENSITIVE_WORDS < guard-words.local.txt`. 단어를 명령줄·문서·log 에 쓰지 않는다. 빈 값이면 CI guard 가 fail-closed 로 실패한다
  - (3) `github-pages` environment 의 deployment branch 를 `main` 으로 제한 (Settings → Environments → github-pages)
  - 확인: `gh api repos/{owner}/{repo}/pages --jq .build_type` 가 `workflow`, `gh secret list` 에 `GUARD_SENSITIVE_WORDS`, `gh api repos/{owner}/{repo}/environments/github-pages/deployment-branch-policies --jq '[.branch_policies[].name]'` 가 `["main"]`

## Test Scenarios

### Scenario 1: main 자동 배포
**Steps:**
1. 이 task 를 main 에 병합
2. Actions 탭에서 deploy run 확인

**Expected Result:**
- build → guard → upload → deploy 순으로 성공
- 10분 이내 완료
- base URL 에서 최소 홈 표시

### Scenario 2: 가드 실패 시 미배포
**Steps:**
1. 임시 branch 에서 `src/content/docs/index.mdx` 에 가상 금지 문자열(예: `/Users/fixture-user/x`)을 넣어 commit 한다
2. 그 branch 에서 `gh workflow run deploy.yml --ref <임시 branch>` 로 deploy workflow 를 수동 실행한다 (check.yml 은 `workflow_dispatch` trigger 가 없다)
3. 확인 후 임시 branch 와 commit 을 삭제한다

**Expected Result:**
- guard step 실패 (log 에는 `src/content/docs/index.mdx 1` 처럼 경로와 규칙 번호만), artifact 미생성, deploy job 미실행
- log 에 일치 문자열이 없다
- 임시 branch 는 environment 제한으로도 배포되지 않는다 (guard 를 통과해도 deploy job 이 거부된다)

### Scenario 3: content/initial 검사
**Steps:**
1. `content/initial` 에 push

**Expected Result:**
- check.yml 이 build + guard 만 실행하고 배포하지 않는다
