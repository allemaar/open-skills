# Agent Mailbox resource spine

> These resources never change Handler authority, message validity, causality, dispositions, whole-inbox reconciliation, or cursor semantics. They organize work over the existing mailbox; they are not another protocol.

Load only the operation needed now. Do not load every resource at handshake.

## What are you trying to do?

| Desired operation | Load |
|---|---|
| Bring a new agent into an existing room | [`ACTIVATION-PRIMER.md`](ACTIVATION-PRIMER.md) |
| Understand what a new message teaches or requires | [`CTA-SIGNAL-EXTRACTION.md`](CTA-SIGNAL-EXTRACTION.md) |
| Record roles, pens, phase, or current obligations | [`WORKING-AGREEMENT.md`](WORKING-AGREEMENT.md) |
| Choose or diagnose a collaboration arrangement | [`PATTERNS.md`](PATTERNS.md), then [`COMPOSITION.md`](COMPOSITION.md) only if the arrangement is failing |
| Ask for counsel, independent verification, a blind pass, or a convergence break | [`recipes/REVIEW.md`](recipes/REVIEW.md) |
| Transfer work or switch the driver | [`recipes/HANDOFF.md`](recipes/HANDOFF.md) |
| Dispatch bounded workers and consolidate their results | [`recipes/FAN-OUT-FAN-IN.md`](recipes/FAN-OUT-FAN-IN.md) |
| Repair representational protocol drift | Apply the canonical drift-repair rules in `SKILL.md` and `protocol.yon`; optionally load [`recipes/SELF-HEALING.md`](recipes/SELF-HEALING.md) as a field aid |
| Learn from a completed phase, miss, or failure | [`recipes/POSTMORTEM.md`](recipes/POSTMORTEM.md) |

## Resource lifecycle

- **Active:** available for ordinary recommendation because it has direct field use, current Handler direction, or both.
- **Provisional:** active but not yet dogfood-proven. Its card names the first-use promotion or demotion decision.
- **Experimental:** preserved inside the skill but omitted from this spine, ordinary loading, and automatic recommendation.

Promotion and demotion require current Handler direction and a deliberate source change. No resource changes maturity by assertion.

## Durable projection

When continuity matters, the primer may carry this optional reconstructible block:

```text
pattern: <preset or home-grown arrangement>
roles: <current pen holder and supporting roles>
pens: <artifact → holder>
phase: <current phase>
exit: <when this arrangement ends or changes>
owed: <participant → outstanding obligation>
```

The block is orientation, not authority. Live messages and current Handler direction win. A pattern change is an ordinary causal proposal plus acknowledgement; a pen transfer becomes active only through the existing acknowledged handoff.
