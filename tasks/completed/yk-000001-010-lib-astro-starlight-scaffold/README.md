# yk-000001-010-lib-astro-starlight-scaffold

## Purpose
Astro Starlight 를 도입해 base path `/develop-with-llm-guide/` 아래에서 build 되는 최소 사이트(최소 홈 1 page)를 만든다. 이후 모든 task 가 쓰는 npm script(`build`, `dev`, `preview`)와 Node·의존성 고정을 이 task 가 도입한다.

## Scope
- `npm create astro@latest -- --template starlight` 로 초기화 (기존 file 이 있는 root 이므로 임시 directory 에서 생성 후 필요한 file 만 옮긴다)
- template 예시 content(`guides/`, `reference/`) 삭제, 최소 홈 `src/content/docs/index.mdx`
- `package.json`: `astro` 7.4.2, `@astrojs/starlight` 0.42.7 exact 고정, engines `node >=22.23.4`, scripts `build`/`dev`/`preview`
- `.nvmrc`, `tsconfig.json`, 최소 `src/content.config.ts` (template 그대로 — kind schema 는 `yk-000002-010-domain-content-schema`)
- `astro.config.mjs`: `site`, `base`, `locales.root` = ko, sidebar 4 group 골격
- `.gitignore` 에 `dist/`, `node_modules/`, `.astro/`, 사실 메모 directory `.fact-memos/` 추가

## Spec Reference

### Primary Sources
- `docs/tech-stack.md` — directory 구조, `astro.config.mjs` 핵심 설정, 버전 고정, Extras
- `docs/specification/06-requirements.md#r-deploy-배포` — Node·의존성 버전
- `docs/specification/06-requirements.md#r-release-증분-작성과-첫-공개-oq-16-결정` — main 에 둘 범위
- `docs/specification/03-data.md#sidebar-구성` — 4 group 과 순서
- `docs/specification/04-interfaces.md#url-구조` — base, root locale
- `docs/research/2026-10-28-static-site-framework.md` — Starlight 채택 근거와 0.x 위험

### Summary
Starlight 0.42.7 을 exact 고정으로 도입하고 GitHub Pages project page 용 `site`/`base` 를 설정한다. 한국어를 root locale 로 두어 언어 prefix 없는 경로를 만든다. sidebar 는 시작하기(홈만 명시) / 상황별 흐름(`flows/` autogenerate) / Skill reference(`skills/` autogenerate) / Agents(`agents/` autogenerate) 골격만 둔다. 사실 메모 directory 를 이 시점에 `.gitignore` 에 넣어, 이후 content task 가 메모를 실수로 commit 하지 않게 한다.

### Out of Scope (from spec)
- starlight-links-validator — `yk-000001-020-lib-starlight-links-validator`
- 공개 가드 — `yk-000001-030-infra-public-guard`
- 배포 workflow — `yk-000001-040-infra-github-actions-deploy`
- kind discriminator schema — `yk-000002-010-domain-content-schema`
- theme·font — `yk-000002-020-ui-design-theme`
- 홈의 흐름 진입 목록 — `yk-000004-030-ui-agent-getting-started-pages`
- Astro redirects (삭제·개명 skill 이 생길 때 추가, 지금은 대상 없음)

## Criticality

`normal` — 정적 사이트 scaffold. 보안 민감 surface 없음

## Dependencies

### Depends On
- (None — root task)

### Depended By
- `yk-000001-020-lib-starlight-links-validator` — `package.json`·lockfile·`astro.config.mjs` 기반
- `yk-000002-010-domain-content-schema` — 최소 `src/content.config.ts`
- `yk-000002-020-ui-design-theme` — `astro.config.mjs` 의 starlight 설정 골격

## Key Files
- `package.json`, `package-lock.json`
- `astro.config.mjs`
- `tsconfig.json`
- `.nvmrc`
- `src/content.config.ts` (template 최소본)
- `src/content/docs/index.mdx` (최소 홈)
- `public/favicon.svg` (template 기본)
- `.gitignore`

## Notes
- **Base branch: `main`** (R-RELEASE — 첫 공개 전 main 에는 scaffold·공개 가드·배포 workflow·최소 홈만 둔다).
- Starlight 0.x 이므로 `@astrojs/starlight` 는 `^` 없이 exact 로 고정한다. 업그레이드는 별도 작업.
- CI 는 `npm ci --ignore-scripts` 로 install 한다 (R-DEPLOY). 이 task 에서 lifecycle script 없이 build 가 되는지 먼저 확인한다 (예: image 처리 의존성).
- autogenerate 대상 directory(`flows/`, `skills/`, `agents/`)가 비어 있을 때 build 가 실패하면, 해당 group 은 그 directory 에 첫 page 를 만드는 task 가 추가하도록 남기고 Implementation Notes 에 기록한다.
- 사실 메모 directory 는 `.fact-memos/` 로 고정한다. 이후 모든 skill page task 가 이 경로를 쓴다.
- task 파일·commit·page 어디에도 민감 단어, 로컬 절대 경로, private 저장소 원문을 쓰지 않는다. private 저장소는 `../develop-with-llm` 으로만 지칭한다.

## Parallel Execution Metadata

- Model Hint: opus — M1 (`Depended By` 3개 + `Owned Interface` 있음)

### Ownership
- `package.json`
- `package-lock.json`
- `astro.config.mjs`
- `tsconfig.json`
- `.nvmrc`
- `.gitignore`
- `src/content.config.ts`
- `src/content/docs/index.mdx`
- `public/favicon.svg`

### Owned Interface
- npm script `build` / `dev` / `preview`
- base path `/develop-with-llm-guide/`, root locale ko
- 사실 메모 위치 `.fact-memos/` (gitignored)

### Shared Surfaces
- Workspace config: `package.json`, `package-lock.json`
- Build config: `astro.config.mjs`
- `.gitignore`

### Conflicts With
- `yk-000001-020-lib-starlight-links-validator` — `package.json`·lockfile·`astro.config.mjs` 중복 (의존 순서로 해소)

### Parallelizable After
- (Root task — no predecessor required)

### Task Verify
- `npm ci --ignore-scripts`
- `npm run build`
- `test -f dist/index.html`
- `git check-ignore .fact-memos/x.md`

## Out of Scope
- Tailwind 등 추가 의존성 (tech-stack 에 없음)
- Header·Search override
- content page 작성
