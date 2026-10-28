# develop-with-llm-guide Specification
**Last updated**: 2026-10-28
**Language**: Korean

## Sections
- [Overview](01-overview.md)
- [Features](02-features.md)
- [Data](03-data.md)
- [Interfaces](04-interfaces.md)
- [User Flows](05-user-flows.md)
- [Requirements](06-requirements.md)
- [Glossary](07-glossary.md)

## Change Log
| Date | Section | Source | Summary |
|------|---------|--------|---------|
| 2026-10-28 | All | init | Initial structure created |
| 2026-10-28 | All | `--full` | develop-with-llm 조사(Claude Code skill 62 / Codex skill 59, 합집합 63, agent 합집합 17) 기반 전체 사양 작성 |
| 2026-10-28 | 01, 02, 03, 04, 05, 06, 07 | owner 결정 | OQ-01/02/03/05/06 확정. CN004(내부 logic 비포함), SC005(전체 option 수록, Skill 색인, SkillLink → `#options`) 반영 |
| 2026-10-28 | 03, 05, 06 | owner 결정 | OQ-08 해결 반영(R-FRESH 전부 자동 비교, `sourceVersion` Codex `0.16.164-candidate.4`), OQ-07 결정(민감 단어 확정, 저장 위치는 OQ-03), UF-5 가드 log 문구를 R-GUARD 와 일치 |
| 2026-10-28 | 01, 02, 03, 04, 05, 06, 07 | spec-validate 수정 | OQ-09–OQ-16 결정 기록(sidebar 평면 목록, 도구별 option 행, excludedOptions 판정, CN004 agent 경계, userInvoked, 검색 엔진 색인, 가드 경로 범위, 증분 작성·R-RELEASE). kind·argsNote·VerifiedStamp·교차 검증·Skill 수명주기, 가드 fail-closed·대상 file·CI 구성, R-FRESH 비교 키 정규화·종료 코드, 검색 query 12개, 흐름 표기 범례, UI 접근성 보강 |
| 2026-10-28 | 02, 03, 04, 05, 06, 07, tech-stack, design-system | `ywc-spec-validate` | Critical 4건(증분 작성·흐름 표기·sidebar·가드 fail-open) 해소, 결정 OQ-09–OQ-16 기록, 재검증 지적(가드 자기 검출, 통합 branch, CI step 직접 구성, 흐름 범례, sidebar order) 반영 |
