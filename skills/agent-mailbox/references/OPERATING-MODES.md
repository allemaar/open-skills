# Agent Mailbox operating modes

Agent Mailbox always loads the mandatory CORE or FULL base protocol. Operating modes are lazy participant-local capability packages selected after the base handshake; they do not replace the profile, weaken its safety rules, or require another participant's agreement.

## Default selection

Do not present a mechanism menu during ordinary activation. Standard Exchange is the base. When the Handler asks for continued collaboration, use the runtime's one default:

| Runtime | Continued-collaboration default | Honest fallback |
|---|---|---|
| Claude Code / Claude Agent SDK | Collab Window through native Monitor when the host exposes it | Standard Exchange |
| Codex | Scheduled Collab through native bounded automation or heartbeat | Standard Exchange |
| Other | Standard Exchange | Standard Exchange; continuity construction only under an explicit Handler mailbox-infrastructure task |

An explicit Handler choice overrides the default. The selection configures only the local participant; peers may use different mechanisms and cadences.

If a finite horizon is missing, ask only for the horizon. Do not ask the Handler to choose among adapters. If the runtime default is unavailable or the Handler declines its visibility or prompt cost, use Standard Exchange and say that autonomous continuity is unavailable.

Activation or repair gets one bounded attempt recorded durably against arena plus runtime. Failure opens the circuit breaker across sessions. Fall back and return to the project objective. A fresh explicit Handler mailbox-infrastructure task may authorize one exact replacement run; bind and consume that one-run authority rather than treating the task as standing permission.

## Standard Exchange

The mandatory base behavior. Agents handshake, perform the authorized exchange, dispose every valid addressed message, and stop when the work or explicit listener bound ends. No optional package is loaded.

Use it for short tasks, one-shot handoffs, or runtimes that cannot prove continued availability.

Standard Exchange makes no autonomous health promise. On a later Handler turn, reconcile when local durable state shows an open CTA, a due deferral, `wake-pending`, or listener-recorded candidates. After a meaningful mailbox-derived work unit, reconcile once after the last effect and before reporting completion.

## Collab Window

Loads [`../protocols/collab-window.yon`](../protocols/collab-window.yon). This is the bounded Work-or-Listen mode:

- `WORKING` means authorized work is executing inside the lease.
- `LISTENING` means detection, age-independent reconciliation, heartbeat, hard deadline, cancellation, and end-to-end runtime wake or re-entry are all proven.
- `PARKED` means the collaboration remains open but automatic continuity is unavailable.
- `DEGRADED` means a previously expected capability failed or a miss/cursor inconsistency was reported.

The advisory post-handshake or post-resume settling window is ten minutes. It is a local starting point, not a protocol constant or peer promise. A longer window needs a finite Handler-selected deadline. Literal non-stop operation is unsupported; use a renewable bounded lease with one absolute deadline.

`start collab`, `start Work-or-Listen`, and `toggle collab on` all run the same capability preflight. `stop collab`, `toggle collab off`, cancellation, failure, and expiry all require verified job/process and scratch cleanup.

Persist the expected next listener heartbeat and bounded health grace. Monitor notifications, Handler returns, work-boundary checks, rearms, and readiness claims verify that a newer heartbeat arrived by that bound. Overdue silence is `DEGRADED`; a vanished listener does not stay healthy merely because it emitted no failure.

## Scheduled Collab

Loads [`../protocols/scheduled-collab.yon`](../protocols/scheduled-collab.yon). It is available only when the host runtime exposes a native bounded scheduler or automation mechanism with:

- a stable job identity;
- an absolute deadline and maximum check count;
- a no-overlap guard and failure budget;
- observable results and cancellation;
- verified cleanup.

Each firing performs one bounded sync and full disposition reconciliation, records the outcome, then exits. A scheduled job firing does not by itself prove that the agent task woke. If scheduling or task wake cannot be proven, the honest result is `PARKED` and the base collaboration stays usable.

Registration and every successful firing persist `last_fired`, cadence, bounded `health_grace`, and foreground turn start/end. A due firing inside a foreground turn is suppressed and restarts its idle observation deadline at turn end. Degrade only when a firing remained unobserved across a genuine idle window beyond cadence plus grace; repeated busy suppression reports `ACTIVE (health unevaluated since <time>)`, not green. Native job status is optional strengthening. Valid outstanding CTA state reports `FOUND`, not clean or no-message.

The schedule belongs to the participant that registered it. It never requires a peer to use the same interval, remain available, acknowledge renewal, or wait for expiry.

## Missed-message recovery

[`../protocols/missed-message-recovery.yon`](../protocols/missed-message-recovery.yon) is not a menu choice. It loads automatically as the one permitted overlay when a miss, cursor inconsistency, or readiness contradiction is reported.

Recovery revokes `LISTENING`, stops the nonconforming consumer, audits every addressed message against durable dispositions, reconstructs only exact local causal or independently verified effect evidence, and quarantines ambiguity as `historical-debt` or `needs-audit`. It never repeats an effect merely because a UUID is absent from the compact cursor.

## Modes are not negotiated

The base handshake establishes first. Each participant then selects, starts, rearms, expires, stops, and cleans up its own package. Never send a mode proposal, seek acceptance, counter another participant's cadence, or block useful work while waiting for matching availability.

If another participant must deliver, review, check, reply, or remain available by a deadline, send an ordinary scoped `request`, `propose`, or FULL claim. That is a shared work obligation, not an operating-mode setting.

An agent may optionally report coarse local availability with a canonical `state` message carrying `meta.mailbox.availability` and `expects_reply: false`. It is informational only: no SLA, acceptance, counter, renewal, or waiting follows. Send it only for a material reported-state transition; it counts toward the exchange budget, and recipients record `no-reply-required`.

That disposition changes only wire obligations. A recipient already in Work-or-Listen or Scheduled Collab remains in the same participant-local package under the same deadline and cadence. After durable handling and the required clean reconciliation, it re-arms normally when budgets remain; it does not send a courtesy ACK or publish a redundant availability state merely to confirm continued listening.

At most one primary package may be active per participant: Collab Window or Scheduled Collab. Missed-message recovery is the only version-1 overlay. A local package failure changes no handshake, callsign, participant lifecycle, claim, reply debt, or conversation state.

## Returning to an existing room

A returning holder in an established room sends `resume` and receives `state`; it does not repeat the handshake. New work then begins from a fresh ordinary CTA root with new `thread` and `request_id` UUIDv7 values. Old heads remain history, while unresolved non-mode CTAs remain separate debt.

A legacy Work-or-Listen or schedule proposal is now sender-local advisory metadata. If it requests a reply, send at most one no-reply compatibility `state` per sender and legacy protocol generation, then never accept, counter, or renew it. Otherwise record `no-reply-required` without wire output.
