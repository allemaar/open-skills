# Write safely

Load before an authorized creation, edit, repair or consolidation write, including auxiliary drafts. Do not ask again for an already approved exact replacement or migration plan.

## Gate

Resolve every candidate write to canonical source, or the intended canonical destination for new content, through governing instructions, repository metadata, and provenance. Stop if required source or destination ownership is unavailable or ambiguous. A consumed copy, projection, package, or link is not a write target unless local authority names it canonical.

Before writing, inspect without following links:

- each canonical target leaf and parent chain;
- every staging, temporary, backup, manifest, generated-output, installer, or other auxiliary path and parent chain;
- every existing parent of an absent leaf.

Reject any symlink, junction, reparse point, mount, or equivalent redirect.

An explicit creation or edit request authorizes private drafts, new files and ordinary revisions within its stated scope; do not request a second approval unless governing policy requires it. Resolve an unspecified destination or a collision before writing. Before replacing content beyond that authorized revision, retiring or reorganizing existing canonical content, show the selected findings, canonical targets, auxiliary paths, behavioral change, safeguards, migration cost, recoverable preimages, write strategy, verification and partial-failure recovery, and obtain approval for that exact set unless already given. For that gated set, changed reviewed bytes, scope, risk or external effects require a new gate.

## Apply

- In a managed library, apply through its owning manager's mutation procedure and existing current-content/draft checks. If unavailable, report the blocker; do not bypass it with direct source writes.
- Re-read canonical preimages and current repository state. Recheck target and auxiliary chains before each write.
- Retain a verified recoverable preimage for every existing target until verification succeeds; record prior absence for a new target. Stop if recovery is uncertain.
- Use atomic replacement where supported; otherwise use only the approved non-atomic strategy.
- Record mutation order and result. Preserve unrelated work.
- Apply only selected findings. Update owned routes, references, metadata, dependencies, and derived surfaces required by local policy.
- Do not run a mutating validator unless its outputs and effects were approved.
- Do not commit, publish, install, or alter external state without separate authority.

## Partial failure

Stop after the first failed write. Preserve preimages and current bytes. Report completed, failed, and unstarted targets plus exact recovery state.

Rollback only when the approved recovery plan covers it, each live target still matches the exact failed-run output, and each preimage still matches its recorded identity. Otherwise stop for a new decision. Never continue forward, delete evidence, or silently roll back a successful target.

## Verify

Inspect the final diff and run bounded relevant checks. Verify local references, load markers, routing, frontmatter and the intended consumed surfaces. Claim parity only from target-specific comparisons covering those surfaces; claim behavior only from bounded execution with discriminating success and failure cases. Neither proves the other; label unavailable coverage unchecked. Record measured before/after load only when useful.

Report checked and unchecked scope, failures, recovery residue, stale surfaces, and unrelated changes left untouched. Stop after one apply and targeted verification cycle. New findings require new selection.

[load.complete] skill-smith.write
