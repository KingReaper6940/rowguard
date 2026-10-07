# Daily GitHub builds

- Owner: KingReaper6940 (connected GitHub account).
- Schedule: daily, 9:00 AM America/New_York (default; user may change).
- GitHub destination: pending user reply. No remote is configured.
- Layout: one self-contained product under `projects/YYYY-MM-DD-name/`.
- Target: one useful, runnable project per day with 5–6 meaningful commits.
- Research: cite real user requests/issues and competitors; demand is a hypothesis.
- Validation: test the product's core behavior and document limitations honestly.
- Budget: inspect actual shared five-hour and weekly usage; preserve about 20%
  headroom and aim for <=10 weekly / <=25 five-hour percentage points per run.
  These are best-effort targets, not hard caps or a daily allowance.
- Prefer no paid APIs, no purchased infrastructure, and no required cloud account.
- Resume unfinished work before starting another project; do not fabricate commits.
- Push only to a user-confirmed destination and verify the remote commit hashes.
- Keep the computer on and Codex running for local scheduled work.

## Current product

RowGuard: an offline Node.js CSV comparison CLI for export reconciliation. It
matches by a unique key, rejects duplicate/blank IDs, reports schema changes,
and produces JSON or a readable standalone HTML report. No third-party packages.

Next research candidates: offline log redaction, configuration drift inspection,
and a local file cleanup preview. Revalidate user evidence before selecting.
