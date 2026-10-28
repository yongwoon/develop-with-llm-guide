# yk-000002-040-ui-flow-components — Manual Test Plan

## Preconditions
- [ ] 임시 flow page 와 임시 skill page 를 만든 상태에서 `npm run build && npm run preview` (확인 후 삭제)

## Test Scenarios

### Scenario 1: 흐름 표시
**Steps:**
1. 375px 와 1280px 로 임시 flow page 열기

**Expected Result:**
- 표제란 2×2 → 4칸
- 선택 단계 점선 + 텍스트 대체
- skill 이름 클릭 시 `#options` 로 이동

### Scenario 2: 단계 수 불일치
**Steps:**
1. `titleBlock.steps` 를 FlowStep 수와 다르게 두고 build

**Expected Result:**
- build 실패
