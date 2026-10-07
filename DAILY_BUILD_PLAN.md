# Daily GitHub builds

- Owner: KingReaper6940 (connected GitHub account).
- Schedule: daily, 9:00 AM America/New_York (default; user may change).
- GitHub publishing: user authorized a separate PUBLIC repository for every
  daily project on 2026-10-09. Create under KingReaper6940 without asking again.
- Name repositories `product-name-YYYY-MM-DD`; check collisions before creating.
- First repository: https://github.com/KingReaper6940/rowguard-2026-10-07
- RowGuard retains its existing layout and six-stage Git history in this root.
- Future layout: independent repositories under `repos/YYYY-MM-DD-name/`, each
  with its own origin, source, tests, README, research notes and examples.
- Target: one useful, runnable project per day with 5–6 meaningful commits.
- Research: cite real user requests/issues and competitors; demand is a hypothesis.
- Validation: test the product's core behavior and document limitations honestly.
- Budget: inspect actual shared five-hour and weekly usage; preserve about 20%
  headroom and aim for <=10 weekly / <=25 five-hour percentage points per run.
  These are best-effort targets, not hard caps or a daily allowance.
- Prefer no paid APIs, no purchased infrastructure, and no required cloud account.
- Resume unfinished work before starting another project; do not fabricate commits.
- Publish all project artifacts and history to its own public repository.
  Verify public visibility and remote hashes. Keep secrets, unrelated projects,
  local automation state and account usage details out of future product repos.
- Keep the computer on and Codex running for local scheduled work.

## Current product

RowGuard: an offline Node.js CSV comparison CLI for export reconciliation. It
matches by a unique key, rejects duplicate/blank IDs, reports schema changes,
and produces JSON or a readable standalone HTML report. No third-party packages.

Next research candidates: offline log redaction, configuration drift inspection,
and a local file cleanup preview. Revalidate user evidence before selecting.
