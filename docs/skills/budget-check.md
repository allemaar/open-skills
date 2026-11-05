# budget-check

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Checks usage before an expensive agent wave, returning go, no-go or unknown.

**Family:** Orchestration & dispatch. **Subagents:** No subagent step prescribed.

## When to use it

- A large fan-out is planned.
- You have a token ceiling to test.

## When not to use it

- You need an authoritative billing or plan-quota reading.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/budget-check Check whether this agent wave can start.
```

## Flow

1. Run the bundled wrapper from its skill directory using an already-installed ccusage reader; unavailable readers return unknown without package acquisition. Supplied numeric flags need values; omitted flags retain defaults.
2. Read the active block, ceiling and verdict.
3. Reduce or defer a no-go wave; never treat unknown as go.

## Subagents

The check does not dispatch agents.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A verdict with usage context.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/budget-check/SKILL.md](../../skills/budget-check/SKILL.md)
- [skills/budget-check/protocol.yon](../../skills/budget-check/protocol.yon)
- [skills/budget-check/references/tools/budget-check.mjs](../../skills/budget-check/references/tools/budget-check.mjs)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
