# human-merge

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Combines reports into one decision-ready account while accounting for shared sources, superseded claims, conflicts, and pooled gaps.

**Family:** Human output. **Subagents:** No subagent step prescribed.

## When to use it

- You have multiple reports, research summaries, or agent results on one subject.
- You need to know which findings are independent, contradicted, outdated, or collectively missing.

## When not to use it

- You have one text to simplify without changing claims; use human-rewrite.
- You need only the writing contract for a new report; use human-output.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/human-merge Combine these three review reports and show which evidence is independent.
```

## Flow

1. Inventory each input, its basis, author/date, and known shared sources.
2. Reconcile definitions and distinguish repeated claims from independent evidence.
3. Classify conflicts and order superseded findings without averaging disagreement away.
4. Pool coverage to reveal gaps absent from individual reports.
5. Present combined findings and limits in decision-relevant order.
6. Separate actual source uncertainty from source count; repeated evidence counts once without automatically lowering confirmed facts.

## Subagents

Merges reports that may come from agents but does not prescribe spawning or delegating work.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A consolidated report with source dependence, supersessions, conflict types, pooled coverage, and uncertainty.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/human-merge/SKILL.md](../../skills/human-merge/SKILL.md)
- [skills/human-merge/references/human-contract.md](../../skills/human-merge/references/human-contract.md)
- [skills/human-merge/references/examples/museum-archive.md](../../skills/human-merge/references/examples/museum-archive.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
