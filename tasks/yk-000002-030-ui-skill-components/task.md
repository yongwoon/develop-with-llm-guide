# yk-000002-030-ui-skill-components — Implementation Checklist

## Prerequisites
- [ ] `yk-000002-010-domain-content-schema` 병합 완료
- [ ] `yk-000002-020-ui-design-theme` 병합 완료

## Allowed Edit Scope
- [ ] `README.md` 의 Ownership 안에서만 수정한다: `src/components/SkillCard.astro`; `src/components/OptionTable.astro`; `src/components/SkillLink.astro`; `src/components/SkillIndex.astro`; `src/components/VerifiedStamp.astro`; `src/components/overrides/Search.astro`; `src/content/docs/skills/index.mdx`; `astro.config.mjs` (`components.Search` 항목만); `docs/tech-stack.md` (directory 표의 overrides 행만)
- [ ] Ownership 밖의 수정이 필요하면 진행하지 말고 먼저 보고한다

## Stop Conditions
- [ ] 선행 task 가 실제로 병합되지 않았거나 그 산출 contract 가 없으면 멈추고 보고한다
- [ ] 다른 task 의 Ownership 으로 수정이 번지면 멈추고 보고한다
- [ ] 공유 contract(schema, component props, astro.config, package.json)를 Scope 이상으로 바꿔야 하면 멈추고 보고한다
- [ ] 진행 중인 다른 task 가 이미 같은 surface 를 소유하고 있으면 멈추고 보고한다

## Implementation Steps
- [ ] SkillLink·SkillCard
  - [ ] `getCollection('docs')` 에서 kind=skill id 집합을 만들고 없는 이름이면 `throw` 로 build 실패
  - [ ] SkillCard: 이름(mono) + 분류 tag(라벨 매핑) + 정의 목록(사용 가능 도구·산출물·다음 skill), crop mark
  - [ ] SkillCard 에서 title 과 file 이름 불일치 시 build 실패, `next` 각 이름 존재 검증
- [ ] OptionTable (375px 카드 → `min-width` 표)
  - [ ] 열: option, 형식, 기본값, 언제 쓰나(+note), Claude Code, Codex
  - [ ] ●/– 에 `aria-label` 또는 숨김 텍스트, 빈 값 `—`, 빈 목록 "option 없음", `argsNote` 표 아래
- [ ] SkillIndex 와 색인 page
  - [ ] 이름순 정렬, 열: 이름(SkillLink), 분류, 도구(●+텍스트 대체), 한 줄 용도(summary), option 수
  - [ ] 분류 필터 (JS 비활성 시 전체 표시), 1152px 미만 용도 열 줄바꿈, 375px 카드 목록
  - [ ] `src/content/docs/skills/index.mdx`: `kind: index`, `sidebar.order: 0`
- [ ] VerifiedStamp
  - [ ] page 하단 `--muted` 작은 글씨로 확인일과 도구별 bundle version
- [ ] Search override
  - [ ] 기본 `Search` 를 감싸고 `<noscript>` 에 Skill 색인 link (base 포함)
  - [ ] Pagefind 로딩 중·실패 시 안내 문구 확인, 없으면 추가
  - [ ] `astro.config.mjs` `components.Search` 등록, `docs/tech-stack.md` overrides 행에 `Search.astro` 추가
- [ ] 임시 page 로 검증
  - [ ] 가상 skill page 2개(option 있음/없음)와 없는 이름의 SkillLink 로 실패 확인
  - [ ] 검증 후 임시 page 삭제 (commit 금지)

## Acceptance Coverage
Covers: F-SKILL (option 표, 도구 표시), F-INDEX (전 항목), F-NAV (skill 이름 link → `#options`), F-SEARCH (로딩·실패·JS 비활성 안내), F-FRESH (VerifiedStamp), 03-data 교차 검증 (title=file 이름, `next` 존재), R-UX (텍스트 대체, 375px 카드)

<!-- Write portable commands: see references/execution-convention.md#task-verify-portability -->
## Task Verify
- [ ] `npm run build`
- [ ] `npm run guard`

## Verification
- [ ] build 성공 (`npm run build`)
- [ ] 공개 가드 통과 (`npm run guard`)
- [ ] lint / typecheck: N/A — spec·tech-stack 이 정의한 npm script 가 없다

## Implementation Notes (optional)
