# yk-000001-030-infra-public-guard — Manual Test Plan

## Preconditions
- [ ] `npm run build` 완료
- [ ] pre-push hook 등록: `git config core.hooksPath .githooks`

## Test Scenarios

### Scenario 1: 민감 단어 검출 (가상 단어)
**Steps:**
1. 임시 env 로 가상 단어를 주고 `src/content/docs/index.mdx` 에 같은 단어를 임시로 넣는다
2. `npm run build && npm run guard`

**Expected Result:**
- exit code 가 0 이 아니다
- 출력에 file 경로와 규칙 번호만 있고 단어 자체는 없다
- 임시 수정은 되돌린다

### Scenario 2: CI fail-closed
**Steps:**
1. `GITHUB_ACTIONS=true GUARD_SENSITIVE_WORDS= npm run guard`

**Expected Result:**
- 단어 0개로 실패한다

### Scenario 3: pre-push
**Steps:**
1. 가상 금지 문자열이 들어간 임시 commit 을 만들고 push 를 시도한다 (실제 push 전 hook 단계에서 확인)

**Expected Result:**
- hook 이 push 를 막는다
- 임시 commit 은 폐기한다
