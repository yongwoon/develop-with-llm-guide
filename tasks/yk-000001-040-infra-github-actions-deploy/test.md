# yk-000001-040-infra-github-actions-deploy — Manual Test Plan

## Preconditions
- [ ] 수동 설정 (1)~(3) 완료

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
1. 임시 branch 에서 `workflow_dispatch` 로 secret 이 빈 상태를 재현하거나 가상 금지 문자열을 넣은 commit 으로 check.yml 실행

**Expected Result:**
- guard step 실패, artifact 미생성
- log 에 일치 문자열이 없다

### Scenario 3: content/initial 검사
**Steps:**
1. `content/initial` 에 push

**Expected Result:**
- check.yml 이 build + guard 만 실행하고 배포하지 않는다
