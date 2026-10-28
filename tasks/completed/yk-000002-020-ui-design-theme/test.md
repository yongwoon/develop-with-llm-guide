# yk-000002-020-ui-design-theme — Manual Test Plan

## Preconditions
- [ ] `npm run build && npm run preview`

## Test Scenarios

### Scenario 1: theme
**Steps:**
1. OS dark 설정으로 첫 방문
2. header 에서 light 로 전환 후 새로고침

**Expected Result:**
- 첫 방문 dark
- 수동 선택 유지
- 본문·라벨 대비 AA (DevTools contrast)

### Scenario 2: 반응형
**Steps:**
1. 375px, 799px, 800px, 1152px 폭으로 홈 확인

**Expected Result:**
- 375px 가로 scroll 0
- 800px 미만 sidebar drawer, Escape 로 닫히고 여는 버튼으로 focus 복귀
- 1152px 이상 TOC 표시

### Scenario 3: code block
**Steps:**
1. 홈에 임시 code block 을 넣고 copy 버튼 확인 (확인 후 제거)

**Expected Result:**
- copy 버튼 동작, keyboard 로 접근 가능
