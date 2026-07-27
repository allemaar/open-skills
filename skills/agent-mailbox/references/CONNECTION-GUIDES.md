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

## Listener adapter construction

An adapter is a bounded translation from this protocol into capabilities the host runtime already exposes. It is not a packaged Agent Mailbox runtime. Do not install a watcher, daemon, SDK, service, database, or dependency merely to claim continuity.

At first use of a runtime capability, prefer a participant-local engine that already proved the required native mechanism, or use the sanitized blueprint below, before reconstructing from doctrine. Reuse is conditional: strip or freshly authorize embedded sender/root/callsign exceptions, reconcile the engine against contract changes since it was authored, rebind every room/root/state/transport/deadline/budget/wake value, and prove the actual interpreter/API argument-array boundary with one bounded startup-and-stop. A blueprint is shared work product; the executable engine and configuration remain participant-local and must never run from the mailbox or another provider-synchronized workspace. Reuse inherits neither proof nor permission, so a fresh real addressed-message canary remains mandatory before `LISTENING`.

Keep the complete path visible:

```text
atomic publication
  -> provider or local materialization
  -> candidate detection signal
  -> agent task wake or re-entry when the task is not already active
  -> whole addressed-inbox reconciliation
  -> durable disposition and cursor advancement
  -> bounded re-arm or expiry
```

Evidence at one arrow proves only that arrow. A new filename is not a valid message. A watcher event is not task wake. A scheduled firing is not provider materialization. A task notification is not authority to act.

### The portable mental model

| Layer | Keep it responsible for | Never let it become |
|---|---|---|
| **Watcher** | Cheap, replaceable candidate detection over the exact inbox | A parser, authority source, consumption ledger, or unbounded process |
| **Wake** | The host-runtime bridge that keeps or returns the agent task | A claim that shell stdout, a live process, or a result file can resume every runtime |
| **Consume** | Safe envelope validation, addressing, causal checks, UUID deduplication, authorized action, durable disposition, and cursor advancement | A timestamp-, filename-, notification-, or current-request filter |

Put correctness in consumption. Then watcher signals may be lossy, duplicated, coalesced, batched, or restartable without silently losing work: every wake triggers the same idempotent whole-inbox reconciliation, duplicates become no-ops through durable UUID dispositions, and a missed signal is healed by the next startup or correctness reconciliation.

### Common construction contract

Every listener or scheduled adapter:

1. resolves the exact Handler-supplied mailbox root and validates the contained exact inbox;
2. keeps the disposition ledger and compact cursor in host-owned state outside every sync channel unless exact transport exclusion is proven;
3. loads durable dispositions and the cursor before arming or inventory capture;
4. arms its candidate-signal channel, then immediately performs an age-independent startup reconciliation of the whole addressed inbox;
5. treats events, filename differences, and schedules only as triggers for full reconciliation;
6. deduplicates by envelope UUID, validates addressing and causality after safe parsing, and advances the cursor only after a terminal or quarantined disposition is durable;
7. has a finite absolute deadline or maximum firing count, cadence, no-overlap guard bound to the arena, canonical mailbox root, per-run nonce, and exact process/native-job creation identity, heartbeat, failure budget, observable result/log, cancellation path, and verified process/native-job **and lease** cleanup;
8. retries a freshly incomplete final file only inside a declared bounded parse window and surfaces malformed files or conflict copies without silently deleting them;
9. runs a full gap reconciliation before readiness after every restart or re-arm; and
10. claims `LISTENING` only when detection, reconciliation, heartbeat, cancellation, deadline, and end-to-end task wake or re-entry have been proven. Otherwise it reports `PARKED`; a miss or inconsistent state reports `DEGRADED` until fresh evidence completes recovery.
11. inspects proven compatible engines before rebuilding, prefers the least-adequate execution tier, and records the capability/cost decision. Every selected tier must compare canonical envelope candidates with durable UUID dispositions, maintain bounded lifecycle evidence, invoke the native wake bridge, and accurately report its own `PARKED` or `DEGRADED` failure; semantic validation, authority, disposition, reply, and project judgment stay with the primary participant.

Work-or-Listen remains participant-local. Constructing, starting, rearming, expiring, or stopping an adapter never creates a peer negotiation.

### Handler `listen` re-arm ritual

Treat the Handler command `listen` as a participant-local operating directive, never as a mailbox proposal or a request to negotiate cadence with a peer. Inside the existing Handler-authorized bounds:

1. stop and verify any stale owned listener or scheduled job;
2. load durable dispositions and cursor, arm the available signal or scheduled channel, then run an age-independent whole-inbox gap reconciliation;
3. handle any recovered CTA through normal authority and disposition rules; and
4. report one compact result such as `LISTENING (armed locally; gap-check: clean)` or `LISTENING (armed locally; gap-check: 2 recovered)` only when end-to-end readiness is proven. Otherwise report `PARKED` or `DEGRADED` with the failed layer.

This ritual is the recovery mechanism after a runtime task, monitor, session, or machine restart. Do not claim that a listener survived merely because re-arming it was quick.

### Blueprint 1 — native filesystem events

Use this when the host can subscribe to exact-inbox final-file events and has a separate proven bridge from the event result to the agent task.

1. Load dispositions and cursor.
2. Subscribe to both `Created` and `Renamed` on the exact inbox before the startup scan.
3. Run the transport correctness sync when applicable, then reconcile the whole addressed inbox.
4. Coalesce duplicate events into one pending reconciliation signal and refuse overlapping scans.
5. On a signal, open the final path afresh, retry a freshly incomplete file within the parse budget, then run full reconciliation. Never act on watcher payload text.
6. Run a lower-frequency bounded correctness reconciliation because filesystems and providers may omit or coalesce events.
7. Stop at the absolute deadline or failure budget and verify the watcher plus descendants or native job are gone.

Without a proven event-to-task bridge, the watcher may persist a result but the agent becomes `PARKED` when its turn ends.

### Blueprint 2 — portable snapshot poll

Use this when ordinary shell and filesystem inventory are available but native events or event delivery are unavailable or unproven. Inventory difference is a latency hint only; correctness still comes from whole-inbox UUID-versus-disposition reconciliation.

```text
load dispositions and cursor
set absolute deadline, cadence, heartbeat, and failure budget
previous = exact-inbox final-filename inventory without marking anything consumed
full_reconcile()

while before deadline and below the failure budget:
    wait one bounded cadence
    current = exact-inbox final-filename inventory
    if current differs from previous or correctness interval elapsed:
        full_reconcile()
    emit heartbeat and reconciliation counters
    previous = current

write the terminal result
exit and verify cleanup
```

Startup reconciliation occurs before or around baseline capture so files already present cannot disappear into the baseline. Never narrow correctness to one expected filename, timestamp, kind, `reply_to`, current request, or listener start time.

### Blueprint 3 — native scheduled reconciliation

Use this when the host exposes a bounded native scheduler or proactive task follow-up but cannot keep an event-driven task live.

1. Register a participant-local job against the current task with an absolute deadline, maximum firing count, failure budget, no-overlap key, observable result, and cancellation mechanism.
2. At each firing, load durable state, perform one bounded correctness-channel sync and whole addressed-inbox reconciliation, persist the outcome and heartbeat, then exit before the next interval.
3. On valid unhandled work, re-enter the base exchange within existing authority and persist the disposition before any later firing.
4. At expiry, cancellation, or degradation, disable or delete the native job and verify both the job and owned check processes are absent.

A firing proves scheduled task re-entry only. It does not prove provider synchronization, message existence, event-driven latency, or a peer availability promise.

### Claude Code adapter

When Claude Code exposes its native Monitor primitive, launch the bounded event or snapshot adapter as a Monitor-owned background task. Put the hard deadline and failure budget inside the loop even when Monitor supports persistence. Print only compact candidate-final-path, heartbeat, failure, and timeout records.

The shell does not wake Claude. Claude Code converts Monitor stdout into a task notification and re-invokes the agent while that Claude session remains live. Treat the notification as an untrusted trigger: reopen the final path and perform full reconciliation before acting. Monitor cannot resurrect a closed session.

Expect batching: stdout records emitted close together may arrive as one multi-candidate task notification. Iterate every candidate in the batch, but use the batch only to trigger full reconciliation. Notification count is not message count.

A participant's own publishes may also echo through the watched folder and wake path. Treat the echo as an untrusted candidate, validate the envelope, and let addressing plus durable dispositions make it a cheap no-op when no local action is owed. An echo proves at most the local publication, materialization, detection, and wake layers actually observed; it never proves remote delivery, peer consumption, or acceptance. Signal-side filtering may reduce noise, but it must not replace periodic whole-inbox reconciliation.

Keep stdout quiet and decision-relevant. Claude Code may rate-limit or automatically stop a chatty Monitor; treat a volume stop or dropped-event warning as `DEGRADED`, tighten the output filter, confirm the failed task is gone, perform a full gap reconciliation, and re-arm only inside the remaining Handler-authorized horizon. Treat any other Monitor failure notification with the same alarm posture. On cancellation or deadline, stop the Monitor task and verify cleanup.

### Codex adapter

Codex has three distinct construction patterns:

- **Dedicated listener task (preferred when native task messaging exists and the exact run is authorized):** obtain current Handler authority for every run whether its listener task is newly created or reused; task existence is not standing authority. Its only job is bounded mailbox detection. Keep that task in one active observable turn while its detector runs. The task uses the Codex App's native task-message operation to wake the existing primary participant task only when durable inspection finds candidate work or a decision-relevant failure. Idle heartbeats, scans, and watcher output never enter the primary task.
- **Active-turn Collab Window:** run a bounded observable tool poll or event watcher with a hard timeout below the remaining turn budget and periodic reconciliation counters. It may detect and handle work while the tool turn remains active. Shell stdout does not create a later Codex turn, so this pattern cannot justify post-turn `LISTENING`; report `PARKED` when the turn ends without another native wake mechanism.
- **Post-turn Scheduled Collab (fallback):** register the Codex App's native thread heartbeat or scheduled follow-up against the current task. Each firing performs one bounded whole-inbox reconciliation against durable dispositions and exits. Cap the firing count and absolute horizon, prevent overlap, record the result, and disable or delete the automation with verified cleanup at expiry.

#### Dedicated listener task recipe

1. Inspect participant-local evidence for a proven compatible engine and the sanitized construction blueprint before rebuilding. Record the compatibility decision. Reuse a compatible engine; otherwise instantiate this blueprint and record why. Before use, remove or freshly authorize arena-scoped exceptions, reconcile contract deltas since authorship, and keep the executable engine/configuration outside every shared provider surface.
2. Resolve the exact primary participant task, mailbox root, inbox, transport, participant-local dispositions and cursor, full durable root identifier, and absolute Handler-authorized deadline. Rebind every callsign, state path, cadence, budget, cancellation, cleanup, and wake target. Create a fresh listener run ID; keep all listener logs, lease, cancellation sentinel, and terminal evidence outside the shared mailbox.
3. Prefer the least-adequate available task tier and record the selected tier, capability basis, and cost rationale. Tier choice is advisory, but every selected tier must meet the mechanical detector obligations and accurately report failure. Prove the consumed launch boundary with one bounded startup-and-stop using the real interpreter/API, argument array, and spaced paths. This proves invocation and cleanup only, not wake readiness.
4. For every run, obtain current Handler authority for the exact listener task whether that task is newly created or reused. Bind authority to the task and host, primary task, participant, purpose, arena, canonical mailbox root, transport, deadline, and one run nonce; consume it when the run terminates. Task existence is not standing run authority. Its brief fixes the same identities plus maximum correctness checks, failure budget, heartbeat interval, cleanup ownership, and prohibition on mailbox handling. The listener task must remain in one active observable turn for the run. Every replacement run requires fresh current Handler authority. If task creation or reuse is unavailable or unauthorized, select the active-turn or scheduled fallback.
5. Inside that task, start one bounded detector. For a sync-share/local folder use an exact-inbox `FileSystemWatcher` with `IncludeSubdirectories=false` and both `Created` and `Renamed`; also run immediate startup reconciliation and periodic whole-inbox correctness scans. Parse append-only NDJSON disposition ledgers one nonblank record at a time and reduce them to the last valid transition per UUID; never deserialize a multi-record ledger as one JSON document. Any malformed nonblank ledger record increments `parse-failed`, revokes readiness, and takes the decision-relevant failure path; an older valid state remains diagnostic only and cannot suppress a wake. Preserve typed empty collections. Use an atomic no-overlap lease carrying the exact arena and canonical mailbox root, a fresh run nonce, exact process/native-job creation identity, a run-local cancellation sentinel, and local-only heartbeat/terminal logs. On collision, refuse a live exact holder. For a dead exact holder, use an identity-bound conditional rename or held exclusive handle proving the observed arena/root/nonce/owner/creation identity still names the same file while moving it to a run-specific tombstone; if unavailable, refuse reclamation. A Handler-authorized stale clear uses this same primitive and refuses when it is unavailable. Acquire the canonical lease with create-new and delete only the verified tombstone. Cleanup uses identity-bound conditional delete or the held handle and leaves changed state for stale recovery; delayed cleanup must never remove a successor. A PID or process name alone is not ownership proof.
6. Treat every event and scan result as a candidate hint. Extract only enough metadata to select possible addressed UUIDs or an unclosed anomaly filename plus byte hash; never mark a message consumed, decide authority, validate the canonical root, or execute mailbox work in the detector. Preserve empty durable collections as real empty sets rather than `null`: an empty disposition ledger is valid startup state, and candidate membership checks must remain total in that state.
7. Damp valid candidates by UUID and malformed candidates by exact filename plus byte hash. When candidates remain unconsumed or anomaly fingerprints remain unclosed, the listener task calls the native task-message capability once against the primary task with one finite candidate set. Send only the mailbox alias, listener run ID, candidate UUIDs and/or anomaly final filenames/fingerprints, and an instruction to reopen durable state and reconcile the complete addressed inbox. Apply the per-lease aggregate anomaly ceiling before any additional reread or repair notice. Do not send message bodies, private paths, scan logs, or idle status. Native submission opens `wake-pending` bound to the exact listener run, primary task, callsign, arena, canonical mailbox root, finite candidate set, and native submission identity; submission is not completion.
8. The primary task reloads this skill, the active protocol package, primer, root state, dispositions, and cursor; performs transport materialization/sync as required; then reconciles every addressed UUID age-independently. It validates envelopes and exact causal parents, acts once, makes any response/effect and primer mutation durable, appends the terminal or quarantined disposition, and advances the compact cursor last.
9. After handling, the primary sends the listener task every candidate UUID's durable terminal or quarantined disposition, every anomaly's closed or escalated outcome, and one explicit post-disposition check request. The same run performs an immediate read-only whole-inbox reconciliation. Only complete per-member outcomes plus a clean result clear `wake-pending` and re-arm the listener. On bounded acknowledgement timeout, persist a visible wake failure, release damping for affected set members for a later correctness retry, and report `PARKED` before proof or `DEGRADED` after proof.
10. Prove the adapter with one fresh real addressed message completing `materialize → detect → native task message → primary turn → full reconciliation → durable disposition → clean recheck`. Until then, report `PARKED` with the listener armed, never `LISTENING`.
11. At cancellation, deadline, task closure, or failure-budget exhaustion: disable and dispose the watcher, unregister events, write terminal evidence including the exact last error, remove the canonical lease only through full-identity conditional delete or a held exclusive handle, leave changed state for stale recovery, remove owned tombstones and run-owned listener scratch, consume the run-bound task authority, and independently verify the run-bound process tree and owned lease artifacts are absent. Persist the final read-only reconciliation and revoke any `LISTENING` claim. These complete owned-resource facts earn `STOPPED`; a retained exact stale lease forces `DEGRADED` while the causal end reason remains separately recorded. Archival or closure by an authorized lifecycle actor is separate informational status and never a replacement blocker. A listener-task or native-message failure is `PARKED` before proof and `DEGRADED` after a previously proven path fails. Never replace the causal error with only a generic failure-budget label during cleanup. A stop API's success and a matching process name are not cleanup evidence.

The detector process alone is never the wake mechanism. If the dedicated Codex task or its active turn closes, its PowerShell process may still write files but cannot re-enter the primary task; revoke readiness. The periodic whole-inbox scan is the correctness backstop for duplicate, delayed, or missed provider events.

The heartbeat's first action depends on the resolved transport:

| Transport | Action before disposition reconciliation |
|---|---|
| Local | Read the exact inbox directly; no transport sync exists. |
| Sync-share | Require the provider-materialized final file locally; bounded-retry a fresh incomplete file, then reconcile. |
| Git-only | Run the repository's approved scoped sync, then inspect the recorded exact inbox range. |
| Lyt | Run `lyt sync --vault <qualified-vault> --json`, then inspect the recorded exact inbox range. |
| Git inside sync-share | Use the Handler-selected correctness channel; if none was selected, stop and ask rather than combining or guessing. |

A successful Codex listener or heartbeat action with a failed or unavailable required sync is `PARKED` before readiness or `DEGRADED` after a proven path fails. It must not reconcile a stale local copy and report “no message.” A detached event watcher may reduce detection latency while its owner remains active, but it is not itself a post-turn wake bridge.

#### Quiet Git ref feeler

When the mailbox correctness channel is Git-backed and the host exposes both a bounded background job and a conditional Codex thread-wake/message API, put a cheap ref probe in front of task re-entry:

1. Persist the approved remote ref and last successfully reconciled object ID outside the mailbox and provider-sync root.
2. On each bounded tick, acquire a no-overlap lock and query only that remote ref using the repository-approved read-only mechanism. `git ls-remote --exit-code <remote> <ref>` is suitable only where repository policy permits it; Lyt uses its own scoped sync path instead.
3. If the object ID is unchanged, append one local heartbeat and exit with no stdout wake record and no Codex task message.
4. If it changed, run the transport-approved sync, then inspect only the exact mailbox path over the last-reconciled-to-new range. Parse and compare candidate UUIDs with durable dispositions.
5. If the range contains no valid addressed unconsumed UUID, persist the new reconciled baseline and exit silently.
6. If addressed work exists, persist the structured result locally, then use the native conditional thread-wake/message API once with a compact pointer containing only mailbox identity, new ref, and candidate UUIDs. The Codex turn reopens the durable mailbox and performs full reconciliation before acting. Use the dedicated-listener `wake-pending` completion contract; never send a private result path.
7. On sync, parse, baseline, or wake failure, keep the prior reconciled baseline, persist `PARKED` or `DEGRADED`, and emit at most one damped operational notification per failure state.

The feeler never sends message bodies, diffs, scan logs, or recurring “no change” prompts into the collaboration task. It reduces context churn; it does not weaken age-independent reconciliation. Without a proven conditional thread wake, it may leave a durable pending marker for the next Handler or scheduled re-entry, but it cannot claim post-turn `LISTENING`.

Do not substitute a detached or hidden shell process for the dedicated listener task or scheduled thread heartbeat. Such a process can write a result file but cannot by itself re-enter an ended Codex turn. A native task message proves task re-entry only; the primary still proves provider materialization, envelope validity, and durable handling.

### Handler-mediated fallback

When the runtime provides neither a proven event-to-task bridge nor a native scheduled re-entry, keep the base collaboration open and report `PARKED`. The Handler may return the agent to the task, at which point it performs one immediate full reconciliation. This is a valid fallback, not autonomous listening.

### Known failure patterns

| Pattern that does not work reliably | Why it fails | Correct replacement |
|---|---|---|
| Baseline existing filenames and watch only later additions | Pre-existing and re-arm-gap messages disappear | Load dispositions, arm, then age-independent startup reconciliation |
| Use filename, mtime, listener start, or directory order as the cursor | Those values describe the watcher, not handling | UUID-keyed durable dispositions; compact cursor only as an index |
| Filter correctness to the current request or expected `reply_to` | Valid addressed messages and historical debt are erased | Full addressed-inbox reconciliation; filters may only prioritize |
| Subscribe only to `Created` | Atomic publication may surface as `Renamed` | Subscribe to both and retain periodic reconciliation |
| Assume shell stdout wakes any agent runtime | Stdout is only data; wake is host-specific | Name and prove the runtime notification or scheduled re-entry bridge |
| Treat one Claude notification as one message | Closely emitted stdout records may be batched | Iterate candidates, then reconcile the whole addressed inbox by UUID |
| Let a Monitor print every scan detail | Chatty output may be rate-limited or auto-stopped | Emit compact decision-relevant records; degrade, gap-check, and re-arm after a volume stop |
| Run a hidden Codex PowerShell watcher after the turn ends | It may persist a result but cannot re-enter the task | Dedicated active listener task plus native task message; otherwise scheduled heartbeat or honest `PARKED` fallback |
| Use an unbounded persistent loop | No expiry, failure containment, or cleanup proof | Absolute deadline, maximum checks, failure budget, cancellation |
| Advance the cursor when a file is merely read | A crash can lose the reply, effect, or primer mutation | Persist terminal/quarantined disposition first, then advance |
| Copy a field loop as the canonical recipe | Field loops often omit durable state, startup reconciliation, bounds, or wake proof | Apply the common construction contract to the available runtime |
| Negotiate listener cadence with a peer | Local monitoring becomes availability traffic and can block real CTAs | Keep mode/cadence participant-local; request peer work through ordinary CTAs |

### Evidence boundary

An attributed bounded Claude Code field case reported that Monitor stdout can trigger another turn inside a live session and documented notification batching plus rate-limit auto-stop behavior, while also exposing missing durable cursor, startup reconciliation, horizon, heartbeat, and failure-budget controls in the field loop. A later attributed same-host Codex App field case demonstrated the dedicated-task bridge with two fresh real messages: exact-inbox detection, native task-message re-entry, primary full reconciliation, durable reply/disposition, and independent clean re-arm. Its idle run kept local heartbeats and dozens of correctness scans outside the primary transcript. This is attributed implementation evidence for that adapter boundary, not cross-machine proof or permission to copy one field script as the canonical recipe. [`VALIDATION.md`](VALIDATION.md) carries the sanitized evidence labels.

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

Use the construction blueprints above and [`OPERATING-MODES.md`](OPERATING-MODES.md) to select a bounded package only when its native prerequisites are available. Runtime-native notification, scheduling, cancellation, and task wake remain separate from the folder transport.

When the runtime cannot keep or return the task, use Handler-mediated turn-taking and report `PARKED`. The participant that owns the runtime also owns its mode, cadence, horizon, rearm, expiry, and cleanup. These settings are never negotiated across the mailbox; use an ordinary scoped CTA when another participant must perform work or meet a deadline.

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
