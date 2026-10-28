# 04. Interfaces

## URL 구조

- **base**: `https://yongwoon.github.io/develop-with-llm-guide/`
- **언어**: 한국어가 root locale 이므로 언어 prefix 가 없다.
- **경로 규칙**: directory 이름과 file 이름이 그대로 경로가 되며, 마지막에 `/` 가 붙는다.

| 페이지 | 경로 예 |
|---|---|
| 홈 | `/develop-with-llm-guide/` |
| 흐름 | `/develop-with-llm-guide/flows/new-project/` |
| skill | `/develop-with-llm-guide/skills/ywc-mission/` |
| skill 의 option 표 | `/develop-with-llm-guide/skills/ywc-mission/#options` |
| Skill 색인 | `/develop-with-llm-guide/skills/` |
| agent | `/develop-with-llm-guide/agents/advisors/` |

- **링크 규칙**: 본문의 skill 이름 link 는 SkillLink 로 쓴다. 그 밖의 내부 link 는 base prefix 를 포함한 절대 경로로 쓴다. 상대 경로는 쓰지 않는다. 깨진 내부 link 와 anchor 는 `starlight-links-validator` 가 build 시 검사한다.
- **페이지 이동**: file 이름을 바꾸면 기존 URL 이 깨진다. 이미 배포된 페이지를 옮기거나 지울 때는 Astro redirects 로 이전 경로를 새 page(삭제면 Skill 색인)로 보낸다 (03-data Skill 수명주기).
- **404**: Starlight 기본 404 page 를 쓴다.

## 본문 component

MDX 본문에서 쓰는 component 와 그 입력이다. 모양은 `docs/design/design-system.md` 의 Components 표를 따른다.

| Component | 입력 | 동작 |
|---|---|---|
| Flow | 여러 FlowStep | 단계를 연결선으로 잇고 번호를 자동으로 매긴다 |
| FlowStep | skill 이름, 설명, 선택 여부, 사용 가능 도구, 단계 종류(step / loop / alt), alt 의 대안 skill | 선택 단계는 점선 원과 점선 카드로 표시한다. skill 이름은 skill page 로 link 한다 |
| SkillCard | frontmatter 의 category, tools, outputs, next | skill page 상단 요약(분류 tag, 사용 가능 도구, 산출물, 다음 skill). 페이지에서 직접 값을 넘기지 않고 frontmatter 를 읽는다 |
| SkillLink | skill 이름 | 본문의 모든 skill 이름 표기에 쓴다. 해당 skill page 의 `#options` 로 link 한다. content collection 에 실제로 있는 skill page 를 기준으로 검증하며, 없으면 build 가 실패한다 (SC002, SC005) |
| OptionTable | frontmatter 의 options, argsNote | skill page 의 전체 option 표. 바로 위의 "Options" heading 이 `#options` anchor 가 된다. options 가 비어 있으면 "option 없음"을 표시한다. 빈 기본값·주의 사항은 `—`, `note` 는 "언제 쓰나" 칸 아래 작은 글씨, `argsNote` 는 표 아래에 표시한다 |
| SkillIndex | 모든 skill page 의 frontmatter | Skill 색인 표. 이름순으로 정렬하며, 이름은 SkillLink 로 렌더링한다. 분류 필터를 가진다. 375px 에서는 카드 목록으로 표시한다 |
| TitleBlock | frontmatter 의 titleBlock | 흐름 페이지 제목 아래 4칸 표제란. PageTitle override 안에서 렌더링한다 |
| VerifiedStamp | frontmatter 의 verifiedAt, sourceVersion | page 하단에 확인일과 도구별 bundle version 을 작게 표시한다 (F-FRESH) |
| Tabs / TabItem | 동기화 key 는 `tool`, label 은 Claude Code / Codex | Starlight 내장. 선택이 모든 페이지에서 동기화된다. 기본 tab 은 Claude Code 이며, 선택을 저장할 수 없으면 기본 tab 으로 돌아간다 |
| Aside | 종류, 본문 | Starlight 내장. "언제 쓰나" 같은 안내에 쓴다 |

## 호출 표기 규칙

| 도구 | 표기 | 예 |
|---|---|---|
| Claude Code | `/` + skill 이름 | `/ywc-mission` |
| Codex | `$` + skill 이름 | `$ywc-mission` |

- 근거: develop-with-llm 의 Claude Code skills README 와 codex-skill README 에 있는 호출 예시 (2026-10-28 확인).
- 자연어 요청으로도 skill 이 실행될 수 있다. 다만 guide 의 실행 예시는 위 명시 표기를 기본으로 쓴다.
- **복사 규칙**: copy 버튼이 복사하는 문자열은 표시된 호출 명령 그대로다 (`/` 또는 `$` 포함). 프롬프트 기호(›)는 code block 에 넣지 않는다. placeholder 는 `<PR#>` 처럼 꺾쇠로 쓴다.

## 외부 interface

| 대상 | 내용 |
|---|---|
| GitHub Pages | Pages 설정의 source 는 GitHub Actions 로 둔다. 배포 단위는 build 산출물 전체다. Pages environment 는 main 에서만 배포하도록 branch 를 제한한다 |
| GitHub Actions | main push 와 수동 실행(workflow dispatch)을 trigger 로 한다. job 순서는 build → 공개 가드 → 배포이며, step 은 직접 구성한다. 통합 branch 는 build + 가드만 실행한다. 상세는 R-DEPLOY |
| develop-with-llm (private, local) | 내용 확인을 위해 owner 의 로컬 checkout(`../develop-with-llm`)을 읽기만 한다. CI 는 이 저장소에 접근하지 않는다 |

## 로컬 명령 (owner 용)

| 목적 | package.json script (`pnpm run <script>`) | 명령의 역할 |
|---|---|---|
| 개발 서버 | `dev` | 로컬 미리보기. Pagefind 검색은 동작하지 않는다 |
| build | `build` | 정적 산출물을 생성하고 Pagefind index 를 만든다 |
| 미리보기 | `preview` | build 산출물을 띄운다. 검색 검증은 여기서 한다 (R-SEARCH) |
| 공개 가드 | `guard` | build 산출물과 원본 tree 에 금지 문자열이 없는지 검사한다 (R-GUARD). CI 와 같은 검사를 로컬과 pre-push 에서 실행한다 |
| 최신성 점검 | `fresh-check` | 로컬 develop-with-llm 과 사이트의 skill 목록, 사용 가능 도구, option 이름, option 별 지원 도구, userInvoked, agent 이름과 도구별 존재를 비교해 차이 보고서를 출력한다. 비교는 도구별로 양방향(누락과 초과 모두)으로 한다 (R-FRESH). 보고서는 화면 출력만 하며 저장소에 쓰지 않는다 |
