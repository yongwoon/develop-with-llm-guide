# yk-000001-010-lib-astro-starlight-scaffold — Manual Test Plan

## Preconditions
- [ ] `npm ci --ignore-scripts` 완료

## Test Scenarios

### Scenario 1: base path 아래 최소 홈
**Steps:**
1. `npm run build && npm run preview` 실행
2. `/develop-with-llm-guide/` 접속

**Expected Result:**
- 홈이 한국어 UI 로 표시된다
- `/` 가 아닌 base 경로에서만 정상 동작한다
- sidebar 에 시작하기 group 이 보인다
