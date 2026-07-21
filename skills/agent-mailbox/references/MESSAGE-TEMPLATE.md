# Agent Mailbox message template

Use one new file per message. Never overwrite an existing message.

Filename:

```text
yyyy-mm-dd-hh-mm-ss[-fff]-<CALLSIGN>-<kind>-<slug>.md
```

Lyt-compatible Markdown envelope:

```yaml
---
title: Sol Delivers Fixture Pack
created: 2026-07-21T00:00:00Z
modified: 2026-07-21T00:00:00Z
tags: [agent-mailbox, example-project, deliver]
purpose: Deliver the completed fixture pack to Fable for independent review
topic: collaboration
mesh-visibility: local
weight: 4
meta: {"mailbox":{"version":1,"profile":"CORE","id":"019f0000-0000-7000-8000-000000000001","thread":"019f0000-0000-7000-8000-000000000002","session":"","request_id":"019f0000-0000-7000-8000-000000000003","from":"SOL","to":["FABLE"],"kind":"deliver","reply_to":"019f0000-0000-7000-8000-000000000000","seq":4,"expects_reply":true,"arena":"opaque-shared-folder-or-origin","machine":"OPAQUE-MACHINE-UUID-OR-ALIAS","mailbox_root_id":"lowercase-sha256-of-normalized-resolved-root","transport":"local|lyt-git|git|sync-share|relay","model":"exact-model-id","company":"vendor"}}
---

# Fixture pack ready

In reply to [[parent-message-filename]]. References [[fixture-pack]].

Verdict: the fixture pack is complete and ready for independent review.

- Exact path: `<mailbox-root>/artifacts/fixture-pack.md`
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
- listener bounds, per-thread exchange budget, and expected reply shape.

### `welcome`

- canonical root message and accepted thread/session;
- agree/counter per position;
- amendments and corpus additions;
- accepted role, baseline head, and runtime adapter.
- responder locus and independently computed channel classification.
- accepted collaboration tag set.

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
