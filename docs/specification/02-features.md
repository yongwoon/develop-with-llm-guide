# 02. Features

모든 feature 의 사용자는 Owner 다. 공개 방문자는 같은 화면을 읽기만 한다.

## F-NAV: 탐색 구조

**User story**: Owner 로서, 지금 처한 상황이나 skill 이름에서 출발해 2 클릭 이내에 원하는 페이지에 도달하고 싶다. 작업 흐름을 끊지 않기 위해서다 (SC003).

**Acceptance criteria**

- sidebar 는 4개 group 으로 구성한다: 시작하기 / 상황별 흐름 / Skill reference / Agents.
- Skill reference 의 첫 항목은 Skill 색인(F-INDEX)이다. 그 아래에 skill 63개를 이름순 평면 목록으로 둔다 (`skills/` autogenerate). 분류 하위 group 은 만들지 않는다. 8개 분류(F-SKILL)는 색인의 분류 열·필터와 SkillCard 의 분류 tag 로 제공한다 (OQ-09 결정).
- 본문에서 skill 이름은 항상 link 로 쓴다. 누르면 해당 skill page 의 option 표로 이동한다 (SC005). 흐름 페이지, 다른 skill page, agent page 모두 같은 규칙을 따른다.
- 홈에는 상황별 흐름 16개로 가는 진입 목록을 둔다. 홈에서 흐름 페이지까지 1 클릭이다.
- 흐름 페이지의 각 단계는 해당 skill page 로 연결된다. 따라서 홈 → 흐름 → skill 은 2 클릭이다.
- 모든 페이지 하단에 이전/다음 pager 를 둔다. 오른쪽 TOC 는 1152px(72rem) 이상에서만 표시한다.

## F-FLOW: 상황별 흐름 페이지

**User story**: Owner 로서, "새 project 를 시작한다", "PR review 가 달렸다" 같은 상황에서 어떤 skill 을 어떤 순서로 쓰는지 한 페이지에서 보고 싶다.

**Acceptance criteria**

- 아래 16개 흐름 페이지를 만든다. 각 페이지는 공통 구성을 갖는다.
  - 표제란: 번호, 단계 수, 필수/선택 수, 산출물
  - "언제 쓰나" 안내
  - 연결선 흐름: 선택 단계는 점선으로 표시한다
  - 실행 예시: Claude Code / Codex tab
  - 건너뛸 수 있는 조건
- 63개 skill 은 모두 1개 이상의 흐름에 등장한다. 흐름에서 skill page 로 가는 경로가 없는 skill 을 남기지 않기 위해서다.
- 한쪽 도구에서 쓸 수 없는 skill 이 흐름에 들어 있으면, 그 단계에 사용 가능 도구를 표시하고 대체 방법을 안내한다.

| No. | 흐름 | 핵심 skill (순서대로) |
|---|---|---|
| 10 | 새 project 시작하기 | brainstorm → mission → tech-research → project-scaffold → ubiquitous-language → spec-writer ↔ spec-validate → project-docs → task-generator → confidence-gate → task-executor |
| 11 | 기존 repo 진입하기 | onboard-repo → ubiquitous-language (extract) → architecture-invariants → agent-legibility-audit |
| 12 | 작은 변경 | plan (small path) → tdd-ritual → verify-done → commit → create-pr |
| 13 | 중·대형 기능 | plan → spec-ready → task-generator → confidence-gate → task-executor 또는 sequential-executor 또는 parallel-executor 또는 code-gen → impl-review → security-audit → finish-branch |
| 14 | 목표 하나로 자율 실행 | agentic |
| 15 | 장기·불확실한 initiative | wayfinder → mission → adr |
| 16 | PR review 대응과 merge | handle-pr-reviews → receive-review → resolve-conflict → finish-branch, review-learnings |
| 17 | 디버깅과 장애 회고 | debug-rootcause → incident-postmortem |
| 18 | 테스트와 완료 검증 | tdd-ritual, gen-testcase, e2e-test-strategy, verification-map, verify-done |
| 19 | 디자인·제품 점검 | ui-ux-review → design-renew, product-review |
| 20 | 인프라·클라우드 | infra-design → iac-author → infra-review → infra-optimize |
| 21 | 인증 구현 | auth-implement |
| 22 | 코드 구조 개선 | blast-radius (Codex) → improve-architecture → refactor-clean → architecture-invariants |
| 23 | 릴리스와 저장소 운영 | release-pr-list → changelog-release-notes, merge-dependabot, issue-triage |
| 24 | 로컬 환경과 병렬 작업 | docker-compose → worktrees → docker-isolate → parallel-executor, team-assemble |
| 25 | 세션 운영과 skill 관리 | setup, handoff, retro, manual-wizard, skill-author, review-learnings, mine-review-history |

표의 skill 이름은 `ywc-` prefix 를 생략했다. 페이지에서는 항상 전체 이름을 쓴다.

**흐름 표기 범례**

| 기호 | 뜻 | 단계 수 계산 |
|---|---|---|
| `→` | 순차 실행 | 각 skill 이 1단계 |
| `↔` | 반복. 두 단계를 수렴할 때까지 왕복한다 | 2단계 |
| `또는` | 택일. 선택지는 FlowStep 하나(단계 종류 alt)에 대안으로 표기한다. 대안 skill 도 "흐름에 등장"으로 인정한다 | 1단계 |
| `,` | 앞 단계와 독립된 병렬 선택 단계. 행 전체가 `,` 로만 이어지면 모든 단계가 서로 독립이다 | 각각 1단계, 선택 |
| `( )` | 사용 방식 주석 (예: small path, extract) | 계산하지 않음 |

- `↔` 의 두 skill 은 연속한 FlowStep 2개로 두고 둘 다 단계 종류 loop 로 표시한다.
- 필수/선택 기본 규칙: `→`, `↔`, `또는` 으로 이어진 단계는 필수, `,` 로 이어진 단계는 선택이다. 예외는 flow page 작성 task 에서 page 의 "건너뛸 수 있는 조건"과 함께 정한다. 표제란의 단계 수와 필수/선택 수는 확정된 단계 목록에서 계산한다.
- FlowStep 은 이 범례를 표현하기 위해 단계 종류(step / loop / alt)를 가진다 (03-data).
- flow page 의 description 과 소제목에는 한국어 상황어(예: "리뷰 대응", "새 프로젝트")를 넣는다. 검색 적중을 위한 작성 규칙이다 (R-SEARCH).

## F-SKILL: Skill reference

**User story**: Owner 로서, 각 skill 을 어떤 case 에 어떤 option 으로 쓰는지 확인하고 싶다. 또한 그 skill 의 모든 option 을 한 표에서 참조하고 싶다.

**Acceptance criteria**

- skill 1개당 1 page, 총 63 page 다. 대상은 Claude Code 와 Codex skill 의 합집합이며 `ywc-shared-scripts` 는 제외한다.
- 모든 skill page 는 03-data 의 Skill page content model 을 따른다.
- **내용 범위 (CN004)**: "어떤 case 에, 어떤 option 으로, 무엇이 나오는가"만 쓴다. skill 내부의 단계 절차, 판정 규칙, subagent dispatch 방식, 내부 file 구조는 쓰지 않는다.
- **사용 case**: case 하나는 "상황 → 호출 명령(option 포함) → 결과물"의 3요소로 쓴다. page 당 1개 이상이다.
- **전체 option 표 (SC005)**
  - 해당 skill 의 모든 option 을 빠짐없이 싣는다. 대상은 도구별 `SKILL.md` 의 Arguments 에 정의된 option 전부다.
  - 각 option 에는 형식, 기본값, 언제 쓰는가, 도구별 지원 여부(Claude Code / Codex)를 적는다.
  - 같은 option 이 두 도구에서 이름·형식·기본값까지 같으면 한 행으로 쓴다. 하나라도 다르면 도구별로 별도 행을 두고, 각 행의 지원 도구는 한쪽만 표시한다 (OQ-10 결정).
  - option 이 없는 skill 은 "option 없음"과 자연어 인자 사용법을 적는다. 자연어 인자 사용법은 frontmatter `argsNote` 에 한 줄로 쓰고 option 표 아래에 표시한다.
  - 기본값이나 주의 사항이 없는 칸은 `—` 로 표시한다.
  - option 표는 고정 anchor(`#options`)를 가진다.
- 사용 가능 도구(Claude Code / Codex / 둘 다)를 skill 카드에 표시한다. 한쪽에만 있는 skill 은 다른 도구 tab 에 "이 도구에는 없음"과 대안을 적는다.
- 분류와 소속 skill 은 다음과 같다 (합계 63).

| 분류 | 수 | skill (`ywc-` 생략) |
|---|---|---|
| 기획·사양 | 11 | brainstorm, tech-research, plan, spec-writer, spec-validate, spec-ready, task-generator, confidence-gate, adr, mission, wayfinder |
| 구현·실행 | 11 | code-gen, sequential-executor, parallel-executor, task-executor, agentic, worktrees, docker-isolate, docker-compose, auth-implement, manual-wizard, team-assemble |
| 리뷰·품질 | 14 | impl-review, review-learnings, mine-review-history, security-audit, ui-ux-review, design-renew, product-review, receive-review, debug-rootcause, refactor-clean, agent-legibility-audit, architecture-invariants, improve-architecture, blast-radius |
| 테스트·검증 | 5 | tdd-ritual, gen-testcase, e2e-test-strategy, verification-map, verify-done |
| Git·PR·릴리스 | 9 | commit, create-pr, handle-pr-reviews, finish-branch, release-pr-list, changelog-release-notes, merge-dependabot, resolve-conflict, issue-triage |
| 인프라 | 4 | infra-design, iac-author, infra-review, infra-optimize |
| 문서·프로젝트 | 5 | project-scaffold, project-docs, ubiquitous-language, onboard-repo, incident-postmortem |
| 세션·메타 | 4 | setup, retro, handoff, skill-author |

- **분류 근거**: develop-with-llm 의 skills README 7분류를 기준으로 했다. 조회하기 쉽도록 두 가지를 바꿨다. 인프라 4개를 별도 분류로 분리했고, tdd-ritual / verification-map / verify-done 을 "테스트·검증"으로 옮겼다.
- **도구 한정 skill**
  - Claude Code 전용: adr, issue-triage, manual-wizard, resolve-conflict
  - Codex 전용: blast-radius

## F-INDEX: Skill 색인 (appendix)

**User story**: Owner 로서, 전체 skill 을 한 목록에서 훑어보고, 항목을 누르면 그 skill 의 option 표로 바로 가고 싶다 (SC005).

**Acceptance criteria**

- 63개 skill 을 이름순으로 나열한 1 page 다. sidebar 의 Skill reference 첫 항목에 둔다.
- 각 행은 다음 열로 구성한다: skill 이름, 분류, 사용 가능 도구, 한 줄 용도, option 수.
- 분류로 목록을 좁히는 필터를 둔다. sidebar 에 분류 group 이 없으므로 분류별 탐색은 이 필터가 담당한다 (OQ-09 결정).
- 375px 에서는 표 대신 카드 목록으로 표시한다.
- skill 이름을 누르면 해당 skill page 의 option 표(`#options`)로 이동한다.
- 색인 내용은 각 skill page 의 frontmatter 에서 자동으로 만든다. 수기로 따로 관리하지 않는다. 따라서 skill page 와 색인이 어긋날 수 없다.

## F-AGENT: Agent reference

**User story**: Owner 로서, skill 이 내부에서 어떤 agent 를 dispatch 하는지, 그리고 어떤 agent 가 어느 도구에 있는지 알고 싶다.

**Acceptance criteria**

- 3 page 로 구성한다.
  - 개요: 도구별 agent 구성 차이, model 고정 정책 같은 설치 차이
  - 작업 agent: write-enabled
  - 자문·리뷰 agent: read-only
- 17개 agent 를 모두 표로 싣는다. 각 행에는 사용 가능 도구, 역할, 주로 dispatch 하는 skill 을 적는다.
- **CN004 경계**: "어느 skill 이 어느 agent 를 쓰는가"라는 관계는 쓴다. dispatch 방식, 순서, 조건은 쓰지 않는다 (OQ-12 결정).

| 구분 | agent (`ywc-` 생략) |
|---|---|
| 두 도구 공통 (8) | architect, go-reviewer, performance-engineer, python-reviewer, refactor-cleaner, root-cause-analyst, security-engineer, typescript-reviewer |
| Claude Code 전용 (6) | backend-coder, frontend-coder, doc-writer, qa-engineer, infra-engineer, infra-reviewer |
| Codex 전용 (3) | cloud-engineer, complexity-cleaner, test-hardener |

## F-START: 시작하기

**User story**: Owner 로서, 새 머신에서 skill 을 설치하고 기본값을 설정하는 절차를 한 곳에서 보고 싶다.

**Acceptance criteria**

- 3 page 로 구성한다.
  - 이 guide 사용법 (홈 겸용)
  - 설치: develop-with-llm 의 통합 install script 와 도구별 설치, 사전 요구 도구(`gh` 인증, `jq` 등)
  - 두 도구의 차이: 호출 표기, skill 과 agent 구성, 설정 파일 위치
- `ywc-setup` 은 skill page 로 두고, 시작하기에서는 링크한다.
- 설치 page 에는 private 저장소 URL, clone 명령, 인증 정보를 쓰지 않는다. 공개 가드의 저장소명 접두 규칙이 이를 포괄한다 (R-GUARD).

## F-SEARCH: 한국어 검색

**User story**: Owner 로서, skill 이름의 일부("handle-pr"), option 이름("--local-merge"), 한국어 상황어("리뷰 대응", "병렬")로 검색해 해당 페이지를 바로 찾고 싶다.

**Acceptance criteria**

- Starlight 내장 Pagefind 를 쓴다. header 의 검색 버튼과 ⌘K / Ctrl+K 로 연다.
- index 를 불러오는 동안 로딩 중임을 표시하고, 불러오기에 실패하면 안내 문구를 표시한다. JS 가 비활성이면 검색 대신 Skill 색인 link 를 보여 준다.
- 06-requirements 의 검색 실측 query 세트를 통과해야 한다.

## F-THEME: Theme 와 반응형

**User story**: Owner 로서, 터미널 옆에 띄워 둘 때 dark theme 로, 모바일로 볼 때도 깨지지 않게 보고 싶다.

**Acceptance criteria**

- light/dark 두 theme 를 지원한다. 첫 방문은 OS 설정을 따르고, header 에서 수동 전환할 수 있다.
- Claude Code / Codex tab 선택은 모든 페이지에서 동기화되고 다음 방문에도 유지된다. 기본 tab 은 Claude Code 이며, 선택을 저장할 수 없는 환경에서는 기본 tab 으로 돌아간다.
- 코드 블록마다 copy 버튼이 있다. 복사되는 문자열은 표시된 호출 명령 그대로다 (Claude Code `/ywc-…`, Codex `$ywc-…` 포함). 프롬프트 기호(›)는 code block 에 넣지 않는다. placeholder 는 `<PR#>` 처럼 꺾쇠로 쓴다.
- 디자인 세부 사항은 `docs/design/design-system.md` 를 따른다.

## F-DEPLOY: 배포와 공개 가드

**User story**: Owner 로서, main 에 push 하면 사이트가 자동 갱신되기를 원한다. 동시에 비공개 정보가 실수로 공개되지 않게 막고 싶다 (SC004, CN001).

**Acceptance criteria**

- main push 시 GitHub Actions 가 build → 공개 가드 → Pages 배포 순으로 실행된다. build 와 공개 가드는 별도 step 으로 실행하고, 민감 단어 secret 은 가드 step 에만 전달한다 (R-DEPLOY).
- 공개 가드가 실패하면 배포 artifact 가 만들어지지 않으므로 배포하지 않는다.
- 첫 공개 전 콘텐츠 작성은 통합 branch `content/initial` 에서 하고, 공개 후 변경은 feature branch 에서 한다. main 병합이 곧 배포다. 첫 공개 조건은 06-requirements 의 R-RELEASE 를 따른다 (OQ-16 결정).
- 상세 기준은 06-requirements 의 R-DEPLOY 와 R-GUARD 를 따른다.

## F-FRESH: 내용 최신성 표시

**User story**: Owner 로서, 페이지 내용이 develop-with-llm 의 어느 시점을 기준으로 확인된 것인지 알고 싶다. 오래된 사용법을 믿지 않기 위해서다 (SC002).

**Acceptance criteria**

- skill page, 흐름 페이지, agent page, guide page 모두에 확인 기준을 표시한다. Skill 색인은 skill page 에서 자동 생성되므로 제외한다.
  - 확인일
  - 기준 bundle version: Claude Code 와 Codex 각각
- 표시 위치는 page 하단의 작은 표시(VerifiedStamp)다. 표제란이나 제목 영역에는 넣지 않는다.
- 06-requirements 의 R-FRESH 절차로 차이를 점검한다.
