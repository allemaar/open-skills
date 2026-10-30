# Upgrade generated managers

Run from the inspected physical creator. Resolve the existing library and read its manager plus affected constituents. Preview `upgrade --library SKILLS`; the shared `library.json` holds generator version and managed-file baseline hashes, with original template bytes under `.library/generator-base`.

| Comparison | Action |
|---|---|
| Current equals incoming | Leave unchanged |
| Current equals baseline | Propose incoming version |
| Incoming equals baseline | Preserve customization |
| Both changed differently, or a template disappeared | Stop for a reviewed merge |

Verify stored generator-base bytes against their managed hashes; baseline drift blocks automated upgrade and requires ancestry recovery. Every overwritten baseline and the prior library.json are retained under the upgrade recovery tree. Show the exact file differences, migration requirements and shared impact. Apply only the reviewed upgrade with `--expected PLAN_DIGEST` from its preview. The digest binds the library, current/incoming hashes and `incomingDate`; changed inputs require a fresh preview. The helper refuses downgrades and batches containing conflicts, including missing managed files. It snapshots updated files, preserves unrelated files and rechecks current bytes. It never replaces the whole manager folder or updates teammates' machines.

The generated shared README is unmanaged after creation. Review it separately when setup guidance changes; a manager upgrade does not refresh it. For a retained `mutation.lock`, load the bundled [operation-specific recovery](../templates/manager/references/recovery.md), including the upgrade row. New mutations stay blocked until the exact state is inspected and resolved; do not clear a lock merely to retry.

For conflicts, prepare the full incoming manager outside discovery from the inspected creator's templates and scripts, using the preview's family, version and `incomingDate`. An isolated `init` with the same family is a convenient starting copy; align its rendered date and verify every incoming file hash against the preview before relying on it. Never guess incoming contents from hashes. Merge customizations into a separate candidate, preserving rules and required notices. Keep unchanged incoming originals for the new baselines.

Review all affected files as one upgrade. For a manual merge, the inspected creator exports `withMutation(options, 'manual-upgrade', callback)` and `recordRecovery(options, plan)`. Set `options.library` to the physical skills directory and `options.apply` to true. Keep the callback synchronous: under its shared/private locks, recompute the upgrade preview with `apply: false` and require its `planDigest` to match the approved preview. Before any source write, use `recordRecovery` for that digest, exact affected paths, expected hashes and preimage locations; retain a full manager/config/baseline preimage, recheck approved current bytes and use guarded writes. These exports provide locking and recovery retention, not merge or digest validation. If unavailable, keep the candidate private and report the blocker; approval alone does not authorize an unguarded write.

Within that transaction, verify the installed files, advance the corresponding baseline bytes and `managed` hashes to the inspected incoming originals, and set `generator.version` and `generator.date` to the reviewed values. Verify the complete resulting state before returning; a failure after recovery recording retains the locks and receipt for inspection. This explicit manual merge preserves custom files while making the reviewed incoming version their new ancestor. Re-run upgrade preview, inventory and local status; unresolved rows or missing resources stay blocked. There is no automatic conflict resolver or lock bypass.

Generator updates are offered on demand. No scheduled checks, silent downloads or automatic new-version execution are implied. A changed manager reaches teammates through their existing storage workflow; they reconcile their own installations when needed.
