# Task Dependency Graph

**Next PHASE (yk): `000006`** — authoritative starting point for the next `yk`-initials `ywc-task-generator` batch. Read this line first; do not re-derive by scanning when it is present. After allocating a new batch, update this line to `highest allocated PHASE + 1`.

- Source spec: `docs/specification/` (README, 01–07), `docs/mission.md`, `docs/tech-stack.md`, `docs/design/design-system.md`
- Language: ko / Granularity: llm / Generated: 2026-10-28
- Branch 정책 (R-RELEASE): Phase yk-000001 은 `main` 에 병합한다. 병합 후 owner 가 main 에서 `content/initial` 을 만들고, Phase yk-000002–000005 는 모두 `content/initial` 을 base 로 한다. 첫 공개는 `yk-000005-030` 의 마지막 단계(`content/initial` → main 병합)다.

## Phase yk-000001 — done
- Completed: `yk-000001-010-lib-astro-starlight-scaffold`, `yk-000001-020-lib-starlight-links-validator`, `yk-000001-030-infra-public-guard`, `yk-000001-040-infra-github-actions-deploy`

## Phase yk-000002 — done
- Completed: `yk-000002-010-domain-content-schema`, `yk-000002-020-ui-design-theme`, `yk-000002-030-ui-skill-components`, `yk-000002-040-ui-flow-components`, `yk-000002-050-domain-fresh-check`

## Phase yk-000003 — Skill pages 1st pass (base: content/initial)
- `yk-000003-010-ui-skill-pages-plan` → depends on `yk-000002-030`, `yk-000002-050`
- `yk-000003-020-ui-skill-pages-implement` → depends on `yk-000002-030`, `yk-000002-050`
- `yk-000003-030-ui-skill-pages-review` → depends on `yk-000002-030`, `yk-000002-050`
- `yk-000003-040-ui-skill-pages-test-git` → depends on `yk-000002-030`, `yk-000002-050`
- `yk-000003-050-ui-skill-pages-infra-docs-meta` → depends on `yk-000002-030`, `yk-000002-050`

## Phase yk-000004 — Flow, agent, guide pages (base: content/initial)
- `yk-000004-010-ui-flow-pages-10-17` → depends on Phase yk-000003, `yk-000002-040`
- `yk-000004-020-ui-flow-pages-18-25` → depends on `yk-000004-010`
- `yk-000004-030-ui-agent-getting-started-pages` → depends on `yk-000004-020`

## Phase yk-000005 — Crosslinks 2nd pass and first release (base: content/initial → main)
- `yk-000005-010-ui-skill-crosslinks-plan-to-review` → depends on Phase yk-000004
- `yk-000005-020-ui-skill-crosslinks-test-to-meta` → depends on Phase yk-000004
- `yk-000005-030-test-first-release-gate` → depends on `yk-000005-010`, `yk-000005-020`

## Open Questions (No-AC, not emitted as tasks)
- ~~**OQ-T1**: Header 의 `ywc skills · N` 표시~~ → 결정 (2026-10-28, owner): 넣지 않는다. Header 는 Starlight 기본 + CSS 로 두며 `Header` override task 는 만들지 않는다 (design-system Components 표 반영).

## Visual Dependency Graph (Optional)

```mermaid
graph LR
  subgraph P1[Phase yk-000001 main]
    A1[010 scaffold] --> A2[020 links-validator] --> A3[030 public-guard] --> A4[040 deploy]
  end
  subgraph P2[Phase yk-000002 content/initial]
    B1[010 content-schema]
    B2[020 design-theme]
    B1 --> B3[030 skill-components]
    B2 --> B3
    B3 --> B4[040 flow-components]
    B1 --> B4
    B2 --> B4
    B1 --> B5[050 fresh-check]
  end
  subgraph P3[Phase yk-000003]
    C1[010 plan]
    C2[020 implement]
    C3[030 review]
    C4[040 test-git]
    C5[050 infra-docs-meta]
  end
  subgraph P4[Phase yk-000004]
    D1[010 flows 10-17] --> D2[020 flows 18-25] --> D3[030 agent/getting-started]
  end
  subgraph P5[Phase yk-000005]
    E1[010 crosslinks A] --> E3[030 release gate]
    E2[020 crosslinks B] --> E3
  end
  A4 --> B1
  A4 --> B2
  B3 --> C1 & C2 & C3 & C4 & C5
  B5 --> C1 & C2 & C3 & C4 & C5
  C1 & C2 & C3 & C4 & C5 --> D1
  B4 --> D1
  D3 --> E1
  D3 --> E2
```
