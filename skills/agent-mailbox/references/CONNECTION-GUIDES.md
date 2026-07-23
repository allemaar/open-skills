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
7. has a finite absolute deadline or maximum firing count, cadence, no-overlap guard, heartbeat, failure budget, observable result/log, cancellation path, and verified process or native-job cleanup;
8. retries a freshly incomplete final file only inside a declared bounded parse window and surfaces malformed files or conflict copies without silently deleting them;
9. runs a full gap reconciliation before readiness after every restart or re-arm; and
10. claims `LISTENING` only when detection, reconciliation, heartbeat, cancellation, deadline, and end-to-end task wake or re-entry have been proven. Otherwise it reports `PARKED`; a miss or inconsistent state reports `DEGRADED` until fresh evidence completes recovery.

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

Codex has two distinct construction patterns:

- **Active-turn Collab Window:** run a bounded observable tool poll or event watcher with a hard timeout below the remaining turn budget and periodic reconciliation counters. It may detect and handle work while the tool turn remains active. Shell stdout does not create a later Codex turn, so this pattern cannot justify post-turn `LISTENING`; report `PARKED` when the turn ends without another native wake mechanism.
- **Post-turn Scheduled Collab:** register the Codex App's native thread heartbeat or scheduled follow-up against the current task. Each firing performs one bounded whole-inbox reconciliation against durable dispositions and exits. Cap the firing count and absolute horizon, prevent overlap, record the result, and disable or delete the automation with verified cleanup at expiry.

Do not substitute a detached or hidden shell process for the thread heartbeat. Such a process can write a result file but cannot by itself re-enter an ended Codex turn. A heartbeat firing proves scheduled re-entry only, not OneDrive materialization or message existence.

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
| Run a hidden Codex PowerShell watcher after the turn ends | It may persist a result but cannot re-enter the task | Codex thread heartbeat or honest `PARKED` fallback |
| Use an unbounded persistent loop | No expiry, failure containment, or cleanup proof | Absolute deadline, maximum checks, failure budget, cancellation |
| Advance the cursor when a file is merely read | A crash can lose the reply, effect, or primer mutation | Persist terminal/quarantined disposition first, then advance |
| Copy a field loop as the canonical recipe | Field loops often omit durable state, startup reconciliation, bounds, or wake proof | Apply the common construction contract to the available runtime |
| Negotiate listener cadence with a peer | Local monitoring becomes availability traffic and can block real CTAs | Keep mode/cadence participant-local; request peer work through ordinary CTAs |

### Evidence boundary

An attributed bounded Claude Code field case reported that Monitor stdout can trigger another turn inside a live session and documented notification batching plus rate-limit auto-stop behavior, while also exposing missing durable cursor, startup reconciliation, horizon, heartbeat, and failure-budget controls in the field loop. A bounded Codex field case observed active-turn polling and clean exit, but not post-turn wake. These cases motivate the hardened blueprints; neither field loop is the canonical recipe. [`VALIDATION.md`](VALIDATION.md) carries the sanitized evidence labels.

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
