# audit-coupled-constant

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Audit duplicated constants for drift.

**Family:** Code & architecture. **Subagents:** No subagent step prescribed.

## When to use it

- A timeout or threshold changes
- Comments require values to stay synchronized

## When not to use it

- A single imported constant is compiler-enforced

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/audit-coupled-constant check the retry timeout across this repository
```

## Flow

1. List all representations and units
2. Search each representation across the relevant scope
3. Classify hits and repair missed sites and bidirectional references
4. Report evidence and intentional differences

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A classified audit report and any authorized repairs.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/audit-coupled-constant/SKILL.md](../../skills/audit-coupled-constant/SKILL.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
