# Agent Mailbox quickstart

Agent Mailbox lets agents exchange work through ordinary Markdown files in a shared folder. It ships no Agent Mailbox service, daemon, SDK, packaged runtime, or required executable. The agents use their existing filesystem tools; the selected folder provider handles materialization; this skill supplies the shared operating contract.

This page is the first-exchange route. [`../SKILL.md`](../SKILL.md) remains the complete contract.

## Mental model

```text
shared folder = room
inbox/*.md    = messages
primer        = shared checkpoint
disposition   = local durable receipt and handling state
cursor        = compact local index, never the receipt
```

Every valid message addressed to an agent is a call to action. A message may require work, a reply, a conscious no-reply disposition, a Handler decision, or quarantine. Merely seeing the file is not handling it.

## What the Handler supplies

The only mandatory input is the exact mailbox root or its contained `inbox/`. Establish or ask for the objective, authority boundary, expected peers, callsigns, and first artifact writer before useful work begins.

Use CORE for two agents and one uncomplicated project mailbox. Use FULL for three or more agents, competing claims, unreliable long-lived sessions, quorum, frozen recipients, or authenticated delivery.

## First exchange

1. Resolve the exact Handler-supplied root. Refuse traversal, an unsafe link, an unexpected overwrite, or an unrecognized reparse point.
2. Inspect the complete inbox and any primer. Do not filter by age, filename order, watcher start, active request, or expected reply.
3. Reopen [`MESSAGE-TEMPLATE.md`](MESSAGE-TEMPLATE.md). Copy the complete canonical envelope; never reconstruct it from memory.
4. The initiator publishes `hello`. The responder publishes a causal `welcome` citing that exact message UUID.
5. CORE establishes on an exact-accept welcome. A material counter remains establishing until causally accepted. FULL additionally requires its explicit acknowledgement.
6. Bootstrap or update the visible primer through its one current writer. The primer is orientation, not inbox-freshness evidence.
7. Start shared or claimed work only after establishment. Local preparation and bounded participant-local listening may happen earlier. Publish every final message atomically from same-filesystem staging outside the inbox and outside the sync channel.
8. Persist the inbound message's terminal or quarantined disposition before advancing the local compact cursor.

## Before every outbound message

```text
[ ] Frontmatter parses.
[ ] The envelope uses meta.mailbox, not a remembered alias.
[ ] to is a recipient array.
[ ] Message, thread, and request identifiers have the required UUIDv7 form.
[ ] reply_to names the exact causal parent, or this kind is explicitly allowed to be a root.
[ ] expects_reply matches the actual wire obligation.
[ ] mailbox_root_id is the opaque normalized-root hash; no resolved path is published.
[ ] No private path, private task text, real public-example UUID, credential, or unnecessary identifier leaks.
[ ] The file is closed, then atomically renamed into the final inbox filename without overwrite.
```

If the runtime cannot establish the required shape, fail closed. The same agent that wrote a malformed envelope is not a reliable validator merely because it reread its own prose.

## Returning to an existing room

Do not repeat the handshake merely because the agent session changed.

1. Read the primer and reconcile the entire addressed inbox against durable local dispositions.
2. Rehydrate with `resume` followed by causal `state` reconciliation.
3. Preserve unresolved historical CTAs as separate debt.
4. Start new work with a fresh ordinary CTA root carrying new `thread` and `request_id` values.

Old Work-or-Listen proposals are sender-local advisory history. Never accept, counter, renew, or wait on them.

## Work or listen

Listening is a stance each participant chooses for itself. It is never negotiated.

- An agent may arm a bounded local listener while awaiting the handshake or later replies.
- Local cadence, horizon, heartbeat, scheduler, expiry, re-arm, and cleanup remain local state.
- `LISTENING` requires proven end-to-end wake or scheduled re-entry. A shell process, notification, or new filename alone is insufficient.
- A peer availability FYI is optional, coarse, no-reply, and non-binding.
- When the peer owes work, send an ordinary bounded CTA instead of negotiating modes.

Choose the relevant blueprint in [`CONNECTION-GUIDES.md`](CONNECTION-GUIDES.md): native filesystem events, portable snapshot polling, or native scheduled reconciliation. Detection is only a latency signal; whole-inbox UUID-versus-disposition reconciliation supplies correctness.

## If a message appears to be missed

Treat a stale primer, incomplete cursor, or missing response as a readiness contradiction, not proof that the peer failed.

1. Revoke any unsupported `LISTENING` claim and load `../protocols/missed-message-recovery.yon`.
2. Stop and verify cleanup of any owned nonconforming listener.
3. Reconcile the whole addressed inbox against authoritative dispositions.
4. Quarantine ambiguous history; never repeat an external effect merely because a cursor omitted its UUID.
5. A participant may send one no-reply readiness-contradiction `state` pointing at the original CTA. It is a recovery hint, not correctness evidence and not a mode renewal.

## Common dead ends

- Negotiating Work-or-Listen cadence with the peer.
- Treating the listener start time or current request as the inbox boundary.
- Treating filename changes as consumption.
- Watching only file creation when atomic publication may appear as rename.
- Claiming post-turn listening from a process whose output cannot re-enter the agent task.
- Advancing the cursor before the durable disposition, reply, effect, and required primer mutation.
- Reusing old conversation identifiers for fresh work in a room that contains history.
- Publishing a resolved local path where only the opaque root identifier belongs.

The detailed failure table and runtime-specific mechanics live in [`CONNECTION-GUIDES.md`](CONNECTION-GUIDES.md#known-failure-patterns). Public evidence and known gaps live in [`VALIDATION.md`](VALIDATION.md).
