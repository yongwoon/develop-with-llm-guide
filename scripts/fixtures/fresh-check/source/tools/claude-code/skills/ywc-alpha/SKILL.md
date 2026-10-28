---
name: ywc-alpha
description: Virtual skill for the fresh-check fixture.
---

# ywc-alpha

## Arguments

| Parameter | Format | Description |
|:--|:--:|--:|
| `--draft` | flag | Open as draft. |
| `--pr-lang` / `--lang` | `ko\|ja` | Two names for one option. |
| `--base <branch>` | `<branch>` | The value is not a key. |
| `<PR#>` | number | Positional. |
| `--format md|html` | `md|html` | Pipe inside backticks. |
| `--skip-post-ci-check` | flag | Caller-only: passed by an executor. |
| request (natural language) | text | Free text. |

### Examples

| Parameter | Format | Description |
|---|---|---|
| `--not-counted` | flag | After a heading. |
