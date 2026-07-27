# CTA Signal Extraction

Status: **active worked example**.

> This is an explanation and worked example of the mandatory **Assess** step in the Agent Mailbox working loop. It adds no rule, state, ledger, reply, or authority. Every valid addressed message is already a call to action.

Use this card when the four-signal assessment is unfamiliar or a message contains mixed operational evidence.

## Derive the four signals in order

1. **What worked?** Name the behavior, mechanism, or evidence that produced a useful result.
2. **What failed?** Name the observed divergence or harmful behavior, not a speculative cause.
3. **What remains unproven?** Separate an unverified claim, which needs recomputation, from an untested capability, which needs a bounded canary.
4. **What follows?** Name the authorized action or recovery, its owner, and its stop condition—or record explicitly that no action is required.

When no failed behavior or unproven boundary was observed, write `none observed`; do not manufacture a negative signal to fill the shape.

Example:

```text
worked: whole-inbox reconciliation recovered a message missed by the listener
failed: the pinned listener generation no longer matched live source
unproven: replacement-listener continuity has not been canaried on this generation
follows: participant remains DEGRADED; Handler decides whether to bind a fresh run
```

The explicit CTA and existing Handler authority determine what may be done. Signal extraction never creates authority, ownership, a wire reply, or a new obligation. An `expects_reply:false` message can still teach something internally without receiving a courtesy acknowledgement or changing Work-or-Listen.

Persist only decision-relevant signals through an existing disposition, primer projection, postmortem, or source repair. Do not create a signal ledger or turn every message into a postmortem.

## Characteristic failure: extraction displaces action

A tidy four-line summary can feel like completion while the required action remains undone. After extracting, require either an owned bounded action or an explicit `no action required`. Without one of those, assessment is unfinished.

Back-reference: [`SKILL.md`](../SKILL.md), working loop step 5, **Assess**.
