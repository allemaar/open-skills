# Agent Mailbox operating modes

Agent Mailbox always loads the mandatory CORE or FULL base protocol. Operating modes are lazy capability packages selected after the base handshake; they do not replace the profile or weaken its safety rules.

## The short mode card

Present this only when continuity would materially help and the Handler has not already chosen a mode:

```text
1. Collab Window until <deadline> — recommended when another peer response is expected
2. Standard Exchange — finish the current work without continuity mode
3. Scheduled Collab until <deadline> — only when a native bounded scheduler exists
```

Skip the card when the Handler already said `start collab`, `start Work-or-Listen`, `schedule checks`, `stop collab`, or supplied a horizon. Skip it for an obvious one-shot exchange; mention availability only if it changes the outcome.

Unavailable modes are explained separately and are not offered as selectable. Ask one question, not a configuration interview.

## Standard Exchange

The mandatory base behavior. Agents handshake, perform the authorized exchange, dispose every valid addressed message, and stop when the work or explicit listener bound ends. No optional package is loaded.

Use it for short tasks, one-shot handoffs, or runtimes that cannot prove continued availability.

## Collab Window

Loads [`../protocols/collab-window.yon`](../protocols/collab-window.yon). This is the bounded Work-or-Listen mode:

- `WORKING` means authorized work is executing inside the lease.
- `LISTENING` means detection, age-independent reconciliation, heartbeat, hard deadline, cancellation, and end-to-end runtime wake or re-entry are all proven.
- `PARKED` means the collaboration remains open but automatic continuity is unavailable.
- `DEGRADED` means a previously expected capability failed or a miss/cursor inconsistency was reported.

The default post-handshake settling window is ten minutes. A longer window needs a finite Handler-selected deadline. Literal non-stop operation is unsupported; use a renewable bounded lease with one absolute deadline.

`start collab`, `start Work-or-Listen`, and `toggle collab on` all run the same capability preflight. `stop collab`, `toggle collab off`, cancellation, failure, and expiry all require verified job/process and scratch cleanup.

## Scheduled Collab

Loads [`../protocols/scheduled-collab.yon`](../protocols/scheduled-collab.yon). It is available only when the host runtime exposes a native bounded scheduler or automation mechanism with:

- a stable job identity;
- an absolute deadline and maximum check count;
- a no-overlap guard and failure budget;
- observable results and cancellation;
- verified cleanup.

Each firing performs one bounded sync and full disposition reconciliation, records the outcome, then exits. A scheduled job firing does not by itself prove that the agent task woke. If scheduling or task wake cannot be proven, the honest result is `PARKED` and the base collaboration stays usable.

## Missed-message recovery

[`../protocols/missed-message-recovery.yon`](../protocols/missed-message-recovery.yon) is not a menu choice. It loads automatically as the one permitted overlay when a miss, cursor inconsistency, or readiness contradiction is reported.

Recovery revokes `LISTENING`, stops the nonconforming consumer, audits every addressed message against durable dispositions, reconstructs only exact locally authored causal outcomes, and quarantines ambiguity as `historical-debt` or `needs-audit`. It never repeats an effect merely because a UUID is absent from the compact cursor.

## Package negotiation

The base handshake establishes first. When a package changes what peers rely on, propose its identifier, version, horizon, obligations, fallback, and terminal conditions in a causal message. Activate it only after acceptance.

An unsupported, rejected, or failed optional package blocks that capability only. The established base thread remains intact. Unknown extension metadata is ignored at the CORE v1 floor; unknown behavior is negotiated or reported `blocked`.

Exactly one primary package may be active: Collab Window or Scheduled Collab. Missed-message recovery is the only version-1 overlay.
