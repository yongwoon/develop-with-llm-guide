# yk-000003-030-ui-skill-pages-review — Manual Test Plan

## Preconditions
- [ ] `npm run build && npm run preview`

## Test Scenarios

### Scenario 1: skill page 표시
**Steps:**
1. 이 task 의 page 3개를 골라 375px·1280px 로 연다

**Expected Result:**
- SkillCard·사용 case·Options 표·VerifiedStamp 가 순서대로 보인다
- `#options` 로 직접 접근하면 option 표로 이동
- 375px 에서 가로 scroll 0

### Scenario 2: Tabs 와 copy
**Steps:**
1. Codex tab 선택 후 다른 page 로 이동
2. 호출 명령 copy

**Expected Result:**
- 다른 page 에서도 Codex tab 유지
- 복사 문자열이 `$ywc-…` 로 표시와 같고 › 가 없다

### Scenario 3: Skill 색인 반영
**Steps:**
1. `/develop-with-llm-guide/skills/` 열기

**Expected Result:**
- 이 task 의 skill 이 색인에 나타나고 option 수가 표와 같다

### Scenario 4: review checklist (사람)
**Steps:**
1. page 마다 CN004 금지 서술·원문 문장 유사 여부·가상 사례 값을 확인

**Expected Result:**
- 위반 0건
