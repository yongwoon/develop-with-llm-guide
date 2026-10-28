# Repository Guidelines

This file is the single source of agent instructions for this repository. Codex and Grok Build read it directly; `CLAUDE.md` and `GEMINI.md` only import it. Put shared rules here, not in the tool-specific files.

**Read `docs/mission.md` before starting any task.** It defines the why, success criteria (SC), non-goals (NG), constraints (CN), and rejected approaches (RA). Do not re-propose an active `RA###`.

## What This Project Is

A Korean-only static guidebook site for the `ywc-*` skills and agents maintained in the private `develop-with-llm` repository. It explains skill usage, situational flows, and examples so the owner can look them up on the web. It is deployed to GitHub Pages at `https://yongwoon.github.io/develop-with-llm-guide/`.

It is **not** the ywc-agent-toolkit landing page (`ywc-agent-toolkit-lp`). The skill sets differ (63 vs 49, with renames), and the visual design must differ.

## Project Status

Released (first public release 2026-10-29). The site is live and changes go from a feature branch to `main`. The project followed the "new project" flow: mission → tech research → design draft → scaffold → spec → spec-validate → tasks → confidence gate → implementation.

- Done: mission, tech research, design, scaffold, spec (validated), implementation, first release (gate record in `docs/measurements/first-release.md`). The spec in `docs/specification/` is authoritative for content model, requirements, and decided Open Questions.
- Structure: `docs/tech-stack.md` is the authoritative directory layout. Read it before creating files or directories.
- Design: "도면 (Blueprint)" C+ (decided 2026-10-28). `docs/design/design-system.md` is the authoritative visual reference. Follow its tokens and component mapping; do not improvise styles.
- Stack: Astro Starlight (decided 2026-10-28). See `docs/research/2026-10-28-static-site-framework.md` for the rationale and known risks, including Pagefind Korean search, which must be verified with real content.

## Content Rules (public repository)

This repository is **public**, and anything pushed here cannot be recalled.

- The source of truth for skill behavior is `../develop-with-llm/tools/claude-code/skills/<skill>/SKILL.md` (and `../develop-with-llm/tools/claude-code/agents/` for agents). It is available locally and private.
- Cover only usage: when to use a skill, how to invoke it, and every option per tool. Never describe a skill's internal logic or process, such as phases, scoring rules, or subagent dispatch (CN004).
- Extract a fact memo first (use cases, options, outputs). Then write the page from the memo, not from `SKILL.md` (spec OQ-06).
- Write usage guides in your own words. Never copy `SKILL.md` text verbatim, and never add a sync or copy script from the private repo (RA002).
- Never publish research notes, prompts, evaluations, reports, incidents, plans, `.ywc-*` files, or other content from `develop-with-llm` (NG001).
- Never include secrets, internal hostnames, or absolute local paths in published content.
- Skill names and arguments must match the current `SKILL.md` (SC002). Do not copy pages from `ywc-agent-toolkit-lp` (RA001).

## Language Conventions

- Always reply to the user in Korean.
- Site content and project docs (`docs/`, `tasks/`) are in Korean. Technical terms stay in English.
- Code identifiers and code comments are in English.
- Use lowercase kebab-case file names.

## Deployment Constraints

- Static output only, hosted on GitHub Pages: no server, API routes, database, auth, or forms (CN002).
- The site is served under the base path `/develop-with-llm-guide/`. Every internal link and asset must respect it.
- Pushing to `main` deploys automatically via GitHub Actions (SC004).

## Commit & Pull Request Guidelines

- Commit or push only when the owner asks.
- Use short, imperative commit messages.
- PRs should include a summary, the related task directory, the verification commands run, and screenshots for UI changes.
