# yk-000004-030-ui-agent-getting-started-pages — Manual Test Plan

## Preconditions
- [ ] `npm run build && npm run preview`

## Test Scenarios

### Scenario 1: 홈 → 흐름 → skill
**Steps:**
1. 홈에서 "PR review 대응과 merge" 클릭
2. 단계 skill 클릭

**Expected Result:**
- 2 클릭으로 skill `#options` 도달 (SC003)

### Scenario 2: agent 표
**Steps:**
1. `/develop-with-llm-guide/agents/advisors/` 열기

**Expected Result:**
- read-only agent 표, 도구 표시, dispatch 방식 서술 없음

### Scenario 3: 설치 page
**Steps:**
1. 설치 page 전문 확인

**Expected Result:**
- 저장소 URL·clone 명령·인증 정보 없음
