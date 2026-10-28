# 01. Overview

## 목적

develop-with-llm-guide 는 private 저장소 `develop-with-llm` 이 배포하는 `ywc-*` skill 과 agent 의 사용법을 정리한 한국어 guidebook 사이트이다. 상황별 흐름, skill 별 호출법, 실제 사례를 다룬다. 사용자(owner)는 Claude Code 나 Codex 로 작업하는 중에 "지금 어떤 skill 을, 어떤 인자로 쓰는가"를 웹에서 바로 찾아볼 수 있어야 한다.

근거: `docs/mission.md` (Mission, SC001–SC005).

## 배경

- **LP 와 내용이 다르다**: 기존 `ywc-agent-toolkit-lp` guidebook 은 공개 배포판 ywc-agent-toolkit(skill 49개)을 대상으로 한다. develop-with-llm 은 skill 구성이 다르고 이름이 바뀐 skill 도 있어 LP 로는 찾을 수 없는 내용이 많다 (RA001).
- **Claude Code 와 Codex 의 구성이 다르다** (2026-10-28 조사)

  | 구분 | Claude Code | Codex |
  |---|---|---|
  | skill 수 | 62개 | 59개 |
  | 한쪽에만 있는 skill | `ywc-adr`, `ywc-issue-triage`, `ywc-manual-wizard`, `ywc-resolve-conflict` | `ywc-blast-radius` |
  | agent 수 | 14개 | 11개 |
  | 호출 표기 | `/ywc-…` | `$ywc-…` |

  같은 skill 이라도 도구별로 인자가 다를 수 있다. 예를 들어 Codex 의 `ywc-task-executor --delivery` 가 그렇다. 따라서 도구별 차이를 페이지에 명시해야 한다.

## 범위

### In scope

- 상황별 흐름 페이지 16개 (02-features F-FLOW)
- skill reference 63개: Claude Code 와 Codex 의 합집합이며, skill 1개당 1 page 로 둔다 (SC001). 각 page 에는 사용 case 와 전체 option 표를 싣는다 (SC005)
- Skill 색인 1 page: 전체 skill 목록이며, 항목을 누르면 해당 skill 의 option 표로 바로 이동한다 (SC005)
- agent reference: 17개 agent 를 3 page 로 묶어 다룬다
- 시작하기: 설치, `ywc-setup`, 두 도구의 차이
- 사이트 내 한국어 전문 검색, light/dark theme, 모바일 대응
- main 브랜치 push 시 GitHub Pages 자동 배포와 공개 가드 검사

### Out of scope

- develop-with-llm 의 연구 노트, prompt 모음, evaluations, reports, incidents, plans 공개 (NG001)
- skill 의 내부 logic·process: 단계 절차, 내부 판정 규칙, subagent dispatch 방식 등 (CN004)
- 사용 빈도 통계 등 owner 의 사용 이력에서 나온 수치 공개 (NG001 의 연장, OQ-02 결정)
- 다국어 (NG002)
- 마케팅 랜딩 섹션 (NG003)
- 내부 helper `ywc-shared-scripts`: 사용자가 호출하는 skill 이 아니라 skill 들이 공유하는 script 묶음이므로 skill page 를 만들지 않는다
- 서버, DB, 로그인, 댓글, analytics

## 이해관계자

| 역할 | 설명 |
|---|---|
| Owner | 유일한 작성자이자 주 독자. 작업 중에 skill 사용법을 조회하고, develop-with-llm 이 바뀌면 사이트를 갱신한다 |
| 공개 방문자 | 공개 사이트라서 누구나 열람할 수 있다. 다만 별도 요구사항의 대상이 아니다 |

## 제약 (요약)

- **공개 범위**: guide 저장소는 public 이다. `SKILL.md` 원문을 복사하거나 private 저장소에서 sync 해 오지 않는다 (CN001, RA002).
- **스택**: GitHub Pages 정적 호스팅에 Astro Starlight 를 쓴다. 근거는 `docs/research/2026-10-28-static-site-framework.md` 이다.
- **디자인**: "도면 (Blueprint)" C+ 를 쓴다. `docs/design/design-system.md` 가 기준이다.
- **구조**: `docs/tech-stack.md` 가 기준이다.

## Open Questions

- ~~**OQ-01**: SC001 의 "63개" 정의~~ → 결정 (2026-10-28): "두 도구 skill 의 합집합, `ywc-shared-scripts` 제외"로 명확히 하고, mission SC001 을 수정했다.
- ~~**OQ-02**: skills README 의 "자주 쓰는 Pattern" 반영 여부~~ → 결정 (2026-10-28): 집계 수치는 싣지 않는다. 호출 recipe 는 직접 다시 써서 해당 흐름 페이지와 skill page 의 사용 case 에 반영한다.
