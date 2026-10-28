# yk-000001-010-lib-astro-starlight-scaffold — Implementation Checklist

## Prerequisites
- [ ] `main` 이 최신이고 working tree 에 `package.json` 이 아직 없다

## Allowed Edit Scope
- [ ] `README.md` 의 Ownership 안에서만 수정한다: `package.json`; `package-lock.json`; `astro.config.mjs`; `tsconfig.json`; `.nvmrc`; `.gitignore`; `src/content.config.ts`; `src/content/docs/index.mdx`; `public/favicon.svg`
- [ ] Ownership 밖의 수정이 필요하면 진행하지 말고 먼저 보고한다

## Stop Conditions
- [ ] 선행 task 가 실제로 병합되지 않았거나 그 산출 contract 가 없으면 멈추고 보고한다
- [ ] 다른 task 의 Ownership 으로 수정이 번지면 멈추고 보고한다
- [ ] 공유 contract(schema, component props, astro.config, package.json)를 Scope 이상으로 바꿔야 하면 멈추고 보고한다
- [ ] 진행 중인 다른 task 가 이미 같은 surface 를 소유하고 있으면 멈추고 보고한다
- [ ] lifecycle script 없이 build 가 실패하면 멈추고 원인 의존성을 보고한다

## Implementation Steps
- [ ] Starlight template 초기화
  - [ ] 임시 directory 에서 `npm create astro@latest -- --template starlight` 실행
  - [ ] 필요한 file 만 repo root 로 이동하고 예시 content(`src/content/docs/guides/`, `reference/`) 삭제
  - [ ] 기존 `AGENTS.md`, `docs/`, `tasks/` 는 건드리지 않는다
- [ ] 의존성과 runtime 고정
  - [ ] `package.json` 의 `astro` 7.4.2, `@astrojs/starlight` 0.42.7 을 exact 로 고정
  - [ ] `engines.node` 를 `>=22.23.4` 로, `.nvmrc` 에 같은 major·minor 를 기록
  - [ ] scripts `build`/`dev`/`preview` 확인 후 `npm install` 로 `package-lock.json` 생성
- [ ] `astro.config.mjs` 설정
  - [ ] `site: 'https://yongwoon.github.io'`, `base: '/develop-with-llm-guide'`
  - [ ] `starlight({ title, locales: { root: { label: '한국어', lang: 'ko' } } })`
  - [ ] sidebar: 시작하기(홈 slug 명시) / 상황별 흐름 / Skill reference / Agents (autogenerate) 순서
- [ ] 최소 홈
  - [ ] `src/content/docs/index.mdx` 에 title·description 과 "준비 중" 수준의 짧은 한국어 안내만 둔다
  - [ ] 외부·내부 link 는 base prefix 포함 절대 경로만 사용
- [ ] .gitignore 정리
  - [ ] `dist/`, `node_modules/`, `.astro/` 추가
  - [ ] `.fact-memos/` 추가 (사실 메모 local 전용)
  - [ ] 기존 `guard-words.local.txt`, `/graft/` 항목 유지

## Acceptance Coverage
Covers: R-DEPLOY (runtime·의존성 고정), R-RELEASE (main 범위: scaffold·최소 홈), F-NAV (sidebar 4 group 골격), F-SEARCH (Pagefind 내장 활성)

<!-- Write portable commands: see references/execution-convention.md#task-verify-portability -->
## Task Verify
- [ ] `npm ci --ignore-scripts`
- [ ] `npm run build`
- [ ] `test -f dist/index.html`
- [ ] `git check-ignore .fact-memos/x.md`

## Verification
- [ ] build 성공 (`npm run build`)
- [ ] lint / typecheck / unit test: N/A — spec·tech-stack 이 정의한 npm script 가 없다 (build·guard·fresh-check·dev·preview 만 정의)

## Implementation Notes (optional)
