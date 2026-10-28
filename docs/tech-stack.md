# develop-with-llm-guide Directory Structure

> **Stack**: TypeScript + Astro Starlight (static docs, GitHub Pages)
> **Architecture**: Starlight 컨벤션 (content collection + component override). domain/application layer 없음
> **Scale**: small (1인 유지보수, 단일 정적 사이트)
> **Initializer**: `npm create astro@latest -- --template starlight`
> **결정 근거**: `docs/mission.md`, `docs/research/2026-10-28-static-site-framework.md`, `docs/design/design-system.md`

이 문서는 구조의 기준(authoritative reference)이다. 새 file 이나 directory 는 이 문서를 먼저 확인하고 추가한다.

## Directory Structure

```
develop-with-llm-guide/
├── src/
│   ├── content/
│   │   └── docs/                      # 공개되는 guidebook 본문 (Korean, .mdx). sidebar 는 시작하기만 항목 명시, 나머지는 directory autogenerate
│   │       ├── index.mdx              # 홈: 이 guide 사용법 + 상황별 진입점 (SC003). getting-started group 의 첫 항목
│   │       ├── getting-started/       # 설치, 두 도구의 차이
│   │       ├── flows/                 # 상황별 흐름 (new-project.mdx, onboarding-existing-repo.mdx …)
│   │       ├── skills/                # skill reference. skill 1개 = 1 page (<skill-name>.mdx), SC001 의 단위
│   │       │   └── index.mdx          # Skill 색인 (SkillIndex). sidebar 의 Skill reference 첫 항목
│   │       └── agents/                # agent reference (개요 / 작업 agent / 자문·리뷰 agent 3 page)
│   ├── content.config.ts              # docsLoader + docsSchema. frontmatter 확장 (아래 "frontmatter 확장 필드")
│   ├── components/
│   │   ├── overrides/                 # Starlight 기본 component 교체 (astro.config 의 components 옵션에 등록)
│   │   │   ├── PageTitle.astro        # h1 + TitleBlock(표제란) 렌더링
│   │   │   └── Search.astro           # 기본 Search + JS 비활성 시 Skill 색인 link, 로딩·실패 안내
│   │   ├── Flow.astro                 # 흐름 컨테이너: 연결선
│   │   ├── FlowStep.astro             # 단계: 번호 원 + 카드, optional → 점선, 단계 종류 step/loop/alt
│   │   ├── SkillCard.astro            # skill 요약 카드 (분류 tag·도구·산출물·다음 skill, crop mark)
│   │   ├── SkillLink.astro            # 본문의 skill 이름 → <skill>/#options. collection 에 없는 skill 이면 build 실패
│   │   ├── OptionTable.astro          # frontmatter options/argsNote → 전체 option 표 ("Options" heading 아래, #options)
│   │   ├── SkillIndex.astro           # 전 skill frontmatter → Skill 색인 표 + 분류 필터
│   │   ├── VerifiedStamp.astro        # page 하단 확인일·bundle version 표시
│   │   └── TitleBlock.astro           # 표제란 4칸 (PageTitle 에서 사용)
│   ├── styles/
│   │   └── theme.css                  # design token (light/dark) → --sl-* 매핑 + 모눈 배경, sidebar, TOC, § counter, @font-face
│   └── assets/                        # 빌드 시 최적화되는 이미지 (필요할 때만)
├── public/
│   ├── favicon.svg
│   └── fonts/                         # self-host font (Pretendard Variable subset woff2, DM Mono)
├── scripts/                           # Node script (owner 로컬 + CI)
│   ├── guard.mjs                      # 공개 가드 (R-GUARD). dist/ 와 원본 tree 검사
│   └── fresh-check.mjs                # 최신성 점검 (R-FRESH). 로컬 전용
├── .github/
│   └── workflows/
│       ├── deploy.yml                 # main push → build + guard → GitHub Pages (R-DEPLOY)
│       └── check.yml                  # content/initial push·PR → build + guard, 배포 없음
├── docs/                              # project 문서 (사이트에 publish 되지 않음)
│   ├── mission.md
│   ├── tech-stack.md                  # 이 문서
│   ├── research/
│   ├── design/                        # design-system.md + drafts/
│   └── specification/                 # ywc-spec-writer 산출물
├── tasks/                             # (다음 단계) ywc-task-generator 산출물
├── astro.config.mjs                   # site/base, Starlight 설정 (locales.root=ko, sidebar, customCss, components, expressiveCode, plugins, redirects)
├── .githooks/pre-push                 # 로컬 build → guard (core.hooksPath 로 1회 등록)
├── guard.config.json                  # 공개 가드의 일반 패턴 + 규칙별 allowlist (공개되어도 무방한 내용만)
├── guard-words.local.txt              # 민감 단어 목록 (로컬 전용, .gitignore 로 추적 제외)
├── .gitignore
├── .nvmrc                             # Node version 고정
├── tsconfig.json
├── package.json                       # pnpm. packageManager, engines, scripts(build, guard, fresh-check), lockfile 은 pnpm-lock.yaml
├── AGENTS.md                          # 공통 agent 지침 (CLAUDE.md / GEMINI.md 는 import 만)
├── CLAUDE.md
└── GEMINI.md
```

## Key Directory Descriptions

### `src/content/docs/`

- **역할**: 공개되는 guidebook 본문 전부를 둔다. Starlight 가 이 directory 를 route 로 변환한다.
- **이 구조인 이유**
  - `locales.root` 를 `ko` 로 두면 언어 prefix 없이 `/develop-with-llm-guide/flows/new-project/` 형태가 된다 (NG002).
  - flows / skills / agents 는 sidebar group 과 1:1 로 autogenerate 하고, 시작하기는 홈을 포함하도록 항목을 명시한다. 순서는 `sidebar.order` 로 정하며 Skill 색인(`skills/index.mdx`)은 order 0 으로 첫 항목에 고정한다.
  - Skill reference group 은 `skills/index.mdx`(Skill 색인)를 첫 항목으로 두고, 그 아래 skill 63개를 이름순 평면 목록으로 둔다. 분류 하위 group 은 만들지 않는다. autogenerate 가 directory 단위만 지원하기 때문이며, 분류는 색인의 분류 열·필터와 SkillCard tag 로 제공한다 (spec 03-data Sidebar 구성).
  - `skills/` 를 skill 1개당 1 page 로 두는 이유는 두 가지다.
    - Pagefind 검색 결과가 skill 단위로 바로 연결된다.
    - SC001(63개 전부 수록)의 진행률을 file 수로 확인할 수 있다. 이때 `index.mdx`(색인)는 세지 않는다.
  - 상세 목차는 `docs/specification/` 이 기준이다.
- **예시 file**: `flows/new-project.mdx`, `skills/ywc-mission.mdx`
- **공개 규칙**: `SKILL.md` 원문 복사 금지 (CN001). 본문은 직접 작성한다.

### `src/content.config.ts`

- **역할**: Starlight 의 `docsLoader()` / `docsSchema()` 로 docs collection 을 정의한다.
- **frontmatter 확장 필드** (정의는 spec 03-data)
  - 공통: `kind` (guide / flow / skill / agent / index), `verifiedAt`, `sourceVersion` (`claude-code`, `codex` key. index 는 제외)
  - 흐름 페이지: `titleBlock` (번호·단계 수·필수/선택·산출물)
  - skill 페이지: `category`, `tools`, `summary`, `options`, `outputs`, `next`, `userInvoked`, `argsNote`, `excludedOptions`
  - agent 페이지: `agentGroup`
- **교차 검증**: title=file 이름, titleBlock 합계, FlowStep 수, `next` 존재 등은 spec 03-data 의 교차 검증 표를 따른다. schema 로 강제할 수 없는 규칙은 component 나 점검 script 에서 오류를 낸다.
- **이 구조인 이유**: schema 로 검증하면 표제란 값이나 분류가 빠졌을 때 build 가 실패한다. 손으로 쓴 값이 조용히 비는 것을 막는다.

### `src/components/overrides/`

- **역할**: Starlight 기본 component 를 교체하는 file 만 둔다.
- **이 구조인 이유**: MDX 에서 직접 쓰는 content component 와 구분하기 위해서다. override 는 Starlight 버전 업데이트 때 깨질 수 있다 (0.x). 한 곳에 모아 두면 업그레이드 시 점검 범위가 명확하다.
- **예시 file**: `PageTitle.astro`. Header 등은 CSS 로 충분하면 override 하지 않는다.
- **의존 방향**: override 는 `src/components/*` 를 import 할 수 있다. 역방향은 금지.

### `src/components/`

- **역할**: MDX 본문에서 import 해 쓰는 정적 `.astro` component 를 둔다. `Flow`, `FlowStep`, `SkillCard`, `SkillLink`, `OptionTable`, `SkillIndex`, `VerifiedStamp`, `TitleBlock` 이 해당한다.
- **이 구조인 이유**: client JS 가 필요 없으므로 React/Vue island 를 두지 않는다. Tab 은 Starlight 내장 `Tabs syncKey="tool"` 을 쓴다.

### `src/styles/theme.css`

- **역할**: `docs/design/design-system.md` 의 token 을 Starlight 의 `--sl-*` 변수에 매핑하고, 모눈 배경 등 전역 스타일을 정의한다. light 와 dark 둘 다 포함한다.
- **이 구조인 이유**: design token 을 한 file 에 모아야 디자인 기준과의 대조가 쉽다. Tailwind 는 쓰지 않는다. design system 이 CSS custom property 만으로 완결되므로 추가 의존성이 필요 없다.

### `public/fonts/`

- **역할**: self-host 하는 font file 을 둔다. Pretendard Variable 은 dynamic subset 또는 subset woff2, DM Mono 는 woff2 로 둔다. `font-display: swap` 과 본문 font preload 는 `docs/design/design-system.md` Typography 를 따른다.

### `scripts/`

- **역할**: build 외 점검용 Node script 를 둔다.
  - `guard.mjs`: 공개 가드 (spec R-GUARD). `dist/` 의 텍스트 file 과 원본 tree 를 검사한다(범위는 R-GUARD 표). 일반 패턴은 `guard.config.json`, 민감 단어는 로컬 `guard-words.local.txt` 또는 CI secret 에서 읽는다.
  - `fresh-check.mjs`: 최신성 점검 (spec R-FRESH). owner 로컬에서만 실행하며 저장소에 아무것도 쓰지 않는다.
- **script** (`pnpm run <name>`): `build`, `guard`, `fresh-check`. CI 는 build 와 guard 를 별도 step 으로 실행한다.

### `.github/workflows/`

- **역할**: GitHub Pages 배포 workflow 를 둔다 (spec R-DEPLOY). step 을 직접 구성해 build + guard 를 실행하고, 통과하면 Pages 에 배포한다(`check.yml` 은 배포 없이 검사만).

### `docs/`

- **역할**: project 운영 문서를 둔다. `src/` 밖이므로 사이트에 publish 되지 않는다.
- **공개 범위**: 저장소가 public 이므로 GitHub 에서는 보인다. 비공개 자료를 두지 않는다 (NG001).

## Extras

- **Initializer 후 정리**: starlight template 의 예시 content(`guides/`, `reference/`)를 삭제하고 위 4개 directory 로 바꾼다.
- **`astro.config.mjs` 핵심 설정**
  - `site: 'https://yongwoon.github.io'`, `base: '/develop-with-llm-guide'`
  - `starlight({ locales: { root: { label: '한국어', lang: 'ko' } }, customCss: ['./src/styles/theme.css'], components: { PageTitle: './src/components/overrides/PageTitle.astro' } })`
  - plugin: `starlight-links-validator` (깨진 내부 link·anchor 를 build 시 검사)
  - `redirects`: 삭제·개명한 skill page 의 이전 경로 (spec 03-data Skill 수명주기)
- **Base path**: MDX 에서 skill 이름 link 는 `SkillLink` 로, 그 밖의 내부 link 는 `/develop-with-llm-guide/` prefix 를 포함한 절대 경로로 쓴다. 상대 경로는 쓰지 않는다.
- **의존성**: `@astrojs/starlight`, `astro`, `starlight-links-validator`. 개발 의존성 `yaml`(최신성 점검 `fresh-check.mjs` 의 frontmatter 파싱, 로컬 전용). 추가 의존성은 이 문서에 먼저 적는다.
- **버전 고정**: Starlight 가 0.x 이므로 `package.json` 의 `@astrojs/starlight` 는 exact version 으로 고정한다. 업그레이드는 별도 작업으로 다룬다.
- **package manager**: pnpm (2026-10-28 owner 결정으로 npm 에서 전환). 버전은 `package.json` 의 `packageManager` 로 고정하고(corepack 호환, pnpm 11), `pnpm-lock.yaml` 을 commit 한다. CI 는 `pnpm install --frozen-lockfile --ignore-scripts` 로 install 한다. pnpm 은 선언하지 않은 간접 의존성을 import 할 수 없게 하므로, 코드가 직접 쓰는 package 는 모두 `package.json` 에 적는다.
- **Node 고정**: `.nvmrc` 와 `package.json` 의 engines 로 고정한다 (spec R-DEPLOY).
- **Mobile-first**: 375px 기준으로 작성하고, 800px(sidebar 고정)·1152px(TOC 표시)에서 확장한다. 둘 다 Starlight 기본 breakpoint 다.
- **Spec 반영**: 배포 workflow (R-DEPLOY), 한국어 검색 실측 (R-SEARCH), 공개 가드 (R-GUARD), 최신성 점검 (R-FRESH) 는 `docs/specification/06-requirements.md` 가 기준이다.
- **Architecture invariants**: layer 간 금지 의존이 `overrides → components` 단방향 하나뿐이다. manifest 를 따로 두지 않는다.
