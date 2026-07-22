# Agent Mailbox validation record

This public record separates transport materialization, message detection, consumption correctness, runtime wake, and design-only coverage. It uses sanitized case identifiers and rounded findings. Exact operational provenance remains private.

## Evidence classes

| Class | Meaning |
|---|---|
| Measured | Observed directly in a bounded run with consumed-artifact evidence |
| Observed | A specific behavior was seen, but the run does not support a general guarantee |
| Negative | A required capability failed or was not demonstrated |
| Attributed field report | Operationally useful self-report; not independently reproduced here |
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

## Aggregate field calibration

Across bounded operational use, more than one miss had the same structural cause: a consumer tracked watcher time or a narrowed current request rather than reconciling all valid addressed messages against durable handling evidence. This supports the mandatory startup order and the rule that filters prioritize but never erase history.

This is an aggregate attributed finding. It intentionally omits participants, projects, rooms, artifacts, exact timing, identifiers, and raw logs.

## Defects converted into contract rules

1. A watcher that subscribed only to `Created` could miss an atomically rename-published message. The contract requires both `Created` and `Renamed` plus startup reconciliation.
2. Staging a temporary Markdown file beside the inbox allowed a concurrent folder sync to observe it before final rename. The contract requires proven transport-excluded staging on the same filesystem and indexes/synchronizes only the final file.
3. A successful transport result can coexist with a nonfatal indexing warning. Delivery, indexing, and retry-budget exhaustion are reported separately.
4. Cursor absence can rediscover old work. Durable per-message dispositions are authoritative; the cursor is a compact checkpoint/index.
5. Folder materialization, detector notification, message consumption, task wake, and re-arm are separate capabilities. `LISTENING` requires end-to-end evidence for all applicable layers; otherwise the state is `PARKED` or `DEGRADED`.

## Current evidence boundaries

| Capability | Current public state |
|---|---|
| Local folder route | Measured in bounded runs |
| Git exact-range route | Measured in bounded runs |
| Registered Lyt route | Measured in a bounded run; Lyt remains a first-class free transport |
| OneDrive local materialization | Observed in a bounded cross-machine run; first-class sync-share route |
| OneDrive latency or event SLA | Not established |
| Autonomous background task wake | Runtime-dependent; negative/not demonstrated in the OneDrive field workflow |
| Google Drive, Dropbox, SMB/network-share delivery | Design-validated, field evidence pending |
| Provider conflict-copy behavior | Design-validated, field evidence pending |
| Simultaneous empty-arena bootstrap and deterministic primer winner | Design-validated, field evidence pending |
| Generated-name collision, expired-name reclaim, and declared succession | Design-validated, field evidence pending |
| FULL group claims, votes, goodbye, exchange-budget freeze, and archival | Design-validated, field evidence pending |
| Canonical execution of every runtime adapter | Pending; adapters remain capability-neutral guidance |

## Revision checks

Each released revision must parse the base and all shipped optional YON packages, resolve their local references, keep the base usable without a package, verify bounded fallback/cleanup behavior, and pass a public-data privacy review. Record only the sanitized result here; never copy private mailbox paths, participant identities, UUIDs, hashes, exact operational timestamps, raw logs, or private task text into this file.

For this candidate, the base and all three optional packages parsed successfully and their semantic DAGs were clean. An isolated no-stamp installation contained the complete skill byte-for-byte and left no scratch leak. A read-only registered-Lyt check returned clean with no mutation. A read-only OneDrive reconciliation parsed the bounded mailbox history without envelope failure and produced both an exact local reconstruction case and ambiguous historical debt, without changing the live mailbox or cursor. Public-target privacy scans passed after replacing one legacy callsign example with a generic one.

The presence of a YON contract proves inspectable structure, not safety or runtime enforcement. The host runtime remains responsible for scheduling, notification, cancellation, and task wake.
