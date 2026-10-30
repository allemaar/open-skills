# insight-reference-class

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Forecasts an outcome from comparable completed cases and explains differences from the current plan's estimate.

**Family:** Insight & decision. **Subagents:** Conditional.

## When to use it

- You want an outside-view forecast based on past cases.
- You want to check whether a schedule, cost, or outcome estimate is optimistic.

## When not to use it

- You want to assess whether more research is worth its cost; use insight-value-of-information.
- You lack a defensible comparison set and need a numeric forecast.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/insight-reference-class Estimate likely delivery range from comparable completed migrations.
```

## Flow

1. Define outcome, units, horizon, decision, and comparability criteria.
2. Build a traceable set of comparable completed cases, noting failures and exclusions.
3. Show the supported observed range or distribution.
4. Compare with the inside view and explain adjustments, limits, and what could change the estimate.

## Subagents

Inline by default. Workers only when requested or host-permitted and a specific evidence gap justifies them; useful slices include case retrieval, selection challenge, and calculation checks.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

An outside-view estimate or evidence-insufficient conclusion with sources, limits, adjustments, and sensitivity.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/insight-reference-class/SKILL.md](../../skills/insight-reference-class/SKILL.md)
- [skills/insight-reference-class/protocol.yon](../../skills/insight-reference-class/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
