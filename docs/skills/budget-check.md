# budget-check

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You are planning a large agent wave and want a reading before starting it. Budget-check compares the active local usage block with a ceiling and returns go, no-go or unknown through its bundled wrapper.

By default the ceiling is the historical peak block, so the result is relative to prior usage rather than an account limit. Supply a known token limit when that is the boundary being checked; missing data remains unknown.

## Where it fits

Use this before a wave to inform the decision. It does not launch agents or establish an authoritative billing balance.

**Family:** Orchestration & dispatch. **Subagents:** No subagent step prescribed.

## When to use it

- A large fan-out is planned.
- You have a token ceiling to test.

## When not to use it

- You need an authoritative billing or plan-quota reading.

## How to use it

Start with a concrete request. For example:

```text
/budget-check Check this planned wave against my known 200000-token ceiling.
```

## Flow

1. Run the bundled wrapper from its skill directory using an already-installed ccusage reader; unavailable readers return unknown without package acquisition. Supplied numeric flags need values; omitted flags retain defaults.
2. Read the active block, ceiling and verdict.
3. Reduce or defer a no-go wave; never treat unknown as go.

## Common questions

**What does unknown mean for the wave?**

The check could not vouch for it. It does not become go; decide on other grounds and disclose the gap.

## It is working when

- The verdict includes the measured usage and ceiling basis, or the reason the check could not measure them.

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
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
