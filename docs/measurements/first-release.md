# 첫 공개 측정 기록 (R-RELEASE)

- 측정일: 2026-10-28
- 대상: `content/initial` (task `yk-000005-030-test-first-release-gate` branch, `pnpm run build` 후 `pnpm run preview`)
- 측정 도구: Chrome DevTools (MCP), Pagefind JS API, 정적 명령
- 범위 결정 (owner, 2026-10-28): 이 task 는 측정·기록까지만 한다. `content/initial` → main 병합과 배포 URL 재측정은 owner 승인 후 별도로 진행한다. 실제 IME 입력이 필요한 항목은 owner 수동 점검으로 남긴다.

## 요약

**판정: 첫 공개 gate 미충족 (대기 2건).** IME 조합 중 Enter 점검과 Lighthouse Performance 점수 확인이 남아 있다. 나머지 측정 항목은 모두 통과했다.

| 조건 | 결과 |
|---|---|
| 86 page 작성 | 통과 |
| R-FRESH (`pnpm run fresh-check`) | 통과 (차이 0건) |
| R-SEARCH 적중률 | 통과 (12/12, 보강 1건 후) |
| R-SEARCH 색인 page 수 | 통과 (86) |
| R-SEARCH 첫 검색 전송량 | 통과 (약 237 KB, 비압축) |
| R-SEARCH IME 조합 중 Enter | **owner 수동 점검 — 대기** (3 환경) |
| R-SEARCH 검색 상태 표시 | 통과 |
| R-UX Lighthouse A11y·SEO | 통과 (3 page 모두 100) |
| R-UX Lighthouse Performance | **점수 미측정 — owner 확인 필요** (lab 지표는 아래) |
| R-UX 375px 가로 scroll | 통과 |
| R-UX keyboard | 통과 |

## 정적 검사

| 항목 | 기대 | 결과 |
|---|---|---|
| `src/content/docs` 의 `.mdx` 수 | 86 | 86 |
| build 가 만든 HTML page 수 | — | 87 (86 page + Starlight 기본 404 page, 404 는 검색 색인 대상 아님) |
| skill page 수 (`skills/` 의 index 제외) | 63 | 63 |
| Skill 색인 행 수 | 63 | 63 |
| `pnpm run build` | 성공 | 성공 |
| `pnpm run guard` | 통과 | 통과 |
| `pnpm run fresh-check` | exit 0 | exit 0 |

## R-SEARCH

### 적중률

Pagefind JS API(`search()` 결과 순위)로 측정했다. 사이트 검색 UI 와 같은 index 와 순위를 쓴다.

| Query | 상위 3개 | 판정 |
|---|---|---|
| ywc-plan | skills/ywc-plan, flows/small-change, skills/ywc-spec-ready | 적중 |
| handle-pr | skills/ywc-handle-pr-reviews, flows/pr-review-merge, skills/ywc-resolve-conflict | 적중 |
| 커밋 | skills/ywc-commit, flows/small-change, skills/ywc-changelog-release-notes | 적중 |
| 리뷰 대응 | flows/pr-review-merge, skills/ywc-impl-review, skills/ywc-receive-review | 적중 |
| 병렬 | flows/local-parallel, skills/ywc-team-assemble, skills/ywc-task-executor | 적중 |
| 테스트시트 | skills/ywc-gen-testcase, flows/testing-verification, skills/ywc-e2e-test-strategy | 적중 |
| 인프라 | flows/infra-cloud, skills/ywc-infra-design, skills/ywc-infra-review | 적중 |
| 장애 | flows/debug-postmortem, skills/ywc-incident-postmortem, skills/ywc-debug-rootcause | 적중 |
| 새 프로젝트 | flows/new-project | 적중 |
| 용어집 | skills/ywc-ubiquitous-language, flows/onboarding-existing-repo, skills/ywc-project-docs | 적중 |
| --local-merge | skills/ywc-sequential-executor, flows/large-feature, skills/ywc-finish-branch | 적중 (보강 후) |
| --from-pr | skills/ywc-spec-writer | 적중 |

- 1차 측정에서 `--local-merge` 의 상위 3개는 flows/large-feature, skills/ywc-finish-branch, skills/ywc-task-executor 였다 (미적중).
- 보강: `ywc-sequential-executor` page 의 description 과 사용 case 소제목에 `--local-merge` 를 넣었다. 재측정에서 1위가 되었다.
- 검색 UI 로도 "리뷰 대응" 을 입력해 첫 결과가 흐름 "PR review 대응과 merge" 인 것을 확인했다.

### 색인과 전송량

| 항목 | 목표 | 결과 |
|---|---|---|
| Pagefind 색인 page 수 | 86 이상 | 86 (`pagefind-entry.json` 의 page_count, fragment 86개) |
| 첫 검색 전송량 | 1 MB 이하 | 242,569 B (약 237 KB) |

첫 검색("리뷰 대응", 빈 cache 의 isolated context)에서 받은 file 과 크기:

| file | byte |
|---|---|
| pagefind.js | 45,555 |
| pagefind-worker.js | 41,255 |
| pagefind-entry.json | 172 |
| pf_meta | 780 |
| wasm | 68,199 |
| pf_index (1개) | 76,967 |
| pf_fragment (5개) | 9,641 |
| 합계 | 242,569 |

- 로컬 preview 는 압축 없이 전송하므로 file 크기를 전송량으로 썼다. 배포 환경에서 압축이 적용되면 더 작아진다.
- 검색 UI 의 script·style 은 정의(pagefind.js, wasm, pf_meta, 첫 pf_index / pf_fragment)에 들지 않아 합계에서 뺐다.
- `pagefind-worker.js` 와 `pagefind-entry.json` 은 정의에 없지만 첫 검색에 함께 받으므로 합계에 넣었다. 빼면 201,142 B 다.

### 한국어 입력 조합 중 Enter (Pagefind #1283)

| 환경 | 결과 |
|---|---|
| macOS Chrome 최신 | owner 수동 점검 — 대기 |
| macOS Safari 최신 | owner 수동 점검 — 대기 |
| iOS Safari | owner 수동 점검 — 대기 |

- 자동화 도구의 합성 key 입력은 실제 IME 조합을 재현하지 못하므로 통과 근거로 쓰지 않았다.
- 점검 방법: 검색창에 "병렬" 을 입력하되, "렬" 의 받침까지 친 직후(조합 중, 밑줄이 보이는 상태) Enter 를 누른다. 검색어가 "병렬" 그대로 남고 결과가 나오면 통과, "병" 만 남거나 글자가 사라지면 손실이다. "리뷰 대응" 으로 한 번 더 확인한다.
- 손실이 있으면 기록하고 검색 UI override 를 별도 task 로 만든다 (이 task 범위 밖).

### 검색 상태 표시

| 항목 | 결과 |
|---|---|
| JS 비활성 시 Skill 색인 link | 있음 (`<noscript>` 안의 Skill 색인 link) |
| 로딩 실패 안내 | 있음. pagefind 요청을 실패시킨 상태에서 검색을 열면 "검색을 불러오지 못했습니다. Skill 색인에서 찾아 주세요." 가 표시됨 |
| index 로딩 중 표시 | 있음 ("검색 index 를 불러오는 중입니다…" 를 표시하고, 불러오면 숨김) |

## R-UX

### Lighthouse (mobile preset, preview)

| page | Accessibility | Best Practices | SEO | Performance |
|---|---|---|---|---|
| 홈 | 100 | 100 | 100 | 점수 미측정 |
| 흐름 10 (새 project 시작하기) | 100 | 100 | 100 | 점수 미측정 |
| `ywc-mission` | 100 | 100 | 100 | 점수 미측정 |

- 사용한 Lighthouse 도구는 Performance category 를 내지 않는다. 대신 같은 page 를 mobile 조건(CPU 4배 감속, Slow 4G, 빈 cache)으로 trace 했다.

| page | LCP | CLS |
|---|---|---|
| 홈 | 1,585 ms | 0.00 |
| 흐름 10 | 1,622 ms | 0.00 |
| `ywc-mission` | 1,606 ms | 0.00 |

- LCP 는 모두 2.5 s 이하, CLS 는 0 이다. 다만 Performance 점수 90 이상이라는 gate 는 점수로 확인하지 못했다.
- owner 확인 방법: `pnpm run build && pnpm run preview` 후 Chrome DevTools 의 Lighthouse panel 에서 Device 를 Mobile, category 에 Performance 를 넣고 홈, 흐름 10, `ywc-mission` 3 page 를 측정한다. 3 page 모두 90 이상이면 통과다.
- 90 미만이면 점수와 주요 감점 항목을 이 문서에 기록하고, 개선은 별도 task 로 만든다 (이 task 는 component·설정을 바꾸지 않는다).
- trace 의 개선 후보: render-blocking 요청(CSS·font) 정리. 이 task 는 component·설정을 바꾸지 않으므로 기록만 한다.

### 375px 가로 scroll

| page | 결과 |
|---|---|
| 홈, 흐름 10, 흐름 16, Skill 색인, `ywc-mission`, `ywc-sequential-executor`, 자문·리뷰 agent, 설치 | 모두 가로 scroll 0 |
| Skill 색인 | 표가 카드 목록으로 바뀜 (63개) |

### keyboard

| 조작 | 결과 |
|---|---|
| 검색 | ⌘K / Ctrl+K 로 열림, 입력창에 focus, Escape 로 닫힘 |
| tab 전환 | 도구 tab 에서 → 로 Claude Code → Codex 전환 |
| theme 전환 | native select 라 keyboard 로 선택 가능 |
| copy | code block 의 copy button 에 focus 가능 ("클립보드로 복사") |
| sidebar drawer (375px) | 메뉴 button 에서 Enter 로 열림, Escape 로 닫힘, 닫은 뒤 메뉴 button 으로 focus 복귀 |

## 남은 일 (owner)

1. IME 조합 중 Enter 점검 3 환경 (위 방법). 손실이 있으면 기록하고 검색 UI override task 를 만든다
2. Lighthouse Performance 점수 확인 (3 page, 위 방법). 90 미만이면 기록하고 개선 task 를 만든다
3. 위 두 항목 통과 후 `content/initial` → main 병합 승인, deploy run 성공 확인
4. 배포 URL 에서 Lighthouse 1회 재측정 후 이 문서에 추가
