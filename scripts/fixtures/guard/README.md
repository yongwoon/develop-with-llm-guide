# Guard test fixtures

Virtual strings only. Each case is copied into a temporary git repository by
`scripts/guard.test.mjs`, with `build/` renamed to `dist/` (the repository
ignores every `dist/` directory). The sensitive word `fixture-secret-word` is
injected through `GUARD_SENSITIVE_WORDS`; it is not a real word.
