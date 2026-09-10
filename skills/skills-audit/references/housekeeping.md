# Housekeeping

Load only after an explicit request to edit, housekeep, or apply selected skill findings.

## Gate

Resolve every candidate write to canonical source through governing instructions, repository metadata, and provenance. Stop if any source is unavailable or ambiguous. A consumed copy, projection, package, or link is not a write target unless local authority names it canonical.

Before approval, inspect without following links:

- each canonical target leaf and parent chain;
- every staging, temporary, backup, manifest, generated-output, installer, or other auxiliary path and parent chain;
- every existing parent of an absent leaf.

Reject any symlink, junction, reparse point, mount, or equivalent redirect.

Show the selected findings, canonical targets, auxiliary paths, behavioral change, safeguards, migration cost, recoverable preimages, write strategy, verification, and partial-failure recovery. Obtain approval for that exact set. Changed bytes, scope, risk, or external effects require a new gate.

## Apply

- Re-read canonical preimages and current repository state. Recheck target and auxiliary chains before each write.
- Retain a verified recoverable preimage for every target until verification succeeds. Stop if recovery is uncertain.
- Use atomic replacement where supported; otherwise use only the approved non-atomic strategy.
- Record mutation order and result. Preserve unrelated work.
- Apply only selected findings. Update owned routes, references, metadata, dependencies, and derived surfaces required by local policy.
- Do not run a mutating validator unless its outputs and effects were approved.
- Do not commit, publish, install, or alter external state without separate authority.

## Partial failure

Stop after the first failed write. Preserve preimages and current bytes. Report completed, failed, and unstarted targets plus exact recovery state.

Rollback only when the approved recovery plan covers it, each live target still matches the exact failed-run output, and each preimage still matches its recorded identity. Otherwise stop for a new decision. Never continue forward, delete evidence, or silently roll back a successful target.

## Verify

Inspect the final diff and run bounded relevant checks. Verify local references, load markers, routing, frontmatter, and actual consumed form. Apply the exclusive-evidence rules in `implementation.md`; source agreement alone is insufficient. Record measured before/after load only when useful.

Report checked and unchecked scope, failures, recovery residue, stale surfaces, and unrelated changes left untouched. Stop after one apply and targeted verification cycle. New findings require new selection.

[load.complete] skills-audit.housekeeping
