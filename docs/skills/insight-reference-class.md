# insight-reference-class

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A schedule or cost estimate looks plausible from inside the project, but you want to compare it with what happened elsewhere. Define comparable completed cases first, then show their observed outcomes and the limits of applying them here.

Show the observed range or supported distribution, including failures and selection limitations. Adjustments for the present case need evidence and do not turn historical coverage into a guaranteed probability.

## Where it fits

Use this for an outside-view estimate; use insight-value-of-information to decide whether more research is worth its cost.

**Family:** Insight & decision. **Subagents:** Conditional.

## When to use it

- You want an outside-view forecast based on past cases.
- You want to check whether a schedule, cost, or outcome estimate is optimistic.

## When not to use it

- You want to assess whether more research is worth its cost; use insight-value-of-information.
- You lack a defensible comparison set and need a numeric forecast.

## How to use it

Start with a concrete request. For example:

```text
/insight-reference-class Estimate the likely duration of this migration using traceable completed migrations of similar size. Compare the observed range with our six-week plan.
```

## Flow

1. Define outcome, units, horizon, decision, and comparability criteria.
2. Build a traceable set of comparable completed cases, noting failures and exclusions.
3. Show the supported observed range or distribution.
4. Compare with the inside view and explain adjustments, limits, and what could change the estimate.

## Common questions

**What if there is no defensible comparison set?**

Report insufficient evidence and a path to collect it rather than manufacture a numeric forecast.

**Can a small sample justify a precise percentile?**

Only if the data support it. Label small or biased samples and do not invent cases or percentiles to make the result look complete.

## It is working when

- The report traces cases and exclusions to sources and explains their comparability.
- The estimate or evidence-insufficient conclusion states sensitivity, adjustments and limitations.

## Subagents

Inline by default. Workers only when requested or host-permitted and a specific evidence gap justifies them; useful slices include case retrieval, selection challenge, and calculation checks.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

An outside-view estimate or evidence-insufficient conclusion with sources, limits, adjustments, and sensitivity.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/insight-reference-class/SKILL.md](../../skills/insight-reference-class/SKILL.md)
- [skills/insight-reference-class/protocol.yon](../../skills/insight-reference-class/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
