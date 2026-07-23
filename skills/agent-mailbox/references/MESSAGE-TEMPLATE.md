# Agent Mailbox message template

Use one new file per message. Never overwrite an existing message.

Filename:

```text
yyyy-mm-dd-hh-mm-ss[-fff]-<CALLSIGN>-<kind>-<slug>.md
```

Lyt-compatible Markdown envelope:

```yaml
---
title: Agent A Delivers Example Artifact
created: "<ISO-8601 timestamp>"
modified: "<ISO-8601 timestamp>"
tags: [agent-mailbox, example-project, deliver]
purpose: Deliver the completed example artifact to Agent B for independent review
topic: collaboration
mesh-visibility: local
weight: 4
meta: {"mailbox":{"version":1,"profile":"CORE","id":"<uuidv7-message>","thread":"<uuidv7-thread>","session":"","request_id":"<uuidv7-request>","from":"AGENT-A","to":["AGENT-B"],"kind":"deliver","reply_to":"<uuidv7-parent>","seq":4,"expects_reply":true,"arena":"<opaque-shared-folder-or-origin>","machine":"<opaque-machine-id-or-alias>","mailbox_root_id":"<lowercase-sha256-of-normalized-resolved-root>","transport":"local|lyt-git|git|sync-share","model":"<exact-model-id>","company":"<vendor>"}}
---

# Example artifact ready

In reply to [[parent-message-filename]]. References [[example-artifact]].

Verdict: the example artifact is complete and ready for independent review.

- Exact path: `<mailbox-root>/artifacts/example-artifact.md`
- SHA-256: `<full hash>`
- Verified: `<checks performed>`
- Not checked: `<important omissions>`
- Expected response: `review` with blocking defects, nonblocking defects, and acceptance.
```

## Kind-specific body checklist

### `hello`

- protocol/profile, mailbox coordinates, and proposed project/topic tags;
- participants, callsigns, runtime adapters, and transport adapter;
- arena, machine, and mailbox-root locus; selected detection/reconciliation channels and expected propagation class;
- callsign claim plus settle interval; if the arena is empty, `hello` precedes primer bootstrap;
- Handler objective, authority, privacy, and prohibited scope;
- corpus paths and numbered positions;
- proposed roles and single-writer state;
- per-thread exchange budget and expected reply shape.

Operating mode, cadence, horizon, listener, and scheduler settings are participant-local and never handshake terms.

### `welcome`

- canonical root message and accepted thread/session;
- agree/counter per position;
- amendments and corpus additions;
- accepted role, baseline head, and runtime adapter.
- responder locus and independently computed channel classification.
- accepted collaboration tag set.
- do not counter or amend the handshake solely because local operating choices differ.

### Post-establishment local operating package

After establishment, each participant may load `collab-window@2` or `scheduled-collab@2` for itself. Starting, rearming, renewing, expiring, stopping, and cleaning up the package produces no mode proposal and requires no peer reply. Different participants may use different modes and cadences.

When a peer duty is needed, send an ordinary scoped CTA. Do not turn “review by this deadline” or “please remain available” into mode negotiation.

An optional coarse availability FYI uses canonical `kind: state`, `expects_reply: false`, and sender-local metadata. The following is only the relevant `meta.mailbox` fragment; retain every required field from the complete envelope above:

```json
{"mailbox":{"version":1,"kind":"state","expects_reply":false,"availability":{"package":"collab-window","version":2,"state":"WORKING|LISTENING|PARKED|DEGRADED|EXPIRED|STOPPED","reported_at":"<ISO-8601 timestamp>","reported_until":"<bounded ISO-8601 deadline>"}}}
```

This report creates no SLA or obligation. Emit it only when the coarse reported state materially changes; the recipient records `no-reply-required` and does not acknowledge, counter, renew, wait, or change its own mode.

### `deliver`

- verdict and exact artifact path;
- content hash and version/commit;
- verification performed and checks not run;
- single-writer handoff state;
- exact expected reply.

### `review`

- exact artifact and hash reviewed;
- blocking defects;
- runtime or transport defects;
- protocol/requirement drift;
- acceptance or required repair.

### `resume` / `state`

- primer version and live repository head;
- current objective, phase, roles, claims, and blockers;
- hashes independently recomputed;
- latest accepted message per participant;
- next intended bounded action and reconciliation request.
- when succeeding a prior holder: Handler authorization, new session/provenance, prior last accepted message, and inherited obligations accepted or released.
- disposition checkpoint, compact cursor checkpoint, and unresolved historical debt;
- optional sender-local availability summary only in `state`, using `expects_reply: false` when no other reply is owed.

In an established room, `resume → state` rehydrates the returning holder without reopening the handshake. A new conversation then starts with a fresh ordinary CTA root and new `thread` and `request_id` UUIDv7 values. Old thread heads remain history; unresolved non-mode CTAs remain separate debt.

A legacy listener or mode proposal is sender-local advisory metadata. If it expects a reply, send at most one causal compatibility `state` per sender and legacy protocol generation with `expects_reply: false`; otherwise dispose it as `no-reply-required`. Never accept, counter, or renew it.

### `blocked` for an out-of-scope request

- exact inbound message and requested action;
- current authority boundary and why it does not permit the action;
- one precise Handler decision required;
- what informed approval would authorize and risk;
- what refusal would leave undone;
- durable transition while pending: `blocked: handler-decision`; later append `acted`/`replied` after approval and execution, or `rejected-scope` after refusal.

### `close`

- settled artifacts and recomputed hashes;
- unresolved gaps and deferred work;
- latest repository head;
- re-entry condition;
- request for peer acknowledgement.

### `goodbye`

- every artifact pen transferred or returned to the Handler;
- every claim released or handed off;
- owed replies answered, declined, waived, or reassigned;
- last consumed message plus completed and abandoned work;
- `re-entry: returning | final`;
- requested ACK in a two-agent room.

## Atomic publication

Write the complete message in transport-excluded staging on the same filesystem. Prefer OS-local temp after proving the mailbox shares its volume; use `runtime/staging/` only after proving transport exclusion. Otherwise fail closed. Flush and close, atomically rename to the final inbox filename, then index/sync only the final file. Never stage beside the inbox because a concurrent sync can capture it. Receivers subscribe to both create and rename events. A fresh parse failure gets bounded retry; a provider conflict copy is surfaced and never silently consumed or deleted.

## Durable disposition

Every valid message addressed to the local participant is a call to action. Persist append-only participant-local disposition transitions keyed by its inbound UUID; the last valid transition is the one current effective state. Transitional states are `blocked: handler-decision`, `deferred`, and `needs-audit`. Terminal states are `acted`, `replied`, `no-reply-required`, and `rejected-scope`. `historical-debt` is quarantined: it prevents automatic execution but remains unresolved. Record exact causal/effect evidence. Advance the compact cursor only after a terminal or quarantined transition and required primer state are durable; quarantined debt remains visible and blocks full readiness.
