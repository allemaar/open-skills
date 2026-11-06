# route-task

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You are sizing a task and need a reasoned capability recommendation before dispatch. Route-task scores scope, coupling, risk, uncertainty and verification, then derives an advisory capability band, effort volume and separate plan gate.

The rubric is experimental. It resolves bands against the live runtime roster, records drivers and actual resolution, and falls back to the session model when the roster is ambiguous. The score does not authorize dispatch or spending.

## Where it fits

Use it for advisory task sizing. Caller-options handles venue and isolation; budget-check assesses a pre-wave usage boundary.

**Family:** Orchestration & dispatch. **Subagents:** No subagent step prescribed.

## When to use it

- You are sizing a task for dispatch.
- You need to decide whether design remains open.

## When not to use it

- You need a budget gate or worker-isolation decision.

## How to use it

Start with a concrete request. For example:

```text
/route-task Size this database migration using the specification, affected components and required verification; state whether design is still open.
```

## Flow

1. Score five task properties using evidence.
2. Explain drivers and derive capability and volume.
3. Report the plan gate and resolve against the live runtime roster.
4. Treat the recommendation as advisory.
5. Use the defined local inline card when no configured sink exists, including did-not-use decisions and unknown observations.

## Common questions

**Does a high score automatically require a plan?**

No. The plan gate depends on unresolved design or a plan requirement, independently of the score.

## It is working when

- The routing record contains evidence-based axis drivers, derived tuple, plan-gate result and actual runtime resolution or unknown.

## Subagents

The rubric recommends but does not dispatch.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

An advisory routing record and plan-gate result.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/route-task/SKILL.md](../../skills/route-task/SKILL.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
