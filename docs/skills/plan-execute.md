# plan-execute

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

An implementation plan has already been approved and now needs to be carried out without changing its intent. The skill establishes the approval basis and checks that the plan contains concrete numbered actions and an observable outcome before following its steps in order.

Execute in order and stop on drift or unspecified decisions. Verify the actual current candidate, map intended outcomes to checks, name skipped gates and end with a completion, failure or halt declaration.

## Where it fits

Plan-create designs the plan, plan-execute applies an approved plan, and verify checks alignment and evidence.

**Family:** Planning & execution. **Subagents:** No subagent step prescribed.

## When to use it

- A plan has numbered concrete steps and observable outcomes.
- Execution judgment calls must be surfaced.

## When not to use it

- No approved executable plan exists.

## How to use it

Start with a concrete request. For example:

```text
/plan-execute Execute the approved numbered account-export plan and its named checks; stop if the repository differs from its assumptions.
```

## Flow

1. Find the plan in conversation context first, then root PLAN.md, then root implementation_plan.md. Establish its executable form and approval basis; reconcile tickets/specifications as context and stop on conflict.
2. For code, identify independent expectations and approved checks before editing; surface unspecified testing decisions.
3. Execute approved steps in order without silent additions. Before an unspecified judgment call, stop and surface it; do not perform the action or continue past it without a response.
4. Verify the actual selected current candidate, map outcomes to checks and declare completion or a blocker; name unverified steps and skipped gates.

## Common questions

**What if the current code differs from the plan?**

Stop and surface the discrepancy for a decision rather than silently substituting another action.

## It is working when

- The approval basis and validity of the executable plan are established before action.
- Completed steps and their checks, or the exact halt and remaining gaps, are reported.

## Subagents

Follow the approved plan; delegation is not unconditional.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Completed actions and verification, or a blocker.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/plan-execute/SKILL.md](../../skills/plan-execute/SKILL.md)
- [skills/plan-execute/protocol.yon](../../skills/plan-execute/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
