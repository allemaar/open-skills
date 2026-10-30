# investigate

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Gathers facts without changing the target.

**Family:** Insight & decision. **Subagents:** Conditional.

## When to use it

- You need to understand dependencies or behavior.
- You want an evidence-backed code map.

## When not to use it

- You are asking for implementation or a plan.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/investigate Investigate how authentication reaches the API.
```

## Flow

1. Identify target and read entry points.
2. Trace relevant usages, imports and patterns.
3. Report findings, source anchors and gaps without making changes.

## Subagents

Caller Options can select inline or delegated investigation.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A source-backed fact report.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/investigate/SKILL.md](../../skills/investigate/SKILL.md)
- [skills/investigate/protocol.yon](../../skills/investigate/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
