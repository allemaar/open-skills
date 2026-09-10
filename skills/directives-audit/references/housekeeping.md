# Directive housekeeping

Load only after an explicit request to edit, housekeep, or apply selected directive findings.

## Gate

Resolve every candidate write to canonical source through governing instructions, ownership metadata, managed-block authority, and provenance. Stop if any source is unavailable or ambiguous. A consumed file, projection, managed block, or link is not a write target unless local authority names it canonical.

Before approval, inspect without following links:

- each canonical target leaf and parent chain;
- every staging, temporary, backup, archive, manifest, projection, managed-output, installer, or other auxiliary path and parent chain;
- every existing parent of an absent leaf.

Reject any symlink, junction, reparse point, mount, or equivalent redirect.

Show selected findings, canonical targets, auxiliary paths, affected projections, behavioral and authority effects, migration cost, recoverable preimages, write strategy, verification, and partial-failure recovery. Obtain approval for that exact set. Changed bytes, scope, authority, risk, or external effects require a new gate.

## Apply

- Re-read canonical preimages, local authority, managed ownership, and repository state. Recheck target and auxiliary chains before each write.
- Retain a verified recoverable preimage for every target until verification succeeds. Stop if recovery is uncertain.
- Use atomic replacement where supported; otherwise use only the approved non-atomic strategy.
- Record mutation order and result. Preserve unrelated work.
- Apply only selected findings. Keep each atomic rule in one semantic owner; update routers instead of duplicating conditional rules into core.
- Use the owning tool for managed blocks and generated projections. Preserve locally required archive or backup behavior.
- Do not commit, publish, install, or alter external state without separate authority.

## Partial failure

Stop after the first failed write. Preserve preimages and current bytes. Report completed, failed, and unstarted targets plus exact projection state.

Rollback only when the approved recovery plan covers it, each live target still matches the exact failed-run output, and each preimage still matches its recorded identity. Otherwise stop for a new decision. Never continue forward, delete evidence, or silently roll back a successful target.

## Verify

Inspect the final diff and run bounded relevant checks. Verify canonical sources, changed routes, conditional load markers, projections, managed blocks, and consumed entrypoints. Claim parity only from target-exclusive comparison of every declared surface; claim behavior only from the consumed entrypoint with a discriminating control. Otherwise name the gap.

Record measured core and conditional load only when useful. Report checked and unchecked scope, failures, recovery residue, stale projections, and unrelated work left untouched. Stop after one apply and targeted verification cycle. New findings require new selection.

[load.complete] directives-audit.housekeeping
