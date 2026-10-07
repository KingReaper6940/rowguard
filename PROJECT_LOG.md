# Project log

## 2026-10-07 — RowGuard

Status: complete locally; public publication configured on 2026-10-09.
Repository: https://github.com/KingReaper6940/rowguard-2026-10-07

Evidence reviewed 2026-10-07:
- User struggles with row-order-sensitive comparisons:
  https://www.reddit.com/r/software/comments/13i18vn/
- Existing CSV tool's issue list reports duplicate-key ambiguity:
  https://github.com/simonw/csv-diff/issues
- Competitor: https://github.com/simonw/csv-diff

These sources establish a practical problem, not a validated commercial market.
Differentiation hypothesis: zero dependencies, strict key validation, schema
change reporting, and an offline HTML report in a scriptable CLI.

Acceptance: reordered rows compare equal; additions/removals/changed cells and
columns are explained; duplicate and blank keys fail clearly; quoted CSV works;
generated HTML escapes data; CLI exit codes support automation.

Initial usage: five-hour 0%, weekly 0%. After CLI: five-hour 21%, weekly 3%.

Verification: `node --test projects/2026-10-07-rowguard/test/*.test.mjs`:
13 tests passed. CLI examples cover added/removed/changed products. GitHub Actions
is configured for Node 20/22 on Windows/Linux but has not run remotely.

Commit stages:
1. b11a339 — workflow, research and project scope.
2. e1f7b02 — strict CSV parser and malformed-input tests.
3. 1b54b11 — key-aware reconciliation and schema drift.
4. 33edf13 — CLI, JSON export, examples and exit-code integration tests.
5. cd874ff — escaped standalone HTML report.
6. Documentation, demo report and cross-platform CI (see current `git log`).

On 2026-10-09 the user authorized separate public repositories for each daily
project and publication of every project's artifacts. The daily automation was
updated accordingly. The documentation milestone includes this publishing setup
before initial publication, preserving six substantive project commits.

Publication checks: create the named public repository, push the six commits,
and verify that origin's master hash equals local HEAD. If interrupted before
verification, resume publication rather than creating another RowGuard repo.
Daily schedule remains active at 9 AM Eastern. Local execution needs host uptime.
