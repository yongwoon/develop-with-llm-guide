# 06. Requirements

## R-DEPLOY: 배포

| 항목 | 목표 |
|---|---|
| trigger | main push 와 수동 실행은 build + 가드 + 배포. 통합 branch(`content/initial`)와 그 PR 은 build + 가드만 실행하고 배포하지 않는다 |
| push 부터 사이트 반영까지 | 10분 이내. Actions run 의 시작부터 Pages 배포 완료까지의 시간으로 잰다 |
| build 실패, 가드 실패 시 | 배포하지 않고 직전 배포를 유지 |
| runtime | Node.js 22.23.4 이상 (Astro 7.4.2 의 engines 요구). `.nvmrc` 와 `package.json` engines 로 고정한다 |
| 의존성 버전 | `@astrojs/starlight` 는 exact version 으로 고정한다. 2026-10-28 기준 최신은 0.42.7. 업그레이드는 별도 작업으로 다룬다. package manager 는 npm 이며 lockfile 기반으로 install 한다 |
| 실패 알림 | GitHub 기본 알림(email)으로 충분하다. 별도 알림 채널을 두지 않는다 |
| 오염 배포 rollback | 해당 commit 을 revert 하는 commit 을 main 에 push 한다 |

**CI 구성**

- withastro/action 은 쓰지 않고 step 을 직접 구성한다: install(lifecycle script 비활성) → build → 공개 가드 → Pages artifact upload → 배포. 가드가 실패하면 artifact 가 만들어지지 않으므로 배포되지 않고 직전 배포가 유지된다.
- 민감 단어 secret 은 가드 step 의 env 로만 전달한다. install 과 build step 에는 노출되지 않는다.
- permissions 는 최소로 둔다: contents: read, pages: write, id-token: write.
- 사용하는 action 은 버전을 고정한다. concurrency group 을 두어 배포가 겹치지 않게 한다.
- Pages environment 는 main 에서만 배포하도록 branch 를 제한한다.
- 1회 수동 설정: Pages source 를 GitHub Actions 로 지정, `GUARD_SENSITIVE_WORDS` secret 등록, environment 의 branch 제한.

## R-RELEASE: 증분 작성과 첫 공개 (OQ-16 결정)

- 콘텐츠 작성은 통합 branch `content/initial` 에서 진행한다. task 별 branch 는 이 통합 branch 로 병합하고, 첫 공개 때 통합 branch 를 main 에 병합한다. main 병합이 곧 배포다.
- 작성 순서: skill page → Skill 색인 → 흐름 page → agent·guide page.
- 미완성 skill page 는 만들지 않는다. SkillLink 는 content collection 에 실제로 있는 page 를 기준으로 검증한다.
- skill page 1차 작성에서는 아직 없는 page 를 가리키는 `next`, 본문 SkillLink, "쓰지 말아야 할 때"의 sibling link, "관련 흐름" 절을 넣지 않는다. 홈의 흐름 진입 목록은 흐름 page 작성 뒤에 쓴다. 63개가 모두 생긴 뒤 2차 pass 에서 채운다. 이렇게 하면 작성 중에도 build 가 통과한다.
- 첫 공개(출시) 조건: 86 page 전부 작성, R-SEARCH 실측 통과, preview 에서 R-UX 의 Lighthouse 목표 통과. 조건을 채운 뒤 통합 branch 를 main 에 병합한다.
- 첫 공개 전의 main 에는 scaffold, 공개 가드, 배포 workflow 까지만 둔다. 사이트는 최소 홈만 가진다.

## R-GUARD: 공개 가드 (CN001, NG001)

금지 문자열이 1건이라도 있으면 실패해야 한다.

| 검사 대상 | 범위 |
|---|---|
| build 산출물 | `dist/` 의 텍스트 file 전부: HTML, `_astro` 의 JS/CSS, sitemap 등 |
| 원본 tree, 민감 단어 | git 이 추적하는 file 전부. 로컬 pre-push 와 CI 에서 검사한다 |
| 원본 tree, 일반 패턴 | `src/`, `public/`, `.github/`. `docs/`, `tasks/`, `scripts/`(가드 test fixture 포함), `guard.config.json` 은 금지 패턴 자체를 규칙으로 서술하므로 일반 패턴 검사에서 제외한다. 민감 단어는 이들 file 에도 쓰지 않는다 |
| 제외 | `dist/pagefind/`. gzip 압축 file 이고 이미 검사한 HTML 에서 생성되므로 HTML 검사로 포괄된다 |

- email 형식 패턴은 HTML 에만 적용한다. 민감 단어는 검사 대상 텍스트 file 전체에 적용한다.

| 금지 대상 | 예 | 이유 |
|---|---|---|
| owner 의 로컬 절대 경로 | `/Users/` 로 시작하는 경로 | 로컬 환경 노출 |
| owner 의 개인 식별 정보 | email 형식 전체, 사내 domain | 개인정보·소속 노출 |
| 비공개 자료 경로 | 저장소명 접두 형태의 develop-with-llm 비공개 자료 경로 (예: `develop-with-llm/docs/…`, `develop-with-llm/prompts`). `docs/plans` 와 develop-with-llm 고유의 `.ywc-*` file 도 이 접두 규칙으로 포괄한다 | NG001 |
| 비공개 project 이름 | owner 가 금지 목록에 등록한 private project 이름 | 사례 작성 시 유출 방지 |

- **비공개 자료 경로의 범위 (OQ-15 결정)**: 저장소명 접두 형태만 금지한다. 맨 `prompts` 단어는 금지하지 않는다. skill 산출물로 표기되는 사용자 project 쪽 경로(예: research 산출 경로, learnings file)는 허용한다.
- **allowlist**: 규칙 번호별 허용 문자열 목록을 일반 패턴 설정 file 에 둔다 (예: Co-Authored-By 에 쓰는 공개 noreply 주소).
- **commit identity**: 이 저장소의 commit author email 은 GitHub noreply 주소를 쓴다. 저장소 local 설정으로 이미 적용했다.
- **설치 page**: private 저장소 URL, clone 명령, 인증 정보는 쓰지 않는다. 저장소명 접두 규칙이 이를 포괄한다.

금지 목록은 두 층으로 나눠 둔다 (OQ-03 결정, 2026-10-28).

| 층 | 대상 | 저장 위치 |
|---|---|---|
| 일반 패턴 | 로컬 절대 경로, email 형식 전체, develop-with-llm 비공개 자료 경로, 규칙별 allowlist | guide 저장소의 설정 file 1곳(`guard.config.json`). 노출되어도 무방한 내용만 둔다 |
| 민감 단어 | 회사 domain, 비공개 project 이름 등 단어 자체가 비공개인 것 | CI 는 GitHub Actions secret 에서 읽는다. 로컬은 git 추적 제외 file 에서 읽는다. 원문은 저장소에 두지 않는다 |

- 가드는 CI 와 로컬에서 같은 검사를 수행한다.
- 로컬 pre-push: 저장소의 `.githooks/pre-push` 를 `core.hooksPath` 로 등록한다. 순서는 build → 가드다. 등록은 clone 직후 1회 수동으로 한다.
- **fail-closed**: CI 여부는 환경 변수 `GITHUB_ACTIONS=true` 로 판별한다. CI 에서 민감 단어 secret 이 없거나, 값이 비었거나, 읽은 단어가 0개이면 가드를 실패시킨다. 경고만 출력하고 일반 패턴 검사를 계속하는 동작은 로컬 실행에만 허용한다.
- 실패 시 file 경로와 규칙 번호만 출력한다. 일치한 문자열 자체는 log 에 출력하지 않는다. 단어 목록을 log 에 출력하지 않으며, shell trace(`set -x`)를 쓰지 않는다.
- **단어 목록 형식**: UTF-8, 한 줄에 한 단어. 빈 줄과 `#` 주석 줄은 무시한다. CRLF 는 제거하고 NFC 로 정규화한다. 비교는 고정 문자열로, 대소문자를 구분하지 않는다.
- 민감 단어의 저장 위치 (OQ-03 결정, 2026-10-28)
  - 로컬: 저장소 root 의 `guard-words.local.txt` (한 줄에 한 단어, `.gitignore` 로 추적 제외)
  - CI: GitHub Actions secret `GUARD_SENSITIVE_WORDS` (같은 형식)
  - 대상 (OQ-07 결정: 단어 확정): 회사 domain 과 회사명, 작업 공간의 다른 private project 이름, owner 의 로컬 사용자 이름. 단어 원문은 이 문서에도 쓰지 않는다.

## R-SEARCH: 한국어 검색 실측

Pagefind 의 한국어 품질을 실측한 근거가 없으므로 (`docs/research/2026-10-28-static-site-framework.md`), 아래 query 세트를 통과해야 출시한다.

| Query | 기대 결과 (상위 3개 안) |
|---|---|
| ywc-plan | skill page `ywc-plan` |
| handle-pr | skill page `ywc-handle-pr-reviews` |
| 커밋 | skill page `ywc-commit` |
| 리뷰 대응 | 흐름 "PR review 대응과 merge" 또는 `ywc-handle-pr-reviews` |
| 병렬 | `ywc-parallel-executor` 또는 흐름 "로컬 환경과 병렬 작업" |
| 테스트시트 | `ywc-gen-testcase` |
| 인프라 | 흐름 "인프라·클라우드" |
| 장애 | 흐름 "디버깅과 장애 회고" 또는 `ywc-incident-postmortem` |
| 새 프로젝트 | 흐름 "새 project 시작하기" |
| 용어집 | `ywc-ubiquitous-language` |
| --local-merge | skill page `ywc-sequential-executor` 또는 `ywc-parallel-executor` |
| --from-pr | skill page `ywc-spec-writer` |

| 항목 | 목표 |
|---|---|
| 적중률 | 12개 query 중 12개 |
| 색인 page 수 | Pagefind 가 색인한 page 가 86개 이상 |
| 첫 검색 시 내려받는 index 크기 | 1 MB 이하 (Pagefind issue #1211 대응). 크기는 첫 검색에서 내려받는 pagefind.js, wasm, pf_meta, 첫 pf_index / pf_fragment 의 전송량 합계로 정의하고 DevTools 로 잰다. 초과하면 OQ-04 로 대응을 결정한다 |
| 한국어 입력 조합 중 Enter | 조합 중인 문자가 버려지지 않아야 한다 (Pagefind issue #1283). 확인 대상은 macOS Chrome·Safari 최신과 iOS Safari 이며, 모든 조합에서 Enter 시 입력 문자 손실 0 이 합격 기준이다. 문제가 있으면 검색 UI 를 override 하거나 우회 방법을 적용한다 |
| 검색 상태 표시 | index 로딩 중 표시, 로딩 실패 안내 문구, JS 비활성 시 Skill 색인 link 가 있다 |

- 측정 시점: 86 page 가 모두 작성된 뒤, 첫 공개 전에 실행한다 (R-RELEASE).
- 측정 환경: build 후 preview 에서 측정한다. dev 서버에서는 Pagefind 가 동작하지 않는다.
- 측정 방법: 수동이며, 결과는 `docs/` 에 기록한다.
- 적중률 미달 시: 해당 page 의 description 과 본문(소제목 포함)을 보강한 뒤 다시 측정한다.
- 작성 규칙: flow page 의 description 과 소제목에 한국어 상황어를 넣는다 (03-data Flow page).

## R-FRESH: 최신성 (SC002)

| 항목 | 목표 |
|---|---|
| skill 목록 일치 | 최신성 점검 결과 사이트와 develop-with-llm 의 skill 합집합 차이가 0건 |
| 사용 가능 도구 일치 | skill 별 tools 값이 실제 도구별 존재 여부와 100% 일치 |
| option 완전성 (SC005) | 모든 skill 을 자동 비교한다. 도구별로 skill page 의 `options` 와 `excludedOptions` 를 합친 집합이 `SKILL.md` Arguments 의 option 집합과 일치해야 한다. 누락 0건, 초과 0건 |
| Arguments 섹션 없음 | 최신성 점검이 오류로 보고한다. 2026-10-28 기준 0건이며, 새 skill 에서 생기면 develop-with-llm 쪽에서 섹션을 추가한다 |
| option 도구 표시 | 각 option 의 지원 도구 값이 도구별 `SKILL.md` 정의와 100% 일치 |
| userInvoked 일치 | skill 별 `userInvoked` 값이 도구별 출처 값(Claude Code `SKILL.md` frontmatter, Codex openai.yaml 정책 값)과 일치 |
| agent 일치 | agent 이름과 도구별 존재 여부가 agent page 표와 일치 |
| 표시 | Skill 색인 외 모든 page(Flow·Skill·Agent·Guide)에 `verifiedAt` 과 `sourceVersion` 이 있음 (build schema 로 강제) |
| stale 표시 | page 의 `sourceVersion` 이 현재 VERSION 과 다르면 보고서에 stale 로 표시 |

**option 비교 키 정규화**

- `## Arguments` 아래의 첫 표만 읽고, 다음 `##` 또는 `###` heading 에서 멈춘다. README 의 option 표는 비교 근거로 쓰지 않는다.
- Arguments 가 `N/A —` 로 시작하면 option 집합은 빈 집합이다.
- 표의 첫 열만 토큰화한다. backtick 안의 `|` 는 열 구분자로 보지 않는다. 구분선 행은 정렬 기호(`:`)를 포함할 수 있다.
- 첫 열의 backtick 안에 있는 `--flag` 토큰은 모두 비교 키다. alias 도 별도 키로 센다. `--flag <값>` 처럼 flag 와 같은 backtick 안에 있는 `<…>` 는 값 표기이므로 키로 세지 않는다.
- `<…>` 토큰은 `positional:<…>` 키로 센다.
- flag 도 `<…>` 도 없는 자연어 행(예: request (natural language))은 집합 비교에서 제외한다. 점검은 이런 행이 있는 skill 을 참고로 보여 주고, 사이트에서는 frontmatter `argsNote` 로 설명한다.
- 사이트 쪽 키는 `options[].name` 에 같은 규칙을 적용해 만든다. alias 는 `--a / --b` 처럼 한 name 에 함께 쓰고, 각 flag 를 별도 키로 센다.
- 비교는 이름 집합만 한다. 형식·기본값의 변경은 비교하지 않는다.
- 위임 문구 후보(Caller-only, passed by, alias)는 참고 경고로만 보여 준다. 제외 여부는 owner 가 `excludedOptions` 로 판정한다 (OQ-11 결정).

**점검 결과와 종료 코드**

| 상황 | 동작 |
|---|---|
| develop-with-llm 경로가 없거나 읽기 실패 | exit 2 |
| 차이 있음 | 차이 보고서 출력 후 exit 1 |
| 일치 | exit 0 |
| Arguments 파싱 실패 | 해당 skill 이름과 함께 오류로 보고한다 |

- 최신성 점검은 owner 로컬에서만 실행한다.
- 점검은 develop-with-llm 의 skill·agent 이름, 도구별 존재 여부, option 이름, userInvoked 값, VERSION 만 읽는다. 본문은 읽어서 저장하지 않으며, 결과를 저장소에 쓰지 않는다. 이렇게 하면 RA002 의 sync 에 해당하지 않는다 (OQ-05 결정).

## R-UX: 화면과 접근성

| 항목 | 목표 |
|---|---|
| 대비 | WCAG 2.2 AA. 본문과 라벨 4.5:1 이상 (design-system 의 token 대비표) |
| 반응형 | 375px 에서 page 가로 scroll 0. 긴 mono 토큰과 코드 블록은 해당 요소 내부의 가로 scroll 을 허용한다. Skill 색인은 카드 목록으로 바뀐다. 820px 이하에서 sidebar drawer, 1100px 이상에서 TOC 표시 |
| Lighthouse (mobile, 대표 페이지 3개: 홈, 흐름 10, `ywc-mission`) | Accessibility 95 이상, Performance 90 이상, SEO 90 이상. 첫 공개 gate 는 build 후 preview 에서 mobile preset 으로 측정한다. 공개 후 배포 URL 에서 한 번 더 측정한다. 결과는 `docs/` 에 기록한다 |
| 검색 엔진 색인 | 허용한다. 사이트는 공개 guidebook 이며, NG001 이 금지하는 것은 develop-with-llm 의 다른 자료 공개다 (OQ-14 결정) |
| keyboard | 검색, tab 전환, theme 전환, copy, sidebar drawer(열기/닫기, Escape 로 닫기, 닫은 뒤 여는 버튼으로 focus 반환)를 keyboard 만으로 수행 가능 |
| 시각 표현의 텍스트 대체 | ●/–, 점선/실선 등 모양으로만 전달하는 정보에 aria-label 이나 숨김 텍스트를 둔다 |
| 404 | Starlight 기본 404 page |
| reduced motion | `prefers-reduced-motion` 에서 transition 제거 |

## R-CONTENT: 내용 품질

| 항목 | 목표 |
|---|---|
| skill page 수 | 63 (SC001) |
| skill page 사용 case | page 당 1개 이상. 각 case 에 상황, option 을 포함한 호출, 결과물이 모두 있어야 함 |
| skill option 수록 | 63 page 모두 `options` 를 가짐 (빈 목록 포함). 완전성 기준은 R-FRESH |
| Skill 색인 | 63행. skill page frontmatter 에서 자동 생성 |
| flow page 수 | 16 |
| agent page | 3 page, agent 표 합계 17행 |
| 내부 logic 비포함 (CN004) | 단계 절차, 판정 규칙, dispatch 방식 서술 0건. review checklist 항목으로 확인 |
| 원문 복사 | 0건. 사실 메모를 먼저 쓰고 그 메모로 본문을 쓴다. 최종 확인은 사람의 review (OQ-06 결정) |
| 깨진 내부 link | 0건. build 시 `starlight-links-validator` 로 검사하며, SkillLink 의 존재하지 않는 skill 이름과 `#options` anchor 도 포함 |

## Existing Constraints Touched

| 출처 | 값 | 이 spec 에서의 사용 |
|---|---|---|
| `docs/mission.md` | SC001–SC005, NG001–NG003, CN001–CN004, RA001–RA003 | 전 section 의 판단 기준 |
| `docs/research/2026-10-28-static-site-framework.md` | Starlight 0.42.7, Pagefind open issue #1211 / #1283 | R-DEPLOY, R-SEARCH |
| `docs/design/design-system.md` | color token, contrast 값, breakpoint 820 / 1100 px | R-UX |
| `docs/tech-stack.md` | directory 구조, base path | 04-interfaces |
| npm registry `astro` engines (2026-10-28 조회) | Node 22.23.4 이상 | R-DEPLOY |
| develop-with-llm `tools/claude-code/VERSION`, `tools/codex-skill/VERSION` (2026-10-28) | 1.0.0 / 0.16.164-candidate.4 | 03-data 의 `sourceVersion` 초기값 |

## Open Questions

- ~~**OQ-03**: 공개 가드의 금지 목록에 개인정보를 어떻게 저장할지 정해야 한다.~~
  - 결정 (2026-10-28): 일반 패턴은 저장소에, 민감 단어는 GitHub Actions secret 과 로컬 추적 제외 file 에 둔다 (R-GUARD).
  - hash 방식은 쓰지 않는다. 정확히 일치하는 단어만 잡을 수 있고, 추측 가능한 단어는 hash 를 대조하면 드러나기 때문이다.
- ~~**OQ-07**: 민감 단어 목록에 넣을 구체적인 단어~~ → 결정 (2026-10-28): owner 위임으로 단어를 확정했다. 저장 위치는 OQ-03 결정(로컬 추적 제외 file 과 Actions secret)을 따른다 (R-GUARD). GitHub 계정명은 사이트 URL 에 이미 포함되어 있으므로 제외한다.
- ~~**OQ-08**~~ → 해결 (2026-10-28): develop-with-llm 에서 모든 `SKILL.md` 에 Arguments 섹션을 추가했다 (Codex `0.16.164-candidate.4`). R-FRESH 는 전부 자동 비교로 바꿨다. 원래 내용: Arguments 섹션이 없는 `SKILL.md`(Claude Code 18개 / Codex 25개)에 Arguments 섹션을 추가하면, 이 사이트의 option 완전성을 전부 자동으로 비교할 수 있다. 이 사이트의 범위 밖이므로 develop-with-llm 쪽 작업으로 별도 판단한다.
- **OQ-04 (실측 후 결정)**: Pagefind 한국어 index 가 1 MB 를 넘을 때의 대응을 정해야 한다. 후보는 본문 일부를 index 에서 제외하거나 허용치를 올리는 것이다. R-SEARCH 실측 결과를 보고 결정한다.
- ~~**OQ-05**: 로컬 최신성 점검과 RA002 의 관계~~ → 결정 (2026-10-28): 메타데이터만 읽고 저장하지 않으면 sync 가 아니다 (R-FRESH).
- ~~**OQ-06**: 원문 복사 판정 방법~~ → 결정 (2026-10-28): 사실 메모를 먼저 쓰고 그 메모로 본문을 쓰는 작성 규칙에, 사람의 최종 review 를 더한다. 자동 검사는 도입하지 않는다. 번역해서 옮긴 문장은 자동 검사로 잡을 수 없기 때문이다.
- ~~**OQ-09**: Skill reference 의 sidebar 구성~~ → 결정 (2026-10-28): Skill 색인(첫 항목) 아래에 skill 63개를 이름순 평면 목록으로 둔다 (`skills/` autogenerate). 8개 분류는 색인의 분류 열·필터와 SkillCard 의 분류 tag 로 제공하고, 분류 하위 group 은 만들지 않는다. Starlight autogenerate 는 directory 단위만 지원하며, 단일 owner·63개 규모에서는 색인과 검색이 탐색 수단으로 충분하기 때문이다.
- ~~**OQ-10**: 도구별로 다른 option 의 표기~~ → 결정 (2026-10-28): 이름·형식·기본값 중 하나라도 도구별로 다르면 도구별 별도 행으로 쓰고, 각 행의 `tools` 는 한쪽만 둔다. 모두 같으면 한 행으로 쓴다 (03-data).
- ~~**OQ-11**: 위임 전용 option 의 판정 주체~~ → 결정 (2026-10-28): `Caller-only:` 는 후보 단서일 뿐이며, owner 가 판정해 frontmatter `excludedOptions` 에 도구별로 기록한다. 최신성 점검은 위임 문구 후보(Caller-only, passed by, alias)를 참고 경고로만 보여 준다 (R-FRESH).
- ~~**OQ-12**: agent 관계 서술과 CN004 의 경계~~ → 결정 (2026-10-28): "어느 skill 이 어느 agent 를 쓰는가"라는 관계는 쓴다. dispatch 방식·순서·조건은 쓰지 않는다 (03-data 작성 규칙, F-AGENT).
- ~~**OQ-13**: `userInvoked` 의 정의와 출처~~ → 결정 (2026-10-28): "model 이 자동 호출하지 않고 사용자가 명시 호출하는 skill"로 정의한다. 출처는 Claude Code 는 `SKILL.md` frontmatter, Codex 는 skill 의 openai.yaml 정책 값이며, 화면에는 Codex 쪽을 "권고"로 병기한다. R-FRESH 비교 항목에 넣는다.
- ~~**OQ-14**: 검색 엔진 색인 허용 여부~~ → 결정 (2026-10-28): 허용한다. 사이트는 공개 guidebook 이며, NG001 이 금지하는 것은 develop-with-llm 의 다른 자료 공개다. SEO 90 목표를 유지한다 (R-UX).
- ~~**OQ-15**: 공개 가드의 비공개 자료 경로 범위~~ → 결정 (2026-10-28): 저장소명 접두 형태의 경로만 금지하고, 맨 `prompts` 단어와 skill 산출물로 표기되는 사용자 project 쪽 경로는 허용한다. 오탐은 일반 패턴 설정 file 의 규칙별 allowlist 로 처리한다 (R-GUARD).
- ~~**OQ-16**: 증분 작성과 배포 방식~~ → 결정 (2026-10-28): 첫 공개 전 작성은 통합 branch `content/initial` 에서 하고(link 는 2차 pass), 86 page·R-SEARCH·preview Lighthouse 통과 후 main 에 병합해 첫 공개한다. 공개 후 변경은 feature branch → main 이다 (R-RELEASE).
