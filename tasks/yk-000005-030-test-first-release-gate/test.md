# yk-000005-030-test-first-release-gate — Manual Test Plan

## Preconditions
- [ ] `pnpm run build && pnpm run preview`
- [ ] macOS Chrome·Safari 최신, iOS Safari 준비

## Test Scenarios

### Scenario 1: UF-1 이름 검색
**Steps:**
1. ⌘K → "handle-pr" 입력

**Expected Result:**
- 상위 3개에 `ywc-handle-pr-reviews`

### Scenario 2: UF-3 tab 동기화와 copy
**Steps:**
1. 흐름 page 에서 Codex tab 선택, 다른 page 이동, copy

**Expected Result:**
- Codex tab 유지, `$ywc-…` 복사, › 없음

### Scenario 3: UF-3b 색인
**Steps:**
1. Skill 색인에서 skill 클릭

**Expected Result:**
- 1 클릭으로 option 표

### Scenario 4: IME
**Steps:**
1. "리뷰 대응" 조합 중 Enter

**Expected Result:**
- 문자 손실 0
