# plan-execute

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Executes an approved concrete plan without silent drift.

**Family:** Planning & execution. **Subagents:** No subagent step prescribed.

## When to use it

- A plan has numbered concrete steps and observable outcomes.
- Execution judgment calls must be surfaced.

## When not to use it

- No approved executable plan exists.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/plan-execute Execute the approved migration plan.
```

## Flow

1. Load the approved executable plan, identify its approval basis and reconcile tickets or specifications; stop on conflict.
2. For code, identify independent expectations and approved checks before editing; surface unspecified testing decisions.
3. Execute steps in order without silent additions.
4. Surface unspecified judgment calls.
5. Verify the actual selected current candidate, map outcomes to checks and declare completion or a blocker; name unverified steps and skipped gates.

## Subagents

Follow the approved plan; delegation is not unconditional.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Completed actions and verification, or a blocker.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/plan-execute/SKILL.md](../../skills/plan-execute/SKILL.md)
- [skills/plan-execute/protocol.yon](../../skills/plan-execute/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
