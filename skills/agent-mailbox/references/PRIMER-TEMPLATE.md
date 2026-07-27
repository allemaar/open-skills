---
title: Agent Mailbox Project Primer
created: "<ISO-8601 timestamp>"
modified: "<ISO-8601 timestamp>"
tags: [agent-mailbox, primer, resume]
purpose: Rehydrate an authorized agent into this project's mailbox collaboration
topic: reference
mesh-visibility: local
weight: 5
meta: {"mailbox":{"version":1,"profile":"CORE","single_writer":"<CALLSIGN>","status":"active","availability":{"<CALLSIGN>":{"package":"<none|collab-window|scheduled-collab>","version":"<n/a|2>","state":"<OFF|WORKING|LISTENING|ACTIVE|FOUND|PARKED|DEGRADED|EXPIRED|STOPPED|CANCELLED>","reported_at":"<ISO-8601 timestamp>","reported_until":"<bounded ISO-8601 deadline or n/a>"}}}}
---

# Agent Mailbox Project Primer

> This is a checkpoint, not authority. Current Handler direction and verified live repository state win.

## Mailbox coordinates

- Mailbox alias: `<Handler-pinned opaque alias; never an absolute host path>`
- Inbox: `<root-relative inbox path>`
- Participant workspaces: `workspace/<CALLSIGN>/{artifacts,scratch}`
- Legacy flat artifacts: `<absent | deprecated read-only compatibility source>`
- External artifacts: `<opaque external artifact aliases, when any>`
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

## Participants

| Callsign | Runtime/provenance | Arena/locus | Role/pens | Participant status | Last seen | Name-state | Holder lineage |
|---|---|---|---|---|---|---|---|
| `<AGENT-A>` | `<runtime; model; company>` | `<arena; opaque machine alias; root fingerprint prefix [display-only; truncated]>` | `<role; root-relative paths or opaque external aliases>` | `active` | `<timestamp>` | `active` | `<session/model/date → ...>` |
| `<AGENT-B>` | `<runtime; model; company>` | `<arena; opaque machine alias; root fingerprint prefix [display-only; truncated]>` | `<role; root-relative paths or opaque external aliases>` | `active` | `<timestamp>` | `active` | `<session/model/date → ...>` |

Identity fields are self-asserted unless the transport or optional FULL authentication profile verifies them. Expected callsigns and opaque aliases are Handler-pinned.

Each participant resolves its absolute mailbox and external artifact roots in participant-local runtime state. Never copy those resolved host paths or the full canonical `mailbox_root_id` into this shared primer. When a human-readable root fingerprint is useful, render one labelled prefix only, for example `65884639 [display-only; truncated]`; never render both prefix and suffix, and never use primer text to construct an outbound envelope. The full canonical value lives in participant-local durable state and every message envelope.

Each participant writes only under its own portable, validated `workspace/<CALLSIGN>/` tree. Peers may read but never write or repair there. `artifacts/` targets are create-once; `scratch/` is owner-mutable, disposable, never delivered or referenced, and still subject to the room's sensitivity/no-secrets rules. Workspace presence is not a CTA: delivery requires a causal inbox message with the workspace-relative path and full hash. Pen transfer creates an immutable continuation under the successor's workspace with a causal old-path/hash to new-path/hash mapping. Any legacy flat `artifacts/` directory remains read-only unless ownership is proved by causal messages, primer provenance, or current Handler direction, and must not remain a second active artifact home.

The primer is the declared mutable single-writer artifact, and that declared protocol pen is the exclusivity boundary. Its writer acquires a participant-local mutation lease bound to arena, root, writer, run nonce, and creation identity. While holding it, update through transport-excluded same-filesystem staging, flush/close, compare live preimage and lease identity, atomically replace, then verify final bytes, containment, target type, noncorruption, and absence of provider conflict copies. Conditionally release only the still-owned lease. The provider need not guarantee cross-writer exclusion; it must preserve the atomic replace without corruption and surface conflicts. This is not lock-free compare-and-swap. Append-only inbox messages never use this path. A stale primer is visible debt; a missing primer is a gate.

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
- Session UUIDv7, FULL or when used: `<id>`
- Current phase/gate: `<phase>`
- Current primer writer: `<CALLSIGN>`
- Latest synchronized head: `<commit>`
- Updated: `<ISO-8601 timestamp>`

| Conversation | Root CTA UUIDv7 | Live head | State | Unresolved predecessor debt |
|---|---|---|---|---|
| `<short label>` | `<fresh request/propose/claim id>` | `[[latest-message-file]]` | `active | waiting | blocked | closing | closed` | `<none or separate debt reference>` |

## Optional participant availability summaries

| Participant | Self-reported package | Coarse state | Reported at | Reported until |
|---|---|---|---|---|
| `<CALLSIGN>` | `none | collab-window@2 | scheduled-collab@2` | `OFF | WORKING | LISTENING | ACTIVE | FOUND | PARKED | DEGRADED | EXPIRED | STOPPED | CANCELLED` | `<timestamp>` | `<bounded timestamp or n/a>` |

These summaries are optional sender-local orientation, not verified capability, an SLA, a handshake term, or a peer obligation. Different participants may use different modes and cadences. Detailed interval, heartbeat, scheduler/job, process, failure-budget, wake, cancellation, and cleanup evidence remains participant-local.

Disposition-ledger locus by participant: `<same-locus host-local state | Handler-authorized private transfer | unavailable>`

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

## Resume procedure

1. Read `/agent-mailbox` and this primer completely.
2. Resolve and synchronize the exact live mailbox.
3. Before the first outbound message at a new local locus, create-new its local durable root binding from fresh path-validated recomputation. On later use require equality; a Handler-directed move uses the audited stop/validate-old-and-new/preserve/rebind/fresh-readiness transition. Verify expected peer roots against durable arena + callsign + machine-locus bindings. Pin every executed contract path as skill-root-relative slash form, ordinal-sort, encode lowercase `path<TAB>raw-byte-sha256<LF>` in UTF-8 without BOM, and use SHA-256 of those manifest bytes as generation. Then verify repository head, artifacts, claims, addressed messages, dispositions, cursor, ledger transfer, anomaly index, and debt. Unexplained local drift is `ROOT_ID_UNVERIFIED`; cross-machine peers are never compared to the local root.
4. If returning to an established room, send `resume` with reconstructed state and next intended action; use `hello` only for a genuinely new participant or unestablished room.
5. Receive peer `state`; reconcile discrepancies without reopening establishment.
6. Start a new conversation, when needed, with a fresh ordinary CTA root carrying new `thread` and `request_id` UUIDv7 values. Old heads remain history and unresolved non-mode CTAs remain separate debt.
7. Load only the participant-local capability package selected by this participant, when any, and re-prove its prerequisites without proposing or negotiating it.
8. Update this primer through its declared single writer when shared durable state changes. A local mode transition needs an update only when the participant elects to publish a coarse availability FYI.

## Next bounded action

- Owner: `<CALLSIGN>`
- Action: `<one concrete action>`
- Expected output: `<path/message>`
- Stop condition: `<condition>`
- Verification: `<evidence required>`

## Known stale or unchecked claims

- `<claim that must be revalidated; write none only after checking>`
