# investigate

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Before choosing a change, you need to know where the behavior lives and what depends on it. This read-only pass starts at relevant entry points and follows call sites and imports into a source-backed map.

The report identifies concrete files, patterns and constraints, and makes evidence gaps visible. It does not turn fact gathering into a plan or implementation.

## Where it fits

Use debug-task for executed reproduction of a specific failure and investigate for a source-backed map.

**Family:** Insight & decision. **Subagents:** Conditional.

## When to use it

- You need to understand dependencies or behavior.
- You want an evidence-backed code map.

## When not to use it

- You are asking for implementation or a plan.

## How to use it

Start with a concrete request. For example:

```text
/investigate Trace how an uploaded file reaches storage, including validation, callers and configuration. Report the relevant paths and unresolved links.
```

## Flow

1. Identify target and read entry points.
2. Trace relevant usages, imports and patterns.
3. Report findings, source anchors and gaps without making changes.

## Common questions

**Can investigation choose the future architecture?**

It supplies facts for that decision; evaluation and planning are separate tasks.

**Does this run or fix the suspected failure?**

No. It gathers facts without changes. Use a bounded debugging workflow if executed reproduction is needed.

## It is working when

- Findings name relevant paths and their relationships.
- The report distinguishes observed behavior from unresolved paths or unknowns.

## Subagents

Caller Options can select inline or delegated investigation.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A source-backed fact report.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/investigate/SKILL.md](../../skills/investigate/SKILL.md)
- [skills/investigate/protocol.yon](../../skills/investigate/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
