# yk-000001-020-lib-starlight-links-validator — Implementation Checklist

## Prerequisites
- [ ] `yk-000001-010-lib-astro-starlight-scaffold` 병합 완료

## Allowed Edit Scope
- [ ] `README.md` 의 Ownership 안에서만 수정한다: `package.json` (dependencies 항목); `package-lock.json`; `astro.config.mjs` (`plugins` 항목)
- [ ] Ownership 밖의 수정이 필요하면 진행하지 말고 먼저 보고한다

## Stop Conditions
- [ ] 선행 task 가 실제로 병합되지 않았거나 그 산출 contract 가 없으면 멈추고 보고한다
- [ ] 다른 task 의 Ownership 으로 수정이 번지면 멈추고 보고한다
- [ ] 공유 contract(schema, component props, astro.config, package.json)를 Scope 이상으로 바꿔야 하면 멈추고 보고한다
- [ ] 진행 중인 다른 task 가 이미 같은 surface 를 소유하고 있으면 멈추고 보고한다

## Implementation Steps
- [ ] plugin 설치
  - [ ] `npm install --save-dev starlight-links-validator` (호환 버전 확인)
  - [ ] `package-lock.json` 갱신
- [ ] 등록
  - [ ] `astro.config.mjs` 의 `starlight({ plugins: [starlightLinksValidator()] })`
  - [ ] base path 절대 link 가 오탐되지 않는지 확인
- [ ] 동작 확인
  - [ ] 홈에 존재하지 않는 내부 link 를 임시로 넣고 `npm run build` 가 실패하는지 확인
  - [ ] 임시 link 제거 후 build 성공 확인

## Acceptance Coverage
Covers: R-CONTENT (깨진 내부 link 0건), F-NAV (link 무결성)

<!-- Write portable commands: see references/execution-convention.md#task-verify-portability -->
## Task Verify
- [ ] `npm ci --ignore-scripts`
- [ ] `npm run build`

## Verification
- [ ] build 성공 (`npm run build`)
- [ ] lint / typecheck / unit test: N/A — spec·tech-stack 이 정의한 npm script 가 없다 (build·guard·fresh-check·dev·preview 만 정의)

## Implementation Notes (optional)
