# plan-deep-dive

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Inspects a multi-phase plan one phase at a time.

**Family:** Planning & execution. **Subagents:** Conditional.

## When to use it

- A plan needs readiness review.
- You want gaps exposed before execution.

## When not to use it

- You need a new plan or implementation.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/plan-deep-dive Inspect each phase of the migration plan.
```

## Flow

1. Load the plan, enumerate phases, and confirm that it is the correct and current plan.
2. Inspect each phase in order without skipping.
3. Present each verdict and obtain acknowledgement of a specific finding, or confirmation of no findings, before advancing.
4. Record the exact approved amendment set before writing; acknowledgement alone changes nothing. Delegated analysis returns after one phase to the lead gate; recommend redesign for fundamental issues.
5. Report evidence coverage, unchecked scope and unresolved assumptions without an uncalibrated numeric confidence score.

## Subagents

Caller Options selects inline or delegated inspection, asking when both are viable unless one clearly dominates or the choice is already supplied. Delegation preserves the per-phase user gates.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A phase-by-phase verdict log.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/plan-deep-dive/SKILL.md](../../skills/plan-deep-dive/SKILL.md)
- [skills/plan-deep-dive/protocol.yon](../../skills/plan-deep-dive/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
