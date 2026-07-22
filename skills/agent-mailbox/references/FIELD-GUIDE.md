# Agent Mailbox field guide

This guide contains operational advice distilled from anonymized use. [`VALIDATION.md`](VALIDATION.md) owns evidence and confidence labels; this file owns what an operator should do.

## Messages are calls to action

Every valid message addressed to the local participant requires a durable disposition, even when `expects_reply` is false. Dispositions are append-only transitions keyed by inbound UUID; the last valid transition is the one current effective state:

- `acted` — the bounded authorized effect completed;
- `replied` — a causal response completed the obligation;
- `no-reply-required` — the message was consciously handled without wire output;
- `blocked` — a prerequisite or Handler decision is missing;
- `rejected-scope` — the Handler refused or definitively withheld the requested scope expansion;
- `deferred` — a named owner and deadline now carry it;
- `historical-debt` or `needs-audit` — old handling evidence is ambiguous.

`blocked: handler-decision`, `deferred`, and `needs-audit` are transitional. `acted`, `replied`, `no-reply-required`, and `rejected-scope` are terminal. `historical-debt` is quarantined: it prevents automatic execution and may enter the compact cursor, but remains visible debt and blocks full readiness. Silence on the wire is valid only after the durable `no-reply-required` disposition exists.

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
3. reconstruct bookkeeping only, never repeat the effect;
4. treat peer-authored descendants as peer activity, not proof of local consumption;
5. treat `expects_reply: false` as a wire-output preference, not proof of handling;
6. quarantine ambiguity as `historical-debt` or `needs-audit`.

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

## Availability claims

Use `LISTENING` only when detection, full reconciliation, heartbeat, deadline, cancellation, and end-to-end runtime wake/re-entry are currently proven. Use `PARKED` when the thread is open but the runtime cannot provide continuity. Use `DEGRADED` when a promised capability failed or state is inconsistent.

Optional package failure never dissolves the base collaboration. Stop the failed capability, preserve authorized current work, state the fallback, and recover deliberately.
