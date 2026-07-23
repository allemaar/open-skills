# Agent Mailbox connection guides

Agent Mailbox uses a folder transport the Handler already controls. It adds no mailbox server, daemon, database, SDK, or vendor-specific agent protocol.

Lyt (Link Your Think™) is a real, working, free first-class route. Agents can talk over a registered Lyt vault by exchanging the same append-only Markdown messages and using scoped Lyt synchronization plus exact reconciliation. OneDrive is also a first-class working sync-share route. Transport support does not imply that every host runtime can wake an agent task in the background.

## Capability matrix

| Route | Durable transport | Correctness reconciliation | Low-latency signal | Background task wake |
|---|---|---|---|---|
| Local folder | Same-filesystem files | Whole addressed inbox vs dispositions/cursor | Exact `Created` + `Renamed` events | Host-runtime capability |
| Git repository | Files plus commits | Approved sync plus exact inbox commit range | Optional exact local events | Host-runtime capability |
| Registered Lyt vault | Lyt-scoped sync plus Git-backed history | Structured Lyt result plus exact inbox range | Exact local events when same locus | Host-runtime capability |
| OneDrive sync-share | Provider-materialized local files | Whole local addressed inbox after provider sync | Exact local events with bounded parse retry | Host-runtime capability |
| Other sync-share or network folder | Provider/materialized files | Whole local addressed inbox | Provider/runtime dependent | Host-runtime capability |
| Handler-mediated | The selected folder route | Immediate check on each Handler turn | Handler returns the agent to the task | Handler-mediated |

Every route separates four facts: remote publication, local materialization, message detection/consumption, and task wake. Evidence for one is not evidence for the others.

## Local folder

1. Use the exact Handler-supplied mailbox root or inbox candidate.
2. Validate containment and reject path redirection.
3. Arm exact-inbox `Created` and `Renamed` events.
4. Reconcile all addressed messages against durable dispositions before declaring readiness.
5. Keep any listener finite, observable, cancellable, and leak-checked.

## Git repository

1. Use the repository's approved noninteractive sync procedure.
2. Record a verified baseline and exact inbox-relative path.
3. After sync, inspect the exact baseline-to-head range for that path.
4. Deduplicate event and commit-range detections by message UUID.
5. Fail closed on merge conflict, detached head, missing upstream, force-push need, or unrelated dirty-state ambiguity.

## Registered Lyt vault

1. Resolve the registered qualified vault with `lyt vault info --by-path <mailbox-path>`; never guess the vault.
2. Synchronize only with `lyt sync --vault <qualified-vault> --json`.
3. Publish the final message atomically, then index only that final relative path with `lyt capture --index-only <relative-path> --vault <qualified-vault>`.
4. Synchronize again and consume the structured Lyt result.
5. Use read-only Git history for the recorded baseline/head and exact inbox path range.
6. On the same locus, exact-inbox events may be the fast path, but periodic scoped Lyt sync and range reconciliation remain the correctness path.

Never use raw Git pull, fetch, commit, push, or remote mutation for Lyt vault synchronization. Lyt owns that lifecycle.

## OneDrive and other sync-share folders

1. Use the provider's normal local folder. Never manipulate its private database or force conflict resolution.
2. Validate the root, parents, and target before every write. For a Handler-selected Microsoft sync-share, allow only verified `IO_REPARSE_TAG_CLOUD`-family placeholders after canonical resolution proves the expected contained path. Symbolic links, junctions, mount points, name-surrogate tags, and unknown tags remain blocked.
3. Publish by atomic rename from a transport-excluded staging location on the same filesystem.
4. Watch exact final-file `Created` and `Renamed` events and retry a freshly incomplete file only within the declared bounded window.
5. Reconcile the whole addressed local inbox after provider materialization. Persist dispositions and the compact cursor in host-owned state outside the mailbox/provider sync root. An in-root location is allowed only when the adapter proves exclusion from every active transport channel; Git ignore does not exclude a directory from OneDrive.
6. Surface conflict copies, unexpected participants, stalled partial files, and provider sensitivity limits. Never delete a conflict copy silently.

One bounded OneDrive field case has demonstrated cross-machine local materialization. That does not establish a latency guarantee, provider-wide event reliability, or autonomous task wake. Use [`VALIDATION.md`](VALIDATION.md) for the exact public evidence boundary.

## Runtime monitoring and scheduled checks

Runtime-native notification, monitoring, scheduling, cancellation, and task wake are separate from the folder transport. Use [`OPERATING-MODES.md`](OPERATING-MODES.md) to select a bounded package only when its prerequisites are available.

When the runtime cannot keep a task reachable, use Handler-mediated turn-taking or report `PARKED`. Never claim a listener survives the process or session that owns it.

The participant that owns the runtime also owns its mode, cadence, horizon, rearm, expiry, and cleanup. These settings are never negotiated across the mailbox. Use an ordinary scoped CTA when another participant must perform work or meet a deadline.

## Participant succession and local state

A same-locus successor may reuse a disposition ledger only after declared succession and an exact owner/arena/root match. A cross-locus successor needs an explicit Handler-authorized private state transfer. Without one, reconcile shared causal evidence, mark missing local dispositions `DEGRADED: disposition-unavailable`, quarantine ambiguity as `historical-debt` or `needs-audit`, and do not claim `LISTENING`.

## When a message was missed

A Handler report that a message exists but was not detected is an incident, not a prompt to start a different blind watcher.

1. Set readiness to `DEGRADED` and stop the nonconforming owned listener/job.
2. Verify the process tree or native job is gone.
3. Identify which connection layer failed: materialization, event detection, full reconciliation, disposition/cursor integrity, task wake, or re-arm.
4. Load [`../protocols/missed-message-recovery.yon`](../protocols/missed-message-recovery.yon).
5. Reconcile the full addressed inbox age-independently. Current-request filters may prioritize; they may not erase history.
6. In a reused room, separate `resume → state` rehydration from new work: give the new CTA fresh `thread` and `request_id` values, keep old non-mode debt separate, and treat legacy mode proposals as non-negotiable sender-local advisory metadata.
7. Restore `LISTENING` only after one fresh real addressed message proves the complete path. Otherwise remain `PARKED` or `DEGRADED` and explain the missing capability.
