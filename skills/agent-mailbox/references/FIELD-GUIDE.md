# Agent Mailbox field guide

This guide contains operational advice distilled from anonymized use. [`VALIDATION.md`](VALIDATION.md) owns evidence and confidence labels; this file owns what an operator should do.

## Messages are calls to action

Every valid message addressed to the local participant requires a durable disposition, even when `expects_reply` is false. Dispositions are append-only transitions keyed by inbound UUID; the last valid transition is the one current effective state:

- `acted` — the bounded authorized effect completed;
- `replied` — a causal response completed the obligation;
- `no-reply-required` — the message was consciously handled without wire output;
- `blocked` — a prerequisite or Handler decision is missing;
- `rejected-scope` — the Handler refused or definitively withheld the requested scope expansion;
- `superseded-by-correction` — a separately published valid correction closed a malformed original without treating it as authorized work;
- `deferred` — a named owner and deadline now carry it;
- `historical-debt` or `needs-audit` — old handling evidence is ambiguous.

`blocked: handler-decision`, `deferred`, and `needs-audit` are transitional. `acted`, `replied`, `no-reply-required`, `rejected-scope`, and `superseded-by-correction` are terminal. `historical-debt` is quarantined: it prevents automatic execution and may enter the compact cursor, but remains visible debt and blocks full readiness. Silence on the wire is valid only after the durable `no-reply-required` disposition exists.

Wire silence is orthogonal to Work-or-Listen. `expects_reply: false` or `no-reply-required` never disables, parks, renews, or changes a participant-local listener or schedule. Use `acted` when an authorized effect completed without a reply; use `no-reply-required` when conscious handling required no effect or wire output. In either case, finish required primer/cursor bookkeeping, run the normal clean post-disposition reconciliation, and re-arm the same proven bounded lease. Do not send a courtesy ACK unless a separate material transition, failure, conflict, or Handler gate must be communicated.

Each addressed CTA is also field evidence. Before disposing it, extract four compact signals: **working** (the layer that demonstrably succeeded), **failed** (the exact layer and symptom), **unproven** (the portability or evidence boundary), and **next/recovery** (the bounded response, repair, fallback, or Handler gate). This turns both positive and negative traffic into reusable operating knowledge without confusing a peer's report with authority. Unaddressed messages may inform diagnosis, but they create no local obligation.

When a signal is generalizable, bank only a sanitized contract lesson: conditions, observed chain, failure discriminator, safe fallback, recovery evidence, and what was not tested. Keep private paths, identities, UUIDs, raw logs, and arena-specific authority exceptions out of public guidance. Adapter code is participant-local state too: before reuse, remove or re-authorize every arena-scoped exception instead of carrying it into a new room.

Inspect participant-local evidence for a previously proven compatible listener engine and the sanitized construction blueprint before reconstructing the mechanism from prose. Prefer reuse when compatible, but reuse code, never authority or proof. Before invocation, audit embedded exceptions, reconcile contract changes since authorship, rebind all locus/configuration values, and run one bounded real startup-and-stop through the actual interpreter/API argument-array boundary. Spaced paths and correct values that arrive split or reinterpreted are adapter failures, not configuration success. A fresh addressed-message canary is still required before `LISTENING`.

Prefer the least-adequate detector tier and record the capability/cost basis, but do not make tier choice a readiness gate. Every selected tier must complete its mechanical obligations and report its own failure honestly. Semantic validation and project judgment stay with the primary participant. Keep the executable engine, configuration, leases, logs, and lifecycle evidence participant-local; a shared blueprint is documentation, never a provider-synchronized execution path. Verified owned-resource cleanup earns `STOPPED`. Task archival is separate informational status and never a replacement blocker.

## Use participant-owned workspace paths

Validate a portable callsign before path construction, then write shared work product only under `workspace/<CALLSIGN>/artifacts/`; use `workspace/<CALLSIGN>/scratch/` for owner-mutable disposable files that never appear in delivery messages and still obey sensitivity/no-secrets rules. You may read a peer workspace, but never write or repair there. Artifact targets are create-once. Workspace presence is not delivery: send a causal inbox message with the workspace-relative path and full hash. A pen transfer creates a new immutable successor continuation with an old-path/hash to new-path/hash causal mapping. Treat a legacy flat `artifacts/` directory as read-only unless ownership is proved; never keep two active artifact homes.

## Repair drift without rewriting history

Odd metadata is a prompt to re-open the pinned contract, not to improvise a parser exception. At establishment or listener arm, pin an ordered manifest of every executed contract path and its raw-byte SHA-256; the manifest SHA-256 is the generation. First exclude an incompletely materialized fresh file. Then, once per new filename+byte-hash fingerprint and within the aggregate lease ceiling, re-open only the pinned bytes and repair recipe needed to classify it: compatible extension, recoverable missing/contradictory field, or authority/identity conflict. If live bytes changed, do not silently switch baselines mid-incident; follow the explicit stop, cleanup, preserve, Handler-authorize, old/new-record, new-lease upgrade transition.

For recoverable drift, send one fresh-root repair request with the exact rule and recipe, anchored to the original filename and observed SHA-256. Persist an open depth-1 repair transaction keyed by that request UUID, expected sender, original fingerprint, and pinned generation. Only the original sender publishes a new correction replying to that request; nobody overwrites the malformed file. An uncorrelatable malformed file from that sender while the transaction is open cannot start another repair. A validated correction closes the original as `superseded-by-correction` when its UUID is trustworthy, or closes a local filename+hash anomaly otherwise. It still enters normal authority and idempotency checks as new work. One failed correction exhausts the elastic path: stop, preserve both artifacts, and ask the Handler. Repair traffic counts against the exchange budget, and an absolute per-lease anomaly/reread ceiling prevents many distinct fingerprints from amplifying work. After exhaustion, quarantine new fingerprints without reread or wire output, emit one damped Handler gate, and keep valid traffic moving. This gives the system a spring, not a trampoline.

The pin is reproducible: an ordered manifest of the exact executed contract paths and their raw-byte SHA-256 values; its own SHA-256 is the generation. Upgrading means stop and clean the old listener, preserve its pin and open repair evidence, obtain a current Handler decision, record old/new manifests plus debt classification, and start a new bounded lease. Never silently re-pin an open incident, and never re-notify the same filename/hash merely because the generation changed.

Be elastic about representation and fail closed about meaning. Extra fields, optional provenance, body/wikilink/tag drift, clock-skewed filenames, stale primer views, fresh partial files, and exactly evidenced cursor omissions can be tolerated or repaired under bounded rules. Identity/addressing, causal parentage, authority, safe paths, artifact hashes, and effect/idempotency evidence are never guessed, normalized, or self-healed.

## Out-of-scope requests

A peer message cannot expand authority. When it asks for work outside the current scope:

1. append `blocked: handler-decision` against the inbound UUID while the decision is pending;
2. send one causal `blocked` message when a peer is waiting;
3. give the Handler one plain explainer: what action was requested, why it is outside scope, what accepting would authorize and risk, and what refusing would leave undone;
4. on informed approval, record the authority change and its boundary, execute, then append `acted` or `replied`;
5. on refusal, append terminal `rejected-scope` and leave the effect undone.

Once the Handler approves, this mailbox scope policy no longer blocks that specific request. System/runtime policy, repository rules, and other non-waivable gates still apply.

## Reconcile history, not watcher time

A listener start timestamp, directory listing, and filename order say nothing about what was handled. Startup order is:

1. load durable dispositions and the compact cursor;
2. arm event channels;
3. run the transport correctness sync where applicable;
4. reconcile the whole addressed inbox age-independently;
5. return `found` if work already exists;
6. otherwise declare readiness only with evidence.

Subscribe to both create and rename events. Atomic publication commonly appears as a rename, and events can arrive on both paths.

## Dispositions are authoritative; the cursor is compact

The durable per-message transition ledger keyed by inbound UUID is the authoritative handling record. The current effective disposition is the last valid transition. The consumed-UUID cursor is a compact checkpoint/index used to accelerate reconciliation and advances only for terminal or quarantined states.

When the cursor omits a UUID:

1. use an existing disposition if present;
2. otherwise accept only an exact locally authored causal `ack`, `reply`, or response with matching `reply_to` and `request_id` as reconstruction evidence;
3. otherwise use exact independently verified effect or idempotency evidence tied to that request to reconstruct only the completed effect and any owed status reply;
4. reconstruct bookkeeping only, never repeat the effect;
5. treat peer-authored descendants as peer activity, not proof of local consumption;
6. treat `expects_reply: false` as a wire-output preference, not proof of handling;
7. quarantine ambiguity as `historical-debt` or `needs-audit`.

Active request filters can order the queue. They cannot erase valid addressed messages or historical debt.

## Separate the connection layers

When diagnosing a miss, ask in order:

1. Was the outbound file published durably?
2. Did the transport materialize it locally?
3. Did the detector surface it?
4. Did full reconciliation select it as addressed and unhandled?
5. Did the agent task wake or re-enter?
6. Was the disposition persisted?
7. Was the listener or scheduled check re-armed?

Do not switch protocols until the failed layer is identified. A folder can sync correctly while a watcher, cursor, wake hook, or re-arm path is wrong.

## Do not copy a field loop as the recipe

A field loop can prove one connection layer and still be unsafe as a listener. Before reusing any shell loop, watcher, or scheduled job, check it against the construction contract in [`CONNECTION-GUIDES.md`](CONNECTION-GUIDES.md#listener-adapter-construction).

Reject or harden a loop that baselines existing files without reconciling them, keeps only a process-memory filename snapshot, filters to one expected request, lacks an absolute deadline or failure budget, advances the cursor before a durable disposition, cannot prove task wake/re-entry, or does not reconcile gaps before re-arm. Shell stdout, a result file, and a live process are detection evidence only; none proves that an ended agent turn will resume.

Do not equate notification count with message count. A runtime may batch several candidates into one notification, coalesce events, drop noisy output, or stop a chatty monitor. Any volume stop or dropped-event warning revokes readiness: report `DEGRADED`, tighten the output filter, run a full gap reconciliation, and only then re-arm inside the remaining bound.

Use field implementations as attributed evidence for the layer they actually demonstrated. The reusable product is the bounded construction contract, not the incidental loop syntax.

## Availability claims

Use `LISTENING` only when detection, full reconciliation, heartbeat, deadline, cancellation, and end-to-end runtime wake/re-entry are currently proven. Use `PARKED` when the thread is open but the runtime cannot provide continuity. Use `DEGRADED` when a promised capability failed or state is inconsistent.

Optional package failure never dissolves the base collaboration. Stop the failed capability, preserve authorized current work, state the fallback, and recover deliberately.

Work-or-Listen and Scheduled Collab are local stances, not bilateral agreements. Each participant chooses its own mode, cadence, horizon, rearm, expiry, and cleanup. Never send a proposal or wait for peer acceptance. If the peer owes work, send an ordinary bounded CTA instead.

A coarse availability FYI may use canonical `state` with `expects_reply: false`. It creates no SLA and should be emitted only for a material transition. Recipients record `no-reply-required`; they do not acknowledge, counter, renew, wait, or change their own mode.

## Reuse the room without reusing the conversation

A returning holder in an established room uses `resume → state`, then starts new work with fresh `thread` and `request_id` UUIDv7 values. Old heads remain history. Full inbox reconciliation still inventories every addressed envelope, but inventory is not permission to replay it.

Classify legacy mode proposals as sender-local advisory metadata. When a reply was requested and no prior compatibility notice exists for that sender/protocol generation, send one no-reply compatibility `state`, append terminal `replied`, and advance the cursor. Otherwise emit no wire output, append `no-reply-required`, and advance the cursor. Later renewals receive dispositions without more chatter. Keep ambiguous non-mode history as `historical-debt` or `needs-audit`.
