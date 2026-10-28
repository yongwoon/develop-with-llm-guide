# fresh-check fixtures

Virtual skills (`ywc-alpha`, `ywc-beta`, `ywc-gamma`) and agents for `scripts/fresh-check.test.mjs`. Nothing here is copied from develop-with-llm.

- `source/` mimics the develop-with-llm layout (`tools/<tool>/{VERSION,skills,agents}`).
- `site/` mimics this repo's `src/content/docs/`. It matches `source/` exactly, so the check exits 0; tests copy both and change one thing at a time.
