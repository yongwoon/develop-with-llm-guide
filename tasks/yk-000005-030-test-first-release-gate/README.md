# yk-000005-030-test-first-release-gate

## Purpose
첫 공개 조건(R-RELEASE)을 측정·기록하고 통과하면 `content/initial` 을 main 에 병합해 첫 공개한다.

## Scope
- page 수 확인: 86 (skill 63 + 색인 1 + 흐름 16 + agent 3 + guide 3), Skill 색인 63행
- `npm run fresh-check` exit 0
- R-SEARCH: query 12개 상위 3개 적중, Pagefind 색인 86 page 이상, 첫 검색 전송량 1 MB 이하, 한국어 IME 조합 중 Enter 손실 0 (macOS Chrome·Safari 최신, iOS Safari), 검색 상태 표시
- R-UX: 로컬 `npm run preview` 에서 mobile preset Lighthouse (홈, 흐름 10, `ywc-mission`) A11y ≥95·Perf ≥90·SEO ≥90, 375px 가로 scroll 0, keyboard 조작
- 결과를 `docs/measurements/first-release.md` 에 기록
- 검색 미적중 시 해당 page 의 description·소제목 보강 후 재측정
- 통과 후 `content/initial` → main 병합 (owner 승인), 배포 URL 에서 Lighthouse 1회 재측정 기록

## Spec Reference

### Primary Sources
- `docs/specification/06-requirements.md#r-release-증분-작성과-첫-공개-oq-16-결정`
- `docs/specification/06-requirements.md#r-search-한국어-검색-실측`
- `docs/specification/06-requirements.md#r-ux-화면과-접근성`
- `docs/specification/06-requirements.md#r-content-내용-품질`
- `docs/specification/05-user-flows.md` — UF-1, UF-2, UF-3, UF-3b
- `docs/research/2026-10-28-static-site-framework.md` — Pagefind #1211, #1283

### Summary
측정은 build 후 로컬 preview 에서 한다(dev 서버에서는 Pagefind 가 동작하지 않고, Pages 는 main 에서만 배포되므로). 미달 항목은 원인을 기록하고, description 보강으로 해결할 수 있는 검색 미적중만 이 task 에서 고친다. index 1 MB 초과(OQ-04)나 IME 손실처럼 설계 결정이 필요한 경우는 멈추고 보고한다.

### Out of Scope (from spec)
- OQ-04 대응 결정 (실측 후 owner 결정)
- 검색 UI override (IME 문제 시 별도 task)

## Criticality

`normal` — 측정과 병합. 병합 직전 공개 가드가 CI 에서 다시 실행된다

## Dependencies

### Depends On
- `yk-000005-010-ui-skill-crosslinks-plan-to-review`, `yk-000005-020-ui-skill-crosslinks-test-to-meta` — 2차 pass 완료
- `yk-000004-030-ui-agent-getting-started-pages` — 86 page (Phase yk-000004)

### Depended By
- (None — 마지막 task)

## Key Files
- `docs/measurements/first-release.md`
- 검색 미적중 시 해당 page frontmatter `description`·소제목

## Notes
- **Base branch: `content/initial`** (R-RELEASE). task branch 는 `content/initial` 에서 만들고 `content/initial` 로 병합한다. main 에 직접 병합하지 않는다. 측정 통과 후 이 task 의 마지막 단계에서 `content/initial` 을 main 에 병합한다 (owner 승인 필요, main 병합 = 배포).
- 측정 기록에 로컬 절대 경로·민감 단어·스크린샷 속 개인 정보를 넣지 않는다 (`docs/` 도 민감 단어 검사 대상).
- Lighthouse 는 Chrome DevTools 의 mobile preset 으로 측정하고 점수와 측정일만 기록한다.
- page 수 검사는 build 에 넣지 않고 이 task 에서 명령으로만 확인한다.

## Parallel Execution Metadata

- Model Hint: sonnet — M3 (`Ownership` 에 content page 포함)

### Ownership
- `docs/measurements/first-release.md`
- `src/content/docs/**` 의 frontmatter `description` 과 소제목 (검색 보강 범위만)

### Owned Interface
- (None — no public interface owned)

### Shared Surfaces
- `main` branch (첫 공개 병합)
- GitHub Pages 배포

### Conflicts With
- Phase yk-000005 의 다른 task — 병합 전 완료 필요 (의존 순서로 해소)

### Parallelizable After
- yk-000005-010-ui-skill-crosslinks-plan-to-review
- yk-000005-020-ui-skill-crosslinks-test-to-meta

### Task Verify
- `npm run build`
- `npm run guard`
- `npm run fresh-check`
- `ls src/content/docs/skills/*.mdx | grep -v '/index.mdx' | wc -l (= 63)`
- `find src/content/docs -name '*.mdx' | wc -l (= 86)`
- (preview 에서 R-SEARCH 12/12, Lighthouse 3 page 목표 통과 — `docs/measurements/first-release.md` 기록)

## Out of Scope
- 새 page 추가
- component 수정
- OQ-04 결정
