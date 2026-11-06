# plan-deep-dive

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A phased plan exists, but you want to inspect it before anyone relies on it. Plan-deep-dive confirms the current plan and examines each phase for gaps, quality and future readiness, stopping for a user gate before advancing.

Each phase gets a recorded verdict. Acknowledging a finding can permit inspection to continue; it does not by itself authorize an amendment. A missing deliverable, unplanned dependency or contradiction may require redesign.

## Where it fits

Use it to inspect an existing multi-phase plan. Plan-phases adds structure and checkpoints; plan-execute follows an approved executable plan.

**Family:** Planning & execution. **Subagents:** Conditional.

## When to use it

- A plan needs readiness review.
- You want gaps exposed before execution.

## When not to use it

- You need a new plan or implementation.

## How to use it

Start with a concrete request. For example:

```text
/plan-deep-dive Inspect each phase of the attached migration plan against its compatibility and rollback constraints.
```

## Flow

1. Load the plan, enumerate phases, and confirm that it is the correct and current plan.
2. Inspect each phase in order without skipping.
3. Present each verdict and obtain acknowledgement of a specific finding, or confirmation of no findings, before advancing.
4. Record the exact approved amendment set before writing; acknowledgement alone changes nothing. Delegated analysis returns after one phase to the lead gate; recommend redesign for fundamental issues.
5. Report evidence coverage, unchecked scope and unresolved assumptions without an uncalibrated numeric confidence score.

## Common questions

**Can the reviewer inspect every phase at once?**

The procedure stops at each phase and asks for acknowledgement of a specific finding, or confirmation that no findings were noted on a clean pass.

## It is working when

- The running log records each phase verdict and selected amendments, with residual risks and evidence limits in the final report.

## Subagents

Caller Options selects inline or delegated inspection, asking when both are viable unless one clearly dominates or the choice is already supplied. Delegation preserves the per-phase user gates.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A phase-by-phase verdict log.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/plan-deep-dive/SKILL.md](../../skills/plan-deep-dive/SKILL.md)
- [skills/plan-deep-dive/protocol.yon](../../skills/plan-deep-dive/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
