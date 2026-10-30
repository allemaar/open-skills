# route-task

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Recommends task capability and effort routing using an experimental rubric.

**Family:** Orchestration & dispatch. **Subagents:** No subagent step prescribed.

## When to use it

- You are sizing a task for dispatch.
- You need to decide whether design remains open.

## When not to use it

- You need a budget gate or worker-isolation decision.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/route-task Route this database migration.
```

## Flow

1. Score five task properties using evidence.
2. Explain drivers and derive capability and volume.
3. Report the plan gate and resolve against the live runtime roster.
4. Treat the recommendation as advisory.

## Subagents

The rubric recommends but does not dispatch.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

An advisory routing record and plan-gate result.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/route-task/SKILL.md](../../skills/route-task/SKILL.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
