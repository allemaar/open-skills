# caller-options

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Routes one skill invocation among viable modes and execution venues.

**Family:** Orchestration & dispatch. **Subagents:** Conditional.

## When to use it

- A skill declares meaningful venue choices.
- A skill has multiple viable execution paths.

## When not to use it

- You are selecting a persistent session mode.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/caller-options Route this investigation between inline and delegated execution.
```

## Flow

1. Triage choices and proceed directly if one dominates.
2. Eliminate unavailable or unsafe combinations and compare survivors.
3. Surface material choices and execute the selected path.
4. For delegation, use the resolved marker and inspect the result.

## Subagents

Delegated or fan-out venues may be selected; self-orchestrators are not wrapped.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A chosen mode and venue.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/caller-options/SKILL.md](../../skills/caller-options/SKILL.md)
- [skills/caller-options/protocol.yon](../../skills/caller-options/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
