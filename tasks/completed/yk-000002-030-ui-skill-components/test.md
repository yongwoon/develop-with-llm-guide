# yk-000002-030-ui-skill-components — Manual Test Plan

## Preconditions
- [ ] 임시 skill page 2개를 만든 상태에서 `npm run build && npm run preview` (확인 후 삭제)

## Test Scenarios

### Scenario 1: OptionTable·SkillCard
**Steps:**
1. 임시 skill page 를 375px 와 1280px 로 연다

**Expected Result:**
- 375px 에서 option 행이 카드로 쌓인다
- ●/– 를 screen reader 텍스트로 읽을 수 있다
- 빈 기본값은 `—`

### Scenario 2: SkillIndex
**Steps:**
1. `/develop-with-llm-guide/skills/` 열기
2. 분류 필터 변경
3. skill 이름 클릭

**Expected Result:**
- 이름순 표시, 필터 동작
- 클릭 시 해당 page `#options` 로 이동
- 375px 카드 목록

### Scenario 3: 검색 상태
**Steps:**
1. JS 비활성 후 header 확인
2. DevTools 로 pagefind 요청 차단 후 검색

**Expected Result:**
- JS 비활성 시 Skill 색인 link
- 실패 안내 문구 표시

### Scenario 4: 존재 검증
**Steps:**
1. 없는 skill 이름의 SkillLink 를 임시로 넣고 build

**Expected Result:**
- build 실패
