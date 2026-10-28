# yk-000005-030-test-first-release-gate — Implementation Checklist

## Prerequisites
- [ ] `yk-000005-010-ui-skill-crosslinks-plan-to-review`, `yk-000005-020-ui-skill-crosslinks-test-to-meta` 병합 완료 (`content/initial`)

## Allowed Edit Scope
- [ ] `README.md` 의 Ownership 안에서만 수정한다: `docs/measurements/first-release.md`; `src/content/docs/**` 의 frontmatter `description` 과 소제목 (검색 보강 범위만)
- [ ] Ownership 밖의 수정이 필요하면 진행하지 말고 먼저 보고한다

## Stop Conditions
- [ ] 선행 task 가 실제로 병합되지 않았거나 그 산출 contract 가 없으면 멈추고 보고한다
- [ ] 다른 task 의 Ownership 으로 수정이 번지면 멈추고 보고한다
- [ ] 공유 contract(schema, component props, astro.config, package.json)를 Scope 이상으로 바꿔야 하면 멈추고 보고한다
- [ ] 진행 중인 다른 task 가 이미 같은 surface 를 소유하고 있으면 멈추고 보고한다
- [ ] 첫 검색 전송량이 1 MB 를 넘으면 (OQ-04) 측정값을 기록하고 멈춰 owner 결정을 요청한다
- [ ] IME 조합 중 Enter 로 문자 손실이 있으면 기록하고 멈춰 별도 task(검색 UI override)를 제안한다
- [ ] fresh-check 가 exit 0 이 아니면 병합하지 않는다

## Implementation Steps
- [ ] 정적 검사
  - [ ] page 수 86, skill 63, 색인 63행 확인
  - [ ] `npm run fresh-check` exit 0
  - [ ] `npm run build && npm run guard`
- [ ] R-SEARCH (preview)
  - [ ] 12개 query 상위 3개 결과 기록, 미적중 page 의 description·소제목 보강 후 재측정
  - [ ] DevTools 로 첫 검색 전송량(pagefind.js, wasm, pf_meta, 첫 pf_index/pf_fragment) 합계와 색인 page 수 기록
  - [ ] macOS Chrome·Safari, iOS Safari 에서 IME 조합 중 Enter 확인
  - [ ] 로딩 중·실패·JS 비활성 표시 확인
- [ ] R-UX (preview)
  - [ ] Lighthouse mobile: 홈, 흐름 10, `ywc-mission`
  - [ ] 375px 가로 scroll 0 (대표 page + Skill 색인 카드 목록)
  - [ ] keyboard: 검색, tab 전환, theme 전환, copy, drawer (Escape·focus 복귀)
- [ ] 기록과 공개
  - [ ] `docs/measurements/first-release.md` 에 결과 표 작성
  - [ ] owner 승인 후 `content/initial` → main 병합, deploy run 성공 확인
  - [ ] 배포 URL 에서 Lighthouse 1회 재측정 후 기록 추가 (공개 후 변경은 feature branch → main)

## Acceptance Coverage
Covers: R-RELEASE (첫 공개 조건), R-SEARCH (전 항목), R-UX (Lighthouse·반응형·keyboard), R-CONTENT (page 수·색인 63행), R-FRESH (차이 0건), SC001, SC003, SC004, UF-1, UF-3, UF-3b

<!-- Write portable commands: see references/execution-convention.md#task-verify-portability -->
## Task Verify
- [ ] `npm run build`
- [ ] `npm run guard`
- [ ] `npm run fresh-check`
- [ ] `ls src/content/docs/skills/*.mdx | grep -v '/index.mdx' | wc -l (= 63)`
- [ ] `find src/content/docs -name '*.mdx' | wc -l (= 86)`
- [ ] (preview 에서 R-SEARCH 12/12, Lighthouse 3 page 목표 통과 — `docs/measurements/first-release.md` 기록)

## Verification
- [ ] build 성공 (`npm run build`)
- [ ] 공개 가드 통과 (`npm run guard`)
- [ ] lint / typecheck: N/A — spec·tech-stack 이 정의한 npm script 가 없다
- [ ] fresh-check 통과 (`npm run fresh-check` exit 0)

## Implementation Notes (optional)
