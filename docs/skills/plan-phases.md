# plan-phases

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You have a flat plan that needs clear stopping points. Plan-phases groups existing work into dependency-ordered phases, gives each a deliverable and inserts observable verification gates while preserving original intent and content.

A safety prerequisite belongs before the action it protects; an outcome check belongs after it. If verify is unavailable, the objective condition still needs direct evidence, and an uncheckable prerequisite remains unresolved.

## Where it fits

Use it to restructure an existing plan. Plan-create builds a new plan; plan-deep-dive inspects a phased plan.

**Family:** Planning & execution. **Subagents:** No subagent step prescribed.

## When to use it

- A flat plan needs checkpoints.
- Original content must be preserved while sequencing it.

## When not to use it

- You need a plan created from scratch.

## How to use it

Start with a concrete request. For example:

```text
/plan-phases Restructure this migration plan into phases, including pre-action backup checks and post-migration verification.
```

## Flow

1. Locate the intended plan and preserve its content.
2. Group actions into ordered phases.
3. Add post-phase verification and pre-action safety gates; if verify is unavailable, use direct evidence for objective conditions and confirmation only for Handler-owned decisions.
4. Validate intent and preservation before protected replacement of the selected source; otherwise return the proposed rewrite inline. Read back and report the actual restructuring.

## Common questions

**What if the plan only exists in conversation?**

The complete proposed restructure is returned inline; the skill does not claim a file was saved.

## It is working when

- Each phase has ordered steps, a deliverable and a check that can fail; the change report identifies gates and reordered or split steps.

## Subagents

The restructuring does not prescribe subagents.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A restructured source plan or conversation block with explicit gates and a change summary.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/plan-phases/SKILL.md](../../skills/plan-phases/SKILL.md)
- [skills/plan-phases/protocol.yon](../../skills/plan-phases/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
