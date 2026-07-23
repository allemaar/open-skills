# Agent Mailbox validation record

This public record separates transport materialization, message detection, consumption correctness, runtime wake, and design-only coverage. It uses sanitized case identifiers and rounded findings. Exact operational provenance remains private.

## Evidence classes

| Class | Meaning |
|---|---|
| Measured | Observed directly in a bounded run with consumed-artifact evidence |
| Observed | A specific behavior was seen, but the run does not support a general guarantee |
| Negative | A required capability failed or was not demonstrated |
| Attributed field report | Operationally useful self-report; not independently reproduced here |
| Capability-confirmed | A named host mechanism was inspected in a current runtime; no complete mailbox flow is implied |
| Design-validated | The written contract covers the case; no consumed field run yet |
| Pending | Neither field evidence nor sufficient design evidence supports a stronger claim |

## Sanitized measured and observed cases

| Case | Route/capability | Public evidence | Conclusion |
|---|---|---|---|
| `AMB-LOCAL-A` | Exact local-folder detection | Two bounded runtime paths observed atomic-rename publication through exact-inbox monitoring. One detection was subsecond; the other was within a few seconds. No false detection appeared in either bounded observation. | Measured for those runs; not a universal latency guarantee |
| `AMB-GIT-A` | Git exact-range reconciliation | Two bounded cross-runtime runs found the exact new inbox path from a pinned baseline-to-head range within ten seconds of the recorded publication boundary, with no false detection in the observation windows. | Measured for those runs |
| `AMB-LYT-A` | Registered Lyt vault | A bounded run used scoped Lyt synchronization and exact inbox-range reconciliation to deliver and detect a message. Transient index contention was reported separately from the successful structured sync/delivery result. | Measured route viability; no broad latency guarantee |
| `AMB-ONEDRIVE-A` | OneDrive cross-machine materialization | A message published on one machine materialized in the other machine's declared mailbox within roughly two minutes. | Observed working sync-share transport for that run |
| `AMB-ONEDRIVE-B` | Listener lifecycle and task wake | In the same bounded field workflow, automatic listener re-entry/re-arm was not demonstrated. Folder materialization did not prove that the agent task woke, and provider event omission was not isolated as the cause. | Negative for end-to-end `LISTENING`; provider-wide event reliability remains unknown |
| `AMB-CURSOR-A` | Disposition/cursor integrity | A bounded history containing dozens of Markdown messages parsed without envelope failure. Several historical message UUIDs were absent from one participant's compact cursor. Only exact locally authored causal evidence could reconstruct handling; peer-authored descendants and `expects_reply: false` did not prove local consumption. | Observed cursor incompleteness; ambiguous history must be quarantined, not executed again |
| `AMB-MODE-A` | Work-or-Listen interpretation | In an attributed bounded field incident, two established participants repeatedly proposed, crossed, accepted, expired, and renewed availability windows because participant-local monitoring was interpreted as a bilateral commitment. Useful product traffic was already present while availability traffic accumulated. | Attributed field report; operating mode and cadence must be unilateral, while actual peer duties use ordinary CTAs |
| `AMB-ROOM-A` | Existing room with a new conversation | The same attributed incident reused an established room containing prior-protocol messages. Rehydration, legacy mode traffic, and a new work request were represented too closely, making old availability heads compete with current work. | Attributed field report; use `resume → state`, then a fresh CTA root with new conversation identifiers and separate legacy debt |
| `AMB-CLAUDE-A` | Claude Code Monitor wake | An attributed bounded field case used a Monitor-owned snapshot loop whose stdout caused another agent turn while the Claude session remained live. Closely emitted records could batch into one notification, and chatty monitors were subject to rate limiting or automatic stop. Restart recovery required a Handler-triggered re-arm plus a gap check; it was not autonomous persistence. The loop had no durable cursor, skipped startup history into its baseline, and lacked a hard horizon, heartbeat, and explicit failure budget. | Attributed field report for live-session Monitor wake; notification count is not message count, volume stops require degradation and gap reconciliation, and the field loop cannot resurrect a closed session |
| `AMB-CODEX-A` | Codex active-turn polling | A bounded PowerShell poll inside an active tool turn detected a cross-machine response within roughly two minutes, emitted periodic heartbeats, and exited at the match. Shell output did not establish post-turn wake. | Observed active-turn polling for that run; not evidence for post-turn `LISTENING` |
| `AMB-CODEX-SCHED-A` | Codex scheduled re-entry | A disposable native thread heartbeat re-entered the originating task, loaded durable mailbox state, scanned the whole synthetic addressed inbox, persisted one new terminal disposition before cursor advancement, recorded zero parse failures, and removed its own schedule. | Observed one bounded scheduled re-entry and reconciliation with verified automation cleanup; not evidence for provider materialization or event-driven latency |
| `AMB-LISTENER-POLL-A` | Portable snapshot construction | A bounded synthetic run reconciled one addressed message that existed before inventory capture and one later atomically published message. Both UUIDs received durable dispositions before cursor advancement; the listener emitted heartbeats and exited cleanly. | Observed startup and inventory-signal behavior for the portable blueprint; not transport or post-turn wake evidence |
| `AMB-LISTENER-EVENT-A` | Native event construction | A bounded synthetic run armed an exact-inbox watcher before atomic publication, observed a `Created` event, reconciled the whole addressed inbox by UUID, persisted the new disposition and cursor entry, and verified watcher plus publisher-job cleanup. | Observed `Created`-signal behavior; `Renamed` was not exercised in this run, and no runtime re-entry claim follows |

## Aggregate field calibration

Across bounded operational use, more than one miss had the same structural cause: a consumer tracked watcher time or a narrowed current request rather than reconciling all valid addressed messages against durable handling evidence. This supports the mandatory startup order and the rule that filters prioritize but never erase history.

A separate attributed field incident showed that negotiating participant-local Work-or-Listen cadence can form a self-sustaining availability loop. Reusing a room with legacy mode proposals made the loop harder to distinguish from current product work. This supports unilateral local modes, informational no-reply availability state, and fresh conversation roots after resumption.

This is an aggregate attributed finding. It intentionally omits participants, projects, rooms, artifacts, exact timing, identifiers, and raw logs.

## Defects converted into contract rules

1. A watcher that subscribed only to `Created` could miss an atomically rename-published message. The contract requires both `Created` and `Renamed` plus startup reconciliation.
2. Staging a temporary Markdown file beside the inbox allowed a concurrent folder sync to observe it before final rename. The contract requires proven transport-excluded staging on the same filesystem and indexes/synchronizes only the final file.
3. A successful transport result can coexist with a nonfatal indexing warning. Delivery, indexing, and retry-budget exhaustion are reported separately.
4. Cursor absence can rediscover old work. Durable per-message dispositions are authoritative; the cursor is a compact checkpoint/index.
5. Folder materialization, detector notification, message consumption, task wake, and re-arm are separate capabilities. `LISTENING` requires end-to-end evidence for all applicable layers; otherwise the state is `PARKED` or `DEGRADED`.
6. Work-or-Listen cadence is not a shared contract. Each participant owns its mode, horizon, rearm, expiry, and cleanup; peer work is requested through ordinary scoped CTAs.
7. A reused room does not imply a reused conversation. Returning holders rehydrate with `resume → state`, then new work receives fresh `thread` and `request_id` UUIDv7 values; legacy mode proposals cannot restart negotiation.

## Current evidence boundaries

| Capability | Current public state |
|---|---|
| Local folder route | Measured in bounded runs |
| Git exact-range route | Measured in bounded runs |
| Registered Lyt route | Measured in a bounded run; Lyt remains a first-class free transport |
| OneDrive local materialization | Observed in a bounded cross-machine run; first-class sync-share route |
| OneDrive latency or event SLA | Not established |
| Autonomous background task wake | Runtime-dependent; negative/not demonstrated in the OneDrive field workflow |
| Claude Code Monitor wake | Attributed bounded field evidence inside a live session; closed-session resurrection is unavailable |
| Codex active-turn poll | Observed in a bounded run; ends with the active tool turn |
| Codex thread heartbeat | Observed for one bounded scheduled re-entry and whole-inbox reconciliation with verified schedule cleanup; provider materialization not exercised |
| Portable snapshot listener construction | Observed in a bounded synthetic run, including startup history and delayed atomic publication |
| Native filesystem event construction | `Created` observed in a bounded synthetic run; `Renamed` not exercised in that run |
| Google Drive, Dropbox, SMB/network-share delivery | Design-validated, field evidence pending |
| Provider conflict-copy behavior | Design-validated, field evidence pending |
| Simultaneous empty-arena bootstrap and deterministic primer winner | Design-validated, field evidence pending |
| Generated-name collision, expired-name reclaim, and declared succession | Design-validated, field evidence pending |
| FULL group claims, votes, goodbye, exchange-budget freeze, and archival | Design-validated, field evidence pending |
| Participant-local mode semantics and reused-room isolation | Design-validated and supported by an attributed field incident; clean post-correction field replication pending |
| Canonical execution of every runtime adapter | Pending; adapters remain capability-neutral guidance |

## Revision checks

Each released revision must parse the base and all shipped optional YON packages, resolve their local references, keep the base usable without a package, verify bounded fallback/cleanup behavior, and pass a public-data privacy review. Record only the sanitized result here; never copy private mailbox paths, participant identities, UUIDs, hashes, exact operational timestamps, raw logs, or private task text into this file.

The previously released layered-package candidate passed parser, semantic-DAG, isolated-install, registered-Lyt read-only, OneDrive read-only reconciliation, scratch, and public-target privacy checks. Each new revision must record its own sanitized verification result before release; previous evidence is not a substitute for checking changed semantics.

For the `1.6.2` candidate, the base and all three optional packages passed the public parser and semantic-DAG checks. Two fresh repository-read-only workers used one owned synthetic CORE mailbox with different local operating modes. The run produced exactly one no-reply availability notice, exactly one no-reply compatibility state for a seeded legacy mode proposal, no new mode proposal/counter/acceptance/renewal, and a fresh request root with a causal delivery whose artifact hash was independently recomputed. The bounded run stopped cleanly and its link-free temporary tree was removed after evidence capture. It did not test background `LISTENING`, atomic-rename publication, a real sync provider, or resumption from a known prior accepted message.

The presence of a YON contract proves inspectable structure, not safety or runtime enforcement. The host runtime remains responsible for scheduling, notification, cancellation, and task wake.
