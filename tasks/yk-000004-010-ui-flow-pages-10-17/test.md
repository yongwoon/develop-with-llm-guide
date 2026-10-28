# yk-000004-010-ui-flow-pages-10-17 — Manual Test Plan

## Preconditions
- [ ] `pnpm run build && pnpm run preview`

## Test Scenarios

### Scenario 1: 흐름 → skill
**Steps:**
1. 흐름 16 PR review 대응과 merge 열기
2. 단계의 skill 이름 클릭

**Expected Result:**
- 표제란 값이 FlowStep 수와 같다
- skill page `#options` 로 이동

### Scenario 2: 모바일
**Steps:**
1. 375px 로 흐름 10 열기

**Expected Result:**
- 가로 scroll 0, 선택 단계 점선과 텍스트 대체
