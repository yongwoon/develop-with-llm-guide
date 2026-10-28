# 첫 공개 측정 기록 (R-RELEASE)

- 측정일: 2026-10-28
- 대상: `content/initial` (task `yk-000005-030-test-first-release-gate` branch, `pnpm run build` 후 `pnpm run preview`)
- 측정 도구: Chrome DevTools (MCP), Pagefind JS API, 정적 명령
- 범위 결정 (owner, 2026-10-28): 이 task 는 측정·기록까지만 한다. `content/initial` → main 병합과 배포 URL 재측정은 owner 승인 후 별도로 진행한다. 실제 IME 입력이 필요한 항목은 owner 수동 점검으로 남긴다.

## 요약

**판정: 첫 공개 gate 충족 (2026-10-29).** IME 조합 중 Enter 점검은 3 환경 모두 통과했다 (owner). Lighthouse Performance 는 글꼴 개선 후 3 page 모두 90 이상(95–98)이다. 나머지 측정 항목도 모두 통과했다. owner 승인으로 `content/initial` 을 main 에 병합한다.

| 조건 | 결과 |
|---|---|
| 86 page 작성 | 통과 |
| R-FRESH (`pnpm run fresh-check`) | 통과 (차이 0건) |
| R-SEARCH 적중률 | 통과 (12/12, 보강 1건 후) |
| R-SEARCH 색인 page 수 | 통과 (86) |
| R-SEARCH 첫 검색 전송량 | 통과 (약 237 KB, 비압축) |
| R-SEARCH IME 조합 중 Enter | 통과 (3 환경, owner) |
| R-SEARCH 검색 상태 표시 | 통과 |
| R-UX Lighthouse A11y·SEO | 통과 (3 page 모두 100) |
| R-UX Lighthouse Performance | 통과 (95–98, 글꼴 개선 후) |
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
| macOS Chrome 최신 | 통과 (owner, 2026-10-29: "병렬" 이 그대로 남고 결과가 나옴) |
| macOS Safari 최신 | 통과 (owner, 2026-10-29) |
| iOS Safari | 통과 (owner, 2026-10-29) |

- 자동화 도구의 합성 key 입력은 실제 IME 조합을 재현하지 못하므로 통과 근거로 쓰지 않았다.
- 점검 방법: 검색창에 "병렬" 을 입력하되, "렬" 의 받침까지 친 직후(조합 중, 밑줄이 보이는 상태) Enter 를 누른다. 검색어가 "병렬" 그대로 남고 결과가 나오면 통과, "병" 만 남거나 글자가 사라지면 손실이다. "리뷰 대응" 으로 한 번 더 확인한다.
- 손실이 있으면 기록하고 검색 UI override 를 별도 task 로 만든다 (이 task 범위 밖).

### 검색 상태 표시

| 항목 | 결과 |
|---|---|
| JS 비활성 시 Skill 색인 link | 있음 (`<noscript>` 안의 Skill 색인 link) |
| 로딩 실패 안내 | 있음. pagefind 요청을 실패시킨 상태에서 검색을 열면 "검색을 불러오지 못했습니다. 새로고침하거나 Skill 색인에서 찾아 주세요." 가 표시됨 |
| 검색 도중 index 실패 안내 | 있음 (2026-10-29 추가). 검색을 연 뒤 server 를 멈추고 검색하면, "결과가 없습니다" 와 함께 위 실패 안내가 표시됨. 다시 결과가 나오면 안내는 사라짐. 실제로 결과가 없는 검색어에는 안내가 표시되지 않음 |
| 검색 UI 문구 | 한국어 (2026-10-29 추가). 예: "병렬 검색 결과 11건", "zzqqxx 검색 결과가 없습니다", "지우기" |
| index 로딩 중 표시 | 있음 ("검색 index 를 불러오는 중입니다…" 를 표시하고, 불러오면 숨김) |

## R-UX

### Lighthouse (mobile preset, preview)

| page | Accessibility | Best Practices | SEO | Performance |
|---|---|---|---|---|
| 홈 | 100 | 100 | 100 | 98 |
| 흐름 10 (새 project 시작하기) | 100 | 100 | 100 | 95 |
| `ywc-mission` | 100 | 100 | 100 | 96 |

- A11y·BP·SEO 는 Chrome DevTools (MCP) 의 Lighthouse 로 쟀다. 이 도구는 Performance category 를 내지 않으므로, Performance 는 Lighthouse CLI 12.6.1 (`--form-factor=mobile`, 기본 throttling, headless Chrome) 로 따로 쟀다 (2026-10-29).

| page | Performance | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|
| 홈 | 83 | 3.3 s | 3.6 s | 0 ms | 0 |
| 흐름 10 | 82 | 2.0 s | 4.5 s | 0 ms | 0 |
| `ywc-mission` | 80 | 3.6 s | 3.9 s | 0 ms | 0 |

- 감점은 FCP·LCP 에서 온다. TBT 와 CLS 는 0 이다.
- 주요 감점 항목:
  - render-blocking 요청: 홈 약 2,260 ms, `ywc-mission` 약 2,110 ms, 흐름 10 약 450 ms 절감 가능. Pretendard dynamic-subset CSS (약 14 KB) 와 공통 CSS 가 첫 그리기를 막는다.
  - 글꼴: 한 page 에서 Pretendard subset file 을 12–20 개 (각 20–38 KB) 받고, DM Mono 를 2 개 받는다.
  - 흐름 10: DOM 1,091 요소.
  - 사용하지 않는 CSS 약 13 KB.
- 로컬 preview 는 압축 없이 전송한다. 배포 환경에서는 CSS 가 압축되지만, 글꼴(woff2)은 이미 압축된 형식이라 크게 줄지 않는다.
- 개선(글꼴 로딩 방식, render-blocking CSS)은 component·설정을 바꾸는 일이라 이 task 범위 밖이다. 별도 작업(`perf/font-loading` branch)으로 했다.

#### 글꼴 개선 후 재측정 (2026-10-29)

원인 확인: Pretendard 를 빼고 재면 3 page 모두 99 였다. 감점은 글꼴 전송량에서 왔다.

| 시도 | 홈 | 흐름 10 | `ywc-mission` | page 당 글꼴 |
|---|---|---|---|---|
| 개선 전 | 83 | 82 | 80 | 14–20 file, 360–476 KB |
| 글꼴 CSS 를 공통 CSS 에 합침 | 87 | 81 | 78 | 변화 없음 |
| 사이트 subset 1 file + dynamic subset fallback | 98 | 95 | 96 | 2–3 file, 153–168 KB |

- 사이트 subset (약 134 KB, 처음에는 `pretendard-site.woff2`, 이후 OFL Reserved Font Name 규정에 따라 DWLG Sans `dwlg-sans/dwlg-sans.woff2` 로 이름 변경) 은 원본과 build 결과에 쓰인 글자 655 개만 담는다 (`scripts/subset-font.mjs`). 굵기 축(variable)은 그대로다.
- 재측정에서 dynamic subset 은 하나도 받지 않았다. 모든 글자가 사이트 subset 에 들어 있다는 뜻이다.
- 개선 후 LCP 는 2.3–2.6 s, FCP 는 1.6–2.0 s, TBT·CLS 는 0 이다.
- 화면 확인: 흐름 10 에서 제목 weight 800, 본문, mono 표기가 정상으로 표시된다.
- 이전 trace (CPU 4배 감속, Slow 4G) 의 LCP 는 약 1.6 s 였다. Lighthouse 기본 throttling 은 그보다 느린 조건을 시뮬레이션하므로 값이 다르다.

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

1. ~~IME 조합 중 Enter 점검~~ 완료 (3 환경 통과)
2. ~~Lighthouse Performance 개선~~ 완료 (95–98)
3. `content/initial` → main 병합 승인 (owner, 2026-10-29), deploy run 성공 확인
4. 배포 URL 에서 Lighthouse 1회 재측정 후 이 문서에 추가
