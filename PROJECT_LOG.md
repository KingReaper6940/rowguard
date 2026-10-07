# Project log

## 2026-10-07 — RowGuard

Status: building locally; GitHub destination pending.

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

Initial usage: five-hour 0%, weekly 0%. Tests/commits/remote: pending.
