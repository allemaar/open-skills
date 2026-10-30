# orchestrate-mode

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Activates dispatch-only coordination of governed worker tasks.

**Family:** Orchestration & dispatch. **Subagents:** Conditional.

## When to use it

- The lead should coordinate instead of doing concrete work.
- The task can be safely partitioned.

## When not to use it

- You want the lead to continue direct implementation.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/orchestrate-mode Activate orchestrator mode for these tasks.
```

## Flow

1. Announce the mode and limits.
2. Determine whether worker workspaces are isolated or shared.
3. Assign bounded scopes and coordinate mutations safely.
4. Inspect and integrate results or stop if safe dispatch is unavailable.

## Subagents

Concrete work is dispatched; activation alone need not spawn immediately.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A persistent orchestration mode and inspected deliverables.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/orchestrate-mode/SKILL.md](../../skills/orchestrate-mode/SKILL.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
