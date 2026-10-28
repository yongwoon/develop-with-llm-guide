# 07. Glossary

| 용어 | 정의 |
|---|---|
| develop-with-llm | owner 의 private 저장소. ywc skill 과 agent 의 원본이 있다. 이 사이트 내용의 source of truth 다 (CN003) |
| ywc-agent-toolkit-lp | 공개 배포판 ywc-agent-toolkit 의 landing page 와 guidebook. 이 사이트와 별개다 |
| Skill | `/ywc-…` (Claude Code) 또는 `$ywc-…` (Codex) 로 호출하는 작업 절차 묶음. 이 사이트에서는 두 도구의 합집합 63개를 다룬다 |
| Agent | skill 이 내부에서 dispatch 하는 전문 subagent. Claude Code 14개, Codex 11개, 합집합 17개 |
| Flow (상황별 흐름) | 특정 상황에서 쓰는 skill 들을 실행 순서로 엮은 페이지. 번호 10–25 |
| 필수 단계 / 선택 단계 | 흐름에서 항상 실행하는 단계와 조건에 따라 건너뛰는 단계. 선택 단계는 점선으로 표시한다 |
| 표제란 (Title block) | 흐름 페이지 제목 아래의 4칸 요약: 번호, 단계 수, 필수/선택, 산출물 |
| 사용 가능 도구 | skill 이나 agent 가 존재하는 도구: Claude Code, Codex, 또는 둘 다 |
| 분류 (category) | skill reference 의 8개 묶음: 기획·사양, 구현·실행, 리뷰·품질, 테스트·검증, Git·PR·릴리스, 인프라, 문서·프로젝트, 세션·메타 |
| Option | 사용자가 skill 을 호출할 때 직접 설정하는 flag 와 위치 인자 (예: `--local-merge`, `<PR#>`). skill page 의 `#options` 표에 도구별로 전부 싣는다. 위임 전용 flag 와 내부 명령 flag 는 제외한다 |
| 사용 case | "상황 → option 을 포함한 호출 → 결과물"로 쓴 skill 사용 예 |
| Skill 색인 | 63개 skill 을 이름순으로 나열한 appendix page. 항목을 누르면 해당 skill 의 option 표로 이동한다 |
| SkillLink | 본문의 skill 이름 표기 규칙. 항상 해당 skill 의 option 표로 link 한다 |
| 사실 메모 | 원문을 보지 않고 본문을 쓰기 위해 먼저 추출하는 사실 목록: 사용 case, option, 산출물 |
| 공개 가드 | 배포 전 build 산출물에서 비공개 정보를 찾아 배포를 막는 검사 |
| 최신성 점검 | owner 로컬에서 develop-with-llm 과 사이트의 skill 메타데이터 차이를 보고하는 점검 |
| `verifiedAt` / `sourceVersion` | 페이지 내용을 확인한 날짜와, 그때의 bundle version (Claude Code / Codex) |
| bundle version | develop-with-llm 의 도구별 VERSION 값 |
| Pagefind | Starlight 에 내장된 정적 전문 검색 엔진 |
| base path | GitHub Pages project page 의 경로 prefix `/develop-with-llm-guide/` |
| `kind` | 페이지 유형 판별 frontmatter 필드: guide, flow, skill, agent, index. 유형별 필수 필드 검증의 기준이다 |
| `userInvoked` | model 이 자동으로 호출하지 않고 사용자가 명시적으로 호출하는 skill 여부. Codex 쪽 값은 "권고"로 표시한다 |
| `excludedOptions` | `SKILL.md` Arguments 에 있지만 owner 가 위임 전용으로 판정해 option 표에서 뺀 option 이름 목록. 도구별로 기록한다 |
| `argsNote` | option 이 없거나 자연어 입력을 받는 skill 의 입력 방법 한 줄. option 표 아래에 표시한다 |
| `agentGroup` | agent page 의 구분 필드: overview(개요), worker(작업 agent), advisor(자문·리뷰 agent) |
| SkillCard | skill page 상단 요약 카드: 분류 tag, 사용 가능 도구, 산출물, 다음 skill |
| OptionTable | skill page 의 전체 option 표. "Options" heading 아래에 두며 `#options` 로 link 된다 |
| VerifiedStamp | page 하단에 확인일(`verifiedAt`)과 도구별 bundle version(`sourceVersion`)을 작게 표시하는 component |
