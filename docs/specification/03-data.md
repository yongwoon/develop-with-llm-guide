# 03. Data (Content Model)

이 사이트에는 DB 가 없다. "데이터"란 `src/content/docs/` 아래의 Markdown/MDX 페이지와 그 frontmatter 이다. frontmatter 는 Starlight docs schema 를 확장해 정의하며, 필수 필드가 빠지면 build 가 실패해야 한다. 위치는 `docs/tech-stack.md` 의 `src/content.config.ts` 를 참조한다.

## 페이지 유형

| 유형 | 위치 | 수 | 비고 |
|---|---|---|---|
| Guide page | `getting-started/` 와 홈 | 3 | 홈, 설치, 두 도구의 차이 |
| Flow page | `flows/` | 16 | 02-features F-FLOW 표 |
| Skill page | `skills/` | 63 | 02-features F-SKILL 표. 파일 이름은 skill 이름과 같다 (예: `ywc-mission`) |
| Skill 색인 | `skills/index.mdx` | 1 | 02-features F-INDEX. 본문은 skill page frontmatter 에서 자동 생성한다 |
| Agent page | `agents/` | 3 | 개요, 작업 agent, 자문·리뷰 agent |

합계는 86 page 다.

## 공통 frontmatter

| 필드 | 필수 | 설명 |
|---|---|---|
| `kind` | 예 | 페이지 유형 판별 필드: guide, flow, skill, agent, index 중 하나. kind 별 필수 필드를 schema 로 강제하는 기준이다 |
| `title` | 예 | 페이지 제목. skill page 는 skill 이름 그대로 |
| `description` | 예 | 한 줄 요약. 검색 결과와 meta description 에 쓰인다 |
| `verifiedAt` | index 외 모두 예 | develop-with-llm 기준으로 내용을 확인한 날짜 (YYYY-MM-DD) |
| `sourceVersion` | index 외 모두 예 | 확인 당시 bundle version. key 는 `tools` 값과 같은 `claude-code`, `codex` 를 쓴다. 한쪽 도구 전용 skill 은 해당 도구 key 만 둔다. 2026-10-28 기준은 각각 `1.0.0`, `0.16.164-candidate.4` 이다 |

- `verifiedAt` 과 `sourceVersion` 은 page 하단의 VerifiedStamp 로 표시한다 (F-FRESH).
- kind 별 필수 필드 강제는 구현 첫 task 의 spike 로 schema 지원 여부를 확인한다. schema 로 강제할 수 없으면 component 나 점검 script 에서 오류를 내어 build 를 실패시킨다.

## Flow page

| 필드 | 필수 | 설명 |
|---|---|---|
| `titleBlock.number` | 예 | 흐름 번호 (10–25) |
| `titleBlock.steps` | 예 | 전체 단계 수 |
| `titleBlock.required` / `titleBlock.optional` | 예 | 필수 단계 수와 선택 단계 수. 둘의 합은 `steps` 와 같아야 한다 |
| `titleBlock.outputs` | 예 | 대표 산출물 목록 (예: mission, spec, tasks) |

**본문 구성 (순서 고정)**

1. 리드 문장
2. "언제 쓰나" 안내 (Aside)
3. 흐름 (Flow / FlowStep)
4. 실행 예시 (단계별 Tabs)
5. 건너뛸 수 있는 조건
6. 관련 흐름

FlowStep 은 skill 이름, 한 줄 설명, 선택 여부, 사용 가능 도구, 단계 종류를 가진다. 단계 종류는 step(순차), loop(`↔` 반복), alt(`또는` 택일, 대안 skill 을 함께 표기) 중 하나다 (02-features 흐름 표기 범례). skill 이름은 해당 skill page 로 link 한다.

- `titleBlock` 의 단계 수와 필수/선택 수는 flow page 작성 task 에서 확정한 단계 목록에서 계산한다.
- description 과 소제목에 한국어 상황어를 넣는다 (R-SEARCH).

## Skill page

| 필드 | 필수 | 설명 |
|---|---|---|
| `category` | 예 | 8개 분류 중 하나: plan, implement, review, test, git, infra, docs, meta. 표시 라벨은 아래 매핑 표를 따른다 |
| `tools` | 예 | 사용 가능 도구 목록: claude-code, codex 중 하나 이상 |
| `outputs` | 아니오 | 산출 파일이나 위치 (예: `docs/mission.md`) |
| `next` | 아니오 | 흔히 이어지는 skill 이름 목록 |
| `userInvoked` | 아니오 | model 이 자동으로 호출하지 않고 사용자가 명시적으로 호출하는 skill 여부 (예: setup, retro, handoff, merge-dependabot). 출처는 Claude Code 는 `SKILL.md` frontmatter, Codex 는 skill 의 openai.yaml 정책 값이다. 화면에는 Codex 쪽 값을 "권고"로 병기한다 (OQ-13 결정) |
| `summary` | 예 | 한 줄 용도. Skill 색인의 "한 줄 용도" 열에 쓴다 |
| `options` | 예 | 전체 option 목록. option 이 없으면 빈 목록으로 둔다. 각 항목의 필드는 아래 표와 같다 |
| `argsNote` | 아니오 | option 이 없거나 자연어 입력을 받는 skill 의 입력 방법 한 줄. option 표 아래에 표시한다 |
| `excludedOptions` | 아니오 | 위임 전용으로 판정해 표에서 뺀 option 이름 목록. 도구별 구조(`claude-code`, `codex` 각각의 목록. key 는 `tools` 값과 같다)로 둔다. 아래 "모든 option"의 정의 참조 |

**category 매핑**

| 값 | 표시 라벨 |
|---|---|
| plan | 기획·사양 |
| implement | 구현·실행 |
| review | 리뷰·품질 |
| test | 테스트·검증 |
| git | Git·PR·릴리스 |
| infra | 인프라 |
| docs | 문서·프로젝트 |
| meta | 세션·메타 |

**option 항목의 필드 (`options` 의 각 원소)**

| 필드 | 필수 | 설명 |
|---|---|---|
| `name` | 예 | option 이름. 원본 표기 그대로 (예: `--local-merge`). 위치 인자는 `<PR#>` 처럼 꺾쇠로 표기한다 |
| `format` | 예 | 값의 형식 (예: flag, 값 목록 `ko\|ja\|en`, 범위 `<start>..<end>`) |
| `default` | 아니오 | 생략했을 때의 동작. 비어 있으면 표에 `—` 로 표시한다 |
| `when` | 예 | 언제 이 option 을 쓰는가. owner 가 직접 쓴 한국어 한두 문장 |
| `tools` | 예 | 지원 도구 목록. 도구별로 지원 여부가 다른 option 을 구분하기 위함 |
| `note` | 아니오 | 다른 option 과 함께 쓸 수 없는 경우 같은 주의 사항. 표의 "언제 쓰나" 칸 아래에 작은 글씨로 표시한다 |

- 같은 option 이 두 도구에서 이름·형식·기본값까지 같으면 한 항목으로 쓰고 `tools` 에 두 도구를 넣는다. 하나라도 다르면 도구별로 별도 항목을 두고 각 항목의 `tools` 는 한쪽만 둔다 (OQ-10 결정).

**"모든 option"의 정의 (SC005, owner 결정 2026-10-28)**

- **포함**: 사용자가 그 skill 을 호출할 때 직접 설정하는 option 과 위치 인자 전부.
- **제외**
  - 다른 skill 이 위임 호출할 때만 전달하는 option. 예: executor 가 `ywc-create-pr` 에 넘기는 `--skip-post-ci-check`.
  - skill 이 내부에서 실행하는 외부 명령의 flag. 예: 내부 `gh` 명령의 flag.
  - 두 경우 모두 사용자가 설정하는 option 이 아니라 내부 process 에 속하기 때문이다 (CN004).
- **`excludedOptions` (frontmatter, 선택, 도구별 구조)**: `SKILL.md` 의 Arguments 에는 있지만 위 기준으로 제외한 option 이름 목록이다. 사이트에는 표시하지 않는다. 최신성 점검이 이 목록을 "의도적 제외"로 인식해 누락으로 보고하지 않게 하는 용도다. 위임 전용 여부는 owner 가 판정해 도구별로 기록한다 (OQ-11 결정).
- **수집 근거**
  - 도구별 `SKILL.md` 의 Arguments 섹션이 기준이다. 2026-10-28 기준 두 도구의 모든 skill(Claude Code 62, Codex 59)이 Arguments 섹션을 1개씩 가진다.
  - Arguments 가 `N/A — <이유>` 이면 option 은 빈 목록이다.
  - `Caller-only:` 표시는 위임 전용 option 의 후보 단서일 뿐이다. 최종 판정은 owner 가 하고 결과를 `excludedOptions` 에 기록한다. 최신성 점검은 위임 문구 후보(Caller-only, passed by, alias)를 참고 경고로만 보여 준다.

**본문 구성 (순서 고정)**

1. SkillCard: 이름, 분류 tag, 사용 가능 도구, 산출물, 다음 skill
2. 사용 case: case 하나 = 상황 → 호출 명령(option 포함, Claude Code / Codex Tabs) → 결과물. 1개 이상 (SC001)
3. 전체 option (`#options`): OptionTable 바로 위에 MDX heading 을 두고 heading 텍스트를 "Options" 로 고정해 slug 가 `options` 가 되게 한다. frontmatter `options` 를 표로 렌더링한다. 열은 option, 형식, 기본값, 언제 쓰나, Claude Code, Codex (SC005). `argsNote` 가 있으면 표 아래에 표시한다
4. 쓰지 말아야 할 때: 혼동하기 쉬운 sibling skill 과 그쪽으로 가는 link
5. 관련 흐름: 이 skill 이 등장하는 Flow page 목록

**작성 규칙**

- **내용 범위 (CN004)**: 사용 case 와 option 만 다룬다. 다음은 쓰지 않는다.
  - 단계 절차 (Phase, Step)
  - 내부 판정 규칙과 점수 산식
  - subagent dispatch 방식
  - 내부 file 과 script 구조

  결과물은 "무엇이 어디에 생기는가"까지만 쓴다. "어느 skill 이 어느 agent 를 쓰는가"라는 관계는 쓸 수 있지만, dispatch 방식·순서·조건은 쓰지 않는다 (OQ-12 결정).
- **원문 비복사 (CN001, OQ-06 결정)**
  - `SKILL.md` 를 보며 바로 본문을 쓰지 않는다. 먼저 사실 메모(사용 case, option 이름·형식·기본값, 산출물)를 추출하고, 그 메모만 보고 본문을 쓴다.
  - option 이름, skill 이름 같은 식별자는 원본 그대로 옮긴다 (SC002). 설명 문장은 새로 쓴다.
  - 최종 확인은 사람의 review 로 한다.
- **사례 값**: project 이름, 경로, PR 번호는 가상의 값이나 이 guide 저장소 자체의 값만 쓴다. owner 의 다른 private project 이름은 쓰지 않는다.

## Agent page

| 필드 | 필수 | 설명 |
|---|---|---|
| `agentGroup` | 예 | overview, worker, advisor 중 하나 |

본문의 agent 표는 이름, 사용 가능 도구, 권한(read-only / write-enabled), 역할, 주로 dispatch 하는 skill 열로 구성한다. "주로 dispatch 하는 skill" 열은 관계만 적고 dispatch 방식·순서·조건은 적지 않는다 (CN004, OQ-12 결정).

## 교차 검증

schema 의 필드 단위 검증만으로 잡히지 않는 값은 build 시 아래 규칙으로 검증하며, 어긋나면 build 가 실패한다.

| 대상 | 규칙 |
|---|---|
| skill page `title` | file 이름(skill 이름)과 같다 |
| flow page `titleBlock` | `required` + `optional` = `steps` |
| flow page `titleBlock.steps` | 본문의 FlowStep 수와 같다 |
| skill page `next` | 모든 이름이 실제 skill page 로 존재한다 |
| `category`, `tools` | 정해진 enum 값만 쓴다 |
| `verifiedAt` | 날짜 형식(YYYY-MM-DD)이다 |

## Sidebar 구성

| Group | 순서 | 내용 |
|---|---|---|
| 시작하기 | 1 | 이 guide 사용법, 설치, 두 도구의 차이 |
| 상황별 흐름 | 2 | 번호 순서 (10–25) |
| Skill reference | 3 | 첫 항목은 Skill 색인, 그 아래 skill 63개를 이름순 평면 목록으로 둔다 (`skills/` autogenerate). 분류 하위 group 은 만들지 않는다 |
| Agents | 4 | 개요, 작업 agent, 자문·리뷰 agent |

- 분류는 Skill 색인의 분류 열·필터와 SkillCard 의 분류 tag 로 제공한다 (OQ-09 결정).
- sidebar 항목 앞의 번호 표시는 흐름 번호(10–25)에만 쓴다. 표시 방식은 design-system 을 따른다.
- 순서와 label 은 Starlight 내장 frontmatter `sidebar.order`, `sidebar.label` 로 정한다. 흐름 page 는 `sidebar.order` 를 흐름 번호로, label 앞에 번호를 붙인다. agent page 는 개요 → 작업 → 자문·리뷰 순으로 order 를 준다.
- 시작하기 group 은 홈(root `index.mdx`)을 포함해야 하므로 autogenerate 대신 항목을 명시한다. 나머지 group 은 directory autogenerate 를 쓴다.

## Skill 수명주기

| 변경 | 처리 |
|---|---|
| 추가 | category 를 정하고, 1개 이상의 흐름에 편입하고, skill page 를 작성한다 |
| 삭제 | skill page 를 삭제하고, Astro redirects 로 이전 경로를 Skill 색인으로 보낸다 |
| 개명 | 새 이름으로 page 를 만들고, 이전 slug 를 새 page 로 redirect 한다 |

- 이 spec 의 개수(skill 63, agent 17)는 문서상 기준값이다. 화면에 표시하는 개수는 content collection 에서 계산한 값을 쓴다.
