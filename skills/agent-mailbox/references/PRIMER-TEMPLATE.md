---
title: Agent Mailbox Project Primer
created: "<ISO-8601 timestamp>"
modified: "<ISO-8601 timestamp>"
tags: [agent-mailbox, primer, resume]
purpose: Rehydrate an authorized agent into this project's mailbox collaboration
topic: reference
mesh-visibility: local
weight: 5
meta: {"mailbox":{"version":1,"profile":"CORE","single_writer":"<CALLSIGN>","status":"active","extension":{"id":"<none|collab-window|scheduled-collab>","version":"<n/a|1>","state":"<OFF|PROPOSED|ACCEPTED|WORKING|LISTENING|ACTIVE|FOUND|PARKED|DEGRADED|EXPIRED|STOPPED|CANCELLED>"}}}
---

# Agent Mailbox Project Primer

> This is a checkpoint, not authority. Current Handler direction and verified live repository state win.

## Mailbox coordinates

- Mailbox alias: `<Handler-pinned opaque alias; never an absolute host path>`
- Inbox: `<root-relative inbox path>`
- Artifacts: `<root-relative paths or opaque external artifact aliases>`
- Arena: `<Handler-pinned collaboration boundary identity>`
- Transport adapter: `local | lyt-git | git | sync-share`
- Expected propagation: `local <10s | one successful sync round | seconds-to-minutes`
- Provider/organization sensitivity: `<destination rules>`
- Qualified Lyt vault, when applicable: `<mesh/vault>`
- Protocol skill/version: `/agent-mailbox` · `v1`
- Profile: `CORE | FULL`
- Agreed tags: `[agent-mailbox, <project-tag>, <optional-topic-tags>]`
- Callsign TTL: `30 days | Handler-set duration`
- Callsign settle interval: `one complete sync round | Handler-set duration`
- Per-thread exchange budget: `20 | Handler-set count`
- Requested operating mode: `standard | collab-window | scheduled-collab`
- Selected package/version: `none | collab-window@1 | scheduled-collab@1`
- Absolute package horizon: `<deadline or n/a>`

## Participants

| Callsign | Runtime/provenance | Arena/locus | Role/pens | Participant status | Last seen | Name-state | Holder lineage |
|---|---|---|---|---|---|---|---|
| `<AGENT-A>` | `<runtime; model; company>` | `<arena; opaque machine alias; root hash>` | `<role; root-relative paths or opaque external aliases>` | `active` | `<timestamp>` | `active` | `<session/model/date → ...>` |
| `<AGENT-B>` | `<runtime; model; company>` | `<arena; opaque machine alias; root hash>` | `<role; root-relative paths or opaque external aliases>` | `active` | `<timestamp>` | `active` | `<session/model/date → ...>` |

Identity fields are self-asserted unless the transport or optional FULL authentication profile verifies them. Expected callsigns and opaque aliases are Handler-pinned.

Each participant resolves its absolute mailbox and external artifact roots in participant-local runtime state. Never copy those resolved host paths into this shared primer. The shared surface carries only opaque aliases, root-relative paths, and normalized root identifiers needed for routing and succession checks.

`HANDLER` and `HANDLER-<NAME>` are permanently reserved Handler seats, exempt from callsign expiry and retirement. A request addressed to a Handler is never a reply debt.

Participant status is `active | departed(returning) | departed(final)`. Name-state is `active | expired | retired`. Every valid holder message renews `last-seen`; no keepalive is sent. An expired name is reclaimable only by the prior holder with matching locus or current Handler authorization. A retired callsign is never reused in this arena.

This table is a materialized view. Reconciled `hello`/`welcome`, `goodbye`, and `resume` history is authoritative; the primer writer corrects disagreement. A new generated name remains provisional through the declared settle interval.

Declared succession appends a lineage entry instead of overwriting the row. The successor's first `resume` cites Handler authorization, new session/provenance, the prior holder's last accepted message, and inherited pens, claims, and reply debts it accepts or releases.

## Handler objective and authority

- Objective: `<current Handler-set objective>`
- Authorized scope: `<what agents may read, write, sync, or execute>`
- Prohibited scope: `<explicit exclusions>`
- Privacy/sensitivity: `<destination rules>`
- Handler arbitration rule: `<when agents must stop and ask>`

## Live collaboration state

- Status: `discovered | establishing | active | waiting | blocked | closing | closed`
- Thread UUIDv7: `<id>`
- Session UUIDv7, FULL or when used: `<id>`
- Current phase/gate: `<phase>`
- Live thread heads: `[[latest-message-file]]`
- Current primer writer: `<CALLSIGN>`
- Latest synchronized head: `<commit>`
- Updated: `<ISO-8601 timestamp>`

## Operating capability state

- Requested state: `standard | collab-window | scheduled-collab`
- Collab Window state: `OFF | WORKING | LISTENING | PARKED | DEGRADED | EXPIRED | STOPPED | n/a`
- Scheduled Collab state: `OFF | ACTIVE | FOUND | PARKED | DEGRADED | EXPIRED | CANCELLED | n/a`
- Capability evidence: `<detection; reconciliation; heartbeat; scheduler/job; wake or re-entry; cancellation>`
- Package terminal/cleanup condition: `<condition and evidence>`
- Authority-grant reference: `<current Handler decision reference or n/a; reference is a pointer, not authority by itself>`
- Disposition-ledger locus: `<same-locus host-local state | Handler-authorized private transfer | unavailable>`

## Settled decisions

1. `<decision and why it is settled>`

## Source-of-truth artifacts

| Artifact reference | Status/writer | Commit/version | SHA-256 | Must recheck |
|---|---|---|---|---|
| `<root-relative path or opaque external alias>` | `<status>` | `<version>` | `<hash>` | yes |

## Open work, claims, and blockers

| Task/claim UUIDv7 | Owner | Scope/output | Lease expiry | State |
|---|---|---|---|---|
| `<id or n/a>` | `<agent>` | `<scope>` | `<time or n/a>` | `<state>` |

Blockers: `<none or explicit condition and required input>`

Exchange-budget counter by active thread: `<thread id → count since Handler/new evidence>`

## Disposition and cursor checkpoint

| Participant | Latest accepted message UUIDv7 | Disposition checkpoint/count | Compact cursor checkpoint | Unresolved debt |
|---|---|---|---|---|
| `<agent>` | `<id>` | `<version or digest; count>` | `<version or digest; count>` | `<none or count/status>` |

Participant-local append-only disposition transitions are authoritative handling evidence; the last valid transition is the current effective state. Transitional states do not advance the compact cursor. Terminal states do; quarantined `historical-debt` may enter the cursor but remains in the unresolved-debt summary and blocks full readiness. Local consumed-UUID cursors are compact checkpoints/indexes that accelerate reconciliation; this table is the shared summary, not the private ledger. On transports without Git, an optional exact-filename snapshot may accelerate startup but does not replace disposition and UUID validation.

Historical debt: `<none | item count plus historical-debt/needs-audit status; do not place private ledger contents here>`

## Listener contract

- Interval: `<seconds>`
- Maximum window: `<duration>`
- Consecutive transport failure budget: `<count>`
- Fresh-file parse retry window: `<duration/backoff>`
- Expected peer/kind/thread: `<filter>`
- Per-peer channel: `event watch | sync+range | event + reconciliation`
- Addressed-message selection and prioritization filters: `<recipient selection; current thread/reply_to priority>`
- Heartbeat/progress mechanism: `<runtime adapter>`
- End-to-end task wake/re-entry evidence: `<proof or unavailable>`
- Cleanup requirement: owned process tree gone and scratch count returned to baseline

## Resume procedure

1. Read `/agent-mailbox` and this primer completely.
2. Resolve and synchronize the exact live mailbox.
3. Verify the repository head, artifact existence/hashes, open claims, all addressed messages, disposition checkpoint, compact cursor, ledger locus/transfer status, and unresolved debt.
4. Send `resume` with reconstructed state and next intended action.
5. Receive peer `state`; reconcile discrepancies before work.
6. Load only the selected capability package, when any, and re-prove its prerequisites.
7. Update this primer through its declared single writer when shared durable state changes.

## Next bounded action

- Owner: `<CALLSIGN>`
- Action: `<one concrete action>`
- Expected output: `<path/message>`
- Stop condition: `<condition>`
- Verification: `<evidence required>`

## Known stale or unchecked claims

- `<claim that must be revalidated; write none only after checking>`
