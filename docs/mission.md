# Mission — develop-with-llm-guide

<!-- updated: 2026-10-28 -->

## How this file is used

Session 시작 시 `@docs/mission.md` 로 load 되어, agent 가 이 project 의 why, success criteria, non-goals, constraints, 그리고 이미 배제한 approach(와 그 이유)를 기준으로 판단하도록 고정한다.

## Mission

develop-with-llm-guide 는 develop-with-llm 의 ywc skill·agent 사용법과 실제 case 를 본인이 웹에서 빠르게 찾아볼 수 있도록, 한국어 guidebook 사이트로 제공하기 위해 존재한다. Target outcome: `yongwoon.github.io/develop-with-llm-guide/` 에서 상황별 흐름과 skill 별 사용법을 탐색·검색할 수 있는 상태.

## Success Criteria

| ID | Criterion | Rationale | Status | Provenance |
|----|-----------|-----------|--------|-----------|
| SC001 | develop-with-llm 의 모든 active ywc skill(Claude Code 와 Codex skill 의 합집합, 내부 helper `ywc-shared-scripts` 제외, 2026-10-28 기준 63개)이 skill reference 에 등재되고 각각 1개 이상의 사용 예시를 가진다 | LP 에 없는 skill 들이 별도 사이트의 존재 이유이기 때문. 두 도구의 구성이 달라 대상을 합집합으로 명확히 함 | active | user, 2026-10-28 (정의 명확화 2026-10-28) |
| SC002 | 사이트의 skill 이름·인자 표기가 develop-with-llm 의 `SKILL.md` 와 일치한다 | `ywc-setup`, `ywc-mission` 등 이름 변경이 있어 오표기 위험이 있기 때문 | active | user, 2026-10-28 |
| SC003 | 상황(예: 새 project 시작)에서 출발해 2클릭 이내에 해당 흐름 페이지에 도달할 수 있고, skill 이름으로 사이트 내 검색이 가능하다 | 본인이 필요할 때 빨리 찾아보는 것이 목적이기 때문 | active | user, 2026-10-28 |
| SC004 | main push 시 GitHub Pages 에 자동 배포된다 | 수동 배포가 있으면 문서 갱신이 미뤄지기 때문 | active | user, 2026-10-28 |
| SC005 | 모든 skill 의 모든 option 이 도구별로 수록되고, Skill 색인과 본문의 skill link 에서 1 클릭으로 해당 skill 의 option 표에 도달한다 | option 을 즉시 참조하는 것이 이 사이트의 핵심 사용 방식이기 때문 | active | user, 2026-10-28 |

## Non-goals

| ID | Non-goal | Reason | Status | Provenance |
|----|----------|--------|--------|-----------|
| NG001 | 연구 노트·prompt 모음·evaluations 등 develop-with-llm 의 다른 자료 공개 | 본인 자산이며 타인이 활용하는 것을 원하지 않기 때문 | active | user, 2026-10-28 |
| NG002 | 다국어 지원 | 사용자가 본인뿐이므로 한국어로 충분하기 때문 | active | user, 2026-10-28 |
| NG003 | 마케팅 랜딩 섹션(hero, install 홍보 등) | 홍보는 ywc-agent-toolkit-lp 가 담당하며, 이 사이트는 guidebook 만 다루기 때문 | active | user, 2026-10-28 |

## Constraints

| ID | Constraint | Rationale | Status | Provenance |
|----|------------|-----------|--------|-----------|
| CN001 | develop-with-llm 은 private 유지. guide 저장소에는 `SKILL.md` 원문을 복사하지 않고 사용법을 재작성한 본문만 둔다 | guide 저장소는 public 이며, 공개된 내용은 회수할 수 없기 때문 | active | user, 2026-10-28 |
| CN002 | GitHub Pages 정적 호스팅만 사용한다 (서버·DB 없음) | 배포 대상이 GitHub Pages 로 정해져 있기 때문 | active | user, 2026-10-28 |
| CN003 | 내용의 source of truth 는 develop-with-llm 의 `SKILL.md` 이다 | LP guidebook 과 skill 구성·이름이 다르기 때문 | active | user, 2026-10-28 |
| CN004 | skill 의 내부 logic·process(단계 절차, 내부 판정 규칙, subagent dispatch 방식 등)는 쓰지 않는다. 어떤 case 에 어떻게(어떤 option 으로) 쓰는지만 쓴다 | 사용법 조회가 목적이며, 내부 구현은 공개하지 않을 자산이기 때문 | active | user, 2026-10-28 |

## Rejected Approaches

| ID | Approach | Reason | Status | Provenance |
|----|----------|--------|--------|-----------|
| RA001 | ywc-agent-toolkit-lp guidebook 페이지를 복사해 재활용 | skill 구성이 63 vs 49 이고 고유 skill 16개·이름 변경이 있어, 복사하면 누락과 오표기가 고착되기 때문 | active | user, 2026-10-28 |
| RA002 | private 저장소에서 content 를 가져오는 sync script | 공개 대상이 guide 본문 자체라 sync 가 불필요하며, sync 경로는 private 자료의 유출 경로가 되기 때문 | active | user, 2026-10-28 |
| RA003 | LP 와 동일한 디자인 | 두 사이트를 시각적으로 구분하기로 사용자가 결정했기 때문 | active | user, 2026-10-28 |

## Deprecated

| ID | Kind | Text | Deprecated | Reason / Superseded-by |
|----|------|------|-----------|-----------------------|

## Change log

- 2026-10-28 — Mission set; +SC001–SC004; +NG001–NG003; +CN001–CN003; +RA001–RA003
- 2026-10-28 — ~SC001 (대상을 두 도구 합집합으로 명확화, spec OQ-01); +SC005; +CN004
