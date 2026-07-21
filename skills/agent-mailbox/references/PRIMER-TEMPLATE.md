---
title: Agent Mailbox Project Primer
created: 2026-07-21T00:00:00Z
modified: 2026-07-21T00:00:00Z
tags: [agent-mailbox, primer, resume]
purpose: Rehydrate an authorized agent into this project's mailbox collaboration
topic: reference
mesh-visibility: local
weight: 5
meta: {"mailbox":{"version":1,"profile":"CORE","single_writer":"<CALLSIGN>","status":"active"}}
---

# Agent Mailbox Project Primer

> This is a checkpoint, not authority. Current Handler direction and verified live repository state win.

## Mailbox coordinates

- Root: `<absolute path supplied by Handler>`
- Inbox: `<root-relative inbox path>`
- Artifacts: `<root-relative path or exact external roots>`
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
| `<AGENT-A>` | `<runtime; model; company>` | `<arena; machine; root hash>` | `<role; paths>` | `active` | `<timestamp>` | `active` | `<session/model/date → ...>` |
| `<AGENT-B>` | `<runtime; model; company>` | `<arena; machine; root hash>` | `<role; paths>` | `active` | `<timestamp>` | `active` | `<session/model/date → ...>` |

Identity fields are self-asserted unless the transport or optional FULL authentication profile verifies them. Expected callsigns and opaque aliases are Handler-pinned.

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

## Settled decisions

1. `<decision and why it is settled>`

## Source-of-truth artifacts

| Artifact | Status/writer | Commit/version | SHA-256 | Must recheck |
|---|---|---|---|---|
| `<exact path>` | `<status>` | `<version>` | `<hash>` | yes |

## Open work, claims, and blockers

| Task/claim UUIDv7 | Owner | Scope/output | Lease expiry | State |
|---|---|---|---|---|
| `<id or n/a>` | `<agent>` | `<scope>` | `<time or n/a>` | `<state>` |

Blockers: `<none or explicit condition and required input>`

Exchange-budget counter by active thread: `<thread id → count since Handler/new evidence>`

## Mailbox cursor

| Participant | Latest accepted message UUIDv7 | Exact path | Result |
|---|---|---|---|
| `<agent>` | `<id>` | `<path>` | `<consumed outcome>` |

Local gitignored consumed-UUID cursors accelerate consumption; this table is the durable shared checkpoint. On transports without Git, an optional exact-filename snapshot may accelerate startup but does not replace UUID validation.

## Listener contract

- Interval: `<seconds>`
- Maximum window: `<duration>`
- Consecutive transport failure budget: `<count>`
- Fresh-file parse retry window: `<duration/backoff>`
- Expected peer/kind/thread: `<filter>`
- Per-peer channel: `event watch | sync+range | event + reconciliation`
- Heartbeat/progress mechanism: `<runtime adapter>`
- Cleanup requirement: owned process tree gone and scratch count returned to baseline

## Resume procedure

1. Read `/agent-mailbox` and this primer completely.
2. Resolve and synchronize the exact live mailbox.
3. Verify the repository head, artifact existence/hashes, open claims, and latest messages.
4. Send `resume` with reconstructed state and next intended action.
5. Receive peer `state`; reconcile discrepancies before work.
6. Update this primer through its declared single writer when shared durable state changes.

## Next bounded action

- Owner: `<CALLSIGN>`
- Action: `<one concrete action>`
- Expected output: `<path/message>`
- Stop condition: `<condition>`
- Verification: `<evidence required>`

## Known stale or unchecked claims

- `<claim that must be revalidated; write none only after checking>`
