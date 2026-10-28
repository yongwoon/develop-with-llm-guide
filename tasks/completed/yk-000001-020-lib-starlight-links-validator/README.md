# yk-000001-020-lib-starlight-links-validator

## Purpose
`starlight-links-validator` plugin 을 도입해 깨진 내부 link 와 anchor(`#options` 포함)를 build 시 실패로 만든다. library 도입 safety invariant 에 따라 단독 task 로 둔다.

## Scope
- `starlight-links-validator` 설치 (Starlight 0.42.7 호환 버전, lockfile 고정)
- `astro.config.mjs` 의 starlight `plugins` 에 등록
- 의도적으로 깨진 link 로 build 실패를 1회 확인 후 되돌린다

## Spec Reference

### Primary Sources
- `docs/tech-stack.md#extras` — plugin 지정
- `docs/specification/04-interfaces.md#url-구조` — 링크 규칙
- `docs/specification/06-requirements.md#r-content-내용-품질` — 깨진 내부 link 0건

### Summary
깨진 내부 link 0건(R-CONTENT)을 build 단계에서 강제하기 위한 plugin 이다. SkillLink 의 `#options` anchor 검증도 이 plugin 에 기대므로, component·content 작업 전에 도입한다. base path 를 포함한 절대 경로 link 가 정상으로 인식되는지 확인한다.

### Out of Scope (from spec)
- SkillLink component 자체 — `yk-000002-030-ui-skill-components`
- 공개 가드 — `yk-000001-030-infra-public-guard`

## Criticality

`normal` — build 검사 plugin

## Dependencies

### Depends On
- `yk-000001-010-lib-astro-starlight-scaffold` — `package.json`, `astro.config.mjs`

### Depended By
- `yk-000001-030-infra-public-guard` — lockfile 순서 (병렬 시 `package-lock.json` 충돌 방지)
- `yk-000002-030-ui-skill-components` — SkillLink `#options` anchor 검증

## Key Files
- `package.json`, `package-lock.json`
- `astro.config.mjs`

## Notes
- **Base branch: `main`** (R-RELEASE — 첫 공개 전 main 에는 scaffold·공개 가드·배포 workflow·최소 홈만 둔다).
- plugin 버전이 Starlight 0.42.7 peer 범위를 만족하는지 확인한다. 맞는 버전이 없으면 멈추고 보고한다.
- 확인용으로 넣은 깨진 link 는 commit 하지 않는다.

## Parallel Execution Metadata

- Model Hint: sonnet — M3 (`Owned Interface` 없음)

### Ownership
- `package.json` (dependencies 항목)
- `package-lock.json`
- `astro.config.mjs` (`plugins` 항목)

### Owned Interface
- (None — no public interface owned)

### Shared Surfaces
- Workspace config: `package.json`, `package-lock.json`
- Build config: `astro.config.mjs`

### Conflicts With
- `yk-000001-010-lib-astro-starlight-scaffold` — 같은 config file
- `yk-000001-030-infra-public-guard` — `package.json`·lockfile

### Parallelizable After
- yk-000001-010-lib-astro-starlight-scaffold

### Task Verify
- `npm ci --ignore-scripts`
- `npm run build`

## Out of Scope
- 다른 plugin 도입
- link 작성 규칙 문서화
