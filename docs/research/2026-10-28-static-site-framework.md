# Research Result: 정적 guidebook 사이트 framework 비교

- 조사일: 2026-10-28
- 조사 skill: `ywc-tech-research --compare` (depth 50)
- 결정: **Astro Starlight 채택** (owner 확정, 2026-10-28)

## Summary

Astro Starlight 를 권장·채택한다. 한국어 segmentation 을 지원하는 Pagefind 검색, tab 동기화, copy 버튼, 한국어 UI string 이 내장되어 1인 유지보수 비용이 가장 낮고, component override 와 Tailwind v4 로 LP 와 다른 디자인을 구현할 수 있다. 단, 한국어 검색 품질은 실측이 필요하다.

## Comparative Analysis

| 축 | Astro Starlight | VitePress | Next.js 16 static export |
|---|---|---|---|
| 최신 버전 | 0.42.7 (2026-10-23), 거의 주간 릴리스 [source: npm registry] | stable 1.6.4 (2025-08-05) 이후 약 14개월 정체, 2.0.0-alpha.21 (2026-10-25) [source: npm registry, GitHub releases API] | 16.4.3 (2026-10-23) [source: npm registry] |
| GitHub Pages | `site` + `base`, 공식 `withastro/action` [source: https://docs.astro.build/en/guides/deploy/github/] | `base: '/repo/'`, 공식 workflow [source: https://vitepress.dev/guide/deploy] | `output: 'export'` + `basePath`, LP 설정 재사용 가능 [source: https://nextjs.org/docs/app/guides/static-exports] |
| 한국어 검색 | Pagefind 내장. Korean segmentation 지원 명시, stemming 없음 [source: https://pagefind.app/docs/multilingual/] | minisearch 기반 local search. 한국어 언급 없음, custom tokenizer 가 필요할 수 있음 [INFERRED] [source: https://vitepress.dev/reference/default-theme-search] | Pagefind 등을 별도 통합해야 함. LP 의 index 는 title·요약만 대상 [source: ywc-agent-toolkit-lp/scripts/generate-search-index.mjs] |
| Tabs / code | `Tabs` `syncKey` 로 페이지 간 선택 유지, Expressive Code copy 버튼 기본 제공 [source: https://starlight.astro.build/components/tabs/, https://expressive-code.com/key-features/frames/] | `::: code-group` 제공, copy 버튼 미확인 [source: https://vitepress.dev/guide/markdown] | 직접 구현 |
| 디자인 자유도 | `customCss`, component override, Tailwind v4 공식 지원 [source: https://starlight.astro.build/guides/overriding-components/, https://starlight.astro.build/guides/css-and-tailwind/] | 테마 확장 또는 custom theme (Vue) [source: https://vitepress.dev/guide/custom-theme] | 완전 자유 |
| 1인 유지보수 비용 | 낮음 (sidebar·TOC·검색·한국어 UI 내장) [source: https://starlight.astro.build/guides/i18n/] | 중 (Vue 학습 필요) [INFERRED] | 높음 (LP guidebook 수준 구현에 약 1,900 LOC / 16 files) [source: wc -l, ywc-agent-toolkit-lp] |
| License | MIT [source: npm registry] | MIT [source: GitHub API] | MIT [source: npm registry] |

## Recommended Approach

Astro Starlight 를 채택한다.

- **기능 적합성**: Korean segmentation(SC003), tab 동기화, copy 버튼, 한국어 UI string 이 모두 내장되어 있다. `locales.root` 로 언어 prefix 없는 한국어 단일 사이트를 구성할 수 있다.
- **디자인 차별화**: component override 와 Tailwind v4 로 LP 와 다른 디자인을 구현할 수 있다 (RA003).
- **유지 상태**: 릴리스가 활발하다. VitePress 는 stable 이 정체되어 있고, Next.js 는 LP 처럼 직접 구현해야 해서 비용이 크다.

## Project-Specific Considerations

1. **0.x 버전**이므로 minor 업데이트에도 breaking change 가 있을 수 있다. 버전을 고정한다. [INFERRED]
2. **Pagefind 한국어 open issue**
   - #1211: Korean index 가 chunk 로 분할되지 않아, 검색할 때마다 index 전체를 내려받는다 [source: https://github.com/Pagefind/pagefind/issues/1211]. 63 페이지 규모에서는 영향이 작을 것으로 본다. [INFERRED]
   - #1283: IME 조합 중 Enter 처리 문제 [source: https://github.com/Pagefind/pagefind/issues/1283]. Starlight 검색 UI 에도 해당하는지는 미확인.
   - spec 에 "실제 한국어 콘텐츠로 검색 실측" task 를 포함한다.
3. **디자인 시안 범위**: Starlight 의 override 가능한 구조(Header, Sidebar, PageFrame, TwoColumnContent 등) 안에서 작성한다.
4. **base path 처리**: MDX 의 수동 절대 link 에는 `/develop-with-llm-guide/` 를 붙여야 한다. [INFERRED]

## References

- [Official] Starlight Tabs — https://starlight.astro.build/components/tabs/ (fetched 2026-10-28)
- [Official] Starlight Overriding Components — https://starlight.astro.build/guides/overriding-components/ (fetched 2026-10-28)
- [Official] Pagefind Multilingual — https://pagefind.app/docs/multilingual/ (fetched 2026-10-28, undated)
- [Official] Astro Deploy to GitHub Pages — https://docs.astro.build/en/guides/deploy/github/ (fetched 2026-10-28)
- [Official] VitePress Search — https://vitepress.dev/reference/default-theme-search (fetched 2026-10-28)
- [Official] Next.js Static Exports — https://nextjs.org/docs/app/guides/static-exports (last updated 2026-08-09)
- [context7] used: no — 모든 호출에서 monthly quota exceeded

## Provenance and Persistence

- Source fetch date: 2026-10-28 (전체)
- Inference labels: VitePress 한국어 tokenizer 필요성, Starlight 0.x breaking 위험, #1211 영향도, base path 수동 link 처리
- Unresolved gaps: Pagefind 한국어 검색 품질 실측, VitePress copy 버튼 여부, 세 후보의 성능 벤치마크 수치 (N/A — no data found)
- Research artifact path: `docs/research/2026-10-28-static-site-framework.md`
- Persistence confirmed at: 2026-10-28 (owner 확정)
- Persistence: written

## Completion Status

DONE_WITH_CONCERNS — 한국어 검색은 실측이 필요하다.
