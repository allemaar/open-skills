# plan-evolve

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A feature, document or process has shipped and you want to plan its next iteration. Start from the actual current state, retain what still serves the purpose and identify which compromises or new possibilities justify change.

The resulting plan distinguishes what is retained, changed and new, so the next version builds on the baseline rather than treating it as an empty project.

## Where it fits

Use this to plan the next version; plan-cleanup handles disposable remnants of completed execution.

**Family:** Planning & execution. **Subagents:** No subagent step prescribed.

## When to use it

- You want the next version of a target.
- An existing implementation or plan is the baseline.

## When not to use it

- You only want cleanup.

## How to use it

Start with a concrete request. For example:

```text
/plan-evolve Plan the next iteration of this dashboard from its current implementation. Preserve the reporting users rely on and identify what is new, changed or retained.
```

## Flow

1. Identify the baseline, using current state if no plan exists.
2. Examine compromises, gaps and new possibilities.
3. Retain an existing plan's format; for a target without a plan, use a clear phased format. Mark new, changed and retained elements.

## Common questions

**What if there is no previous plan?**

Use the current state as the baseline and identify the evidence used to establish it.

**Will the skill restructure my existing plan into phases?**

It preserves the existing plan's useful format and load-bearing decisions. A target without a plan gets a clear phased proposal; restructuring an existing plan needs a strong reason.

## It is working when

- The baseline and its relevant compromises are identified.
- The proposal keeps the existing plan structure, or supplies phases when no plan existed, and clearly marks retained, changed and new elements.

## Subagents

The skill does not require subagents.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A next-version plan.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/plan-evolve/SKILL.md](../../skills/plan-evolve/SKILL.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
